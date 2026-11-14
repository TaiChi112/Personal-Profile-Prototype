import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { registerAiSdkMocks } from "./helpers/aiSdkMock";

registerAiSdkMocks();

import {
  getAiBridgeHealthSnapshotAsync,
  resetAllBridgeCircuits,
  resetRouteBridgeCircuitAsync,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";
import {
  MemoryBridgeStateStore,
  RedisBridgeStateStore,
  type RedisClientLike,
  setBridgeStateStore,
} from "@/app/lib/ai/stateStore";

function createFakeRedisClient(options?: {
  failReadsWrites?: boolean;
}): RedisClientLike {
  const kv = new Map<string, string>();
  const lists = new Map<string, string[]>();
  const fail = Boolean(options?.failReadsWrites);

  return {
    status: "ready",
    async get(key) {
      if (fail) throw new Error("ECONNREFUSED");
      return kv.get(key) ?? null;
    },
    async set(key, value) {
      if (fail) throw new Error("ECONNREFUSED");
      kv.set(key, value);
      return "OK";
    },
    async del(...keys) {
      if (fail) throw new Error("ECONNREFUSED");
      let deleted = 0;
      for (const k of keys) {
        if (kv.delete(k) || lists.delete(k)) deleted += 1;
      }
      return deleted;
    },
    async lpush(key, ...values) {
      if (fail) throw new Error("ECONNREFUSED");
      const current = lists.get(key) ?? [];
      for (const val of values) {
        current.unshift(val);
      }
      lists.set(key, current);
      return current.length;
    },
    async ltrim(key, start, stop) {
      if (fail) throw new Error("ECONNREFUSED");
      const current = lists.get(key) ?? [];
      lists.set(key, current.slice(start, stop + 1));
      return "OK";
    },
    async lrange(key, start, stop) {
      if (fail) throw new Error("ECONNREFUSED");
      const current = lists.get(key) ?? [];
      return current.slice(start, stop + 1);
    },
    async llen(key) {
      if (fail) throw new Error("ECONNREFUSED");
      return (lists.get(key) ?? []).length;
    },
    async expire() {
      return 1;
    },
  };
}

describe("AI Bridge State Store & Cross-Instance Sync", () => {
  const originalGoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  beforeEach(() => {
    setBridgeStateStore(null);
    resetAllBridgeCircuits();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";
  });

  afterEach(() => {
    setBridgeStateStore(null);
    resetAllBridgeCircuits();
    if (originalGoogleKey === undefined) {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalGoogleKey;
    }
  });

  it("caps memory audit ring buffer and scrubs accidental raw PII from event details", async () => {
    const store = new MemoryBridgeStateStore(3);
    for (let i = 1; i <= 5; i += 1) {
      await store.appendAuditEvent({
        id: `ev-${i}`,
        timestamp: new Date().toISOString(),
        routeKey: "stateflow:intent",
        eventType: "REQUEST_COMPLETED",
        detail: `Call ${i} user rawin@example.com id 1100200300405 phone 0812345678`,
      });
    }

    const events = await store.listAuditEvents(10);
    expect(events.length).toBe(3);
    expect(events[0]?.id).toBe("ev-5");
    expect(events[0]?.detail).not.toContain("rawin@example.com");
    expect(events[0]?.detail).not.toContain("1100200300405");
    expect(events[0]?.detail).not.toContain("0812345678");
    expect(events[0]?.detail).toContain("[REDACTED_EMAIL]");
    expect(events[0]?.detail).toContain("[REDACTED_THAI_ID]");
    expect(events[0]?.detail).toContain("[REDACTED_PHONE]");
  });

  it("shares OPEN circuit state across fresh runtime instances via RedisBridgeStateStore", async () => {
    const sharedRedis = createFakeRedisClient();

    // Worker 1 trips the circuit for chat:assistant
    setBridgeStateStore(new RedisBridgeStateStore(sharedRedis));
    for (let i = 0; i < 3; i += 1) {
      await runWithCircuitGuard({
        routeKey: "chat:assistant",
        execute: async () => {
          throw new Error("Upstream 503");
        },
      });
    }

    // Simulate Worker 2 booting cleanly with empty local memory connected to same Redis
    setBridgeStateStore(new RedisBridgeStateStore(sharedRedis));
    resetAllBridgeCircuits();

    const worker2Result = await runWithCircuitGuard({
      routeKey: "chat:assistant",
      execute: async () => "should-not-run",
    });

    expect(worker2Result.ok).toBe(false);
    if (!worker2Result.ok) {
      expect(worker2Result.reason).toBe("CIRCUIT_OPEN");
      expect(worker2Result.circuitState).toBe("OPEN");
    }

    const snapshot = await getAiBridgeHealthSnapshotAsync({
      routeKey: "chat:assistant",
    });
    expect(snapshot.persistence.driver).toBe("redis");
    expect(snapshot.persistence.connected).toBe(true);
    expect(snapshot.routes[0]?.circuit.state).toBe("OPEN");

    await resetRouteBridgeCircuitAsync("chat:assistant", "ADMIN_TOKEN");
    const afterReset = await getAiBridgeHealthSnapshotAsync({
      routeKey: "chat:assistant",
    });
    expect(afterReset.routes[0]?.circuit.state).toBe("CLOSED");
    expect(
      afterReset.recentAuditEvents.some(
        (ev) => ev.eventType === "ADMIN_RESET" && ev.actor === "ADMIN_TOKEN",
      ),
    ).toBe(true);
  });

  it("degrades fail-open to L1 memory without throwing when Redis errors", async () => {
    const failingRedis = createFakeRedisClient({ failReadsWrites: true });
    setBridgeStateStore(new RedisBridgeStateStore(failingRedis));

    const result = await runWithCircuitGuard({
      routeKey: "terminal:stream",
      execute: async () => "live-ok",
    });

    expect(result.ok).toBe(true);
    const snapshot = await getAiBridgeHealthSnapshotAsync({
      routeKey: "terminal:stream",
    });
    expect(snapshot.persistence.driver).toBe("redis");
    expect(snapshot.persistence.connected).toBe(false);
    expect(snapshot.recentAuditEvents.length).toBeGreaterThanOrEqual(1);
  });
});
