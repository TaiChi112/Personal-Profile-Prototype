import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { NextRequest } from "next/server";
import { z } from "zod";
import { mockGenerateObject, registerAiSdkMocks } from "./helpers/aiSdkMock";

const mockAuth = mock<() => Promise<{ user?: { role?: string } } | null>>(
  async () => null,
);

mock.module("@/auth", () => ({
  auth: mockAuth,
}));

registerAiSdkMocks();

import {
  MemoryBridgeArchiveRepository,
  PrismaBridgeArchiveRepository,
  type PrismaArchiveClientLike,
  type PrismaArchiveRow,
  setBridgeArchiveRepository,
} from "@/app/lib/ai/auditArchive";
import {
  executeGeminiBridge,
  getAiBridgeHealthSnapshotAsync,
  resetAllBridgeCircuits,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";
import {
  AiBridgeHealthResponseSchema,
  calculateModelCostMicros,
  microsToUsd,
} from "@/app/lib/ai/healthContract";
import {
  RedisBridgeStateStore,
  type RedisClientLike,
  setBridgeStateStore,
} from "@/app/lib/ai/stateStore";
import { GET, POST } from "@/app/api/health/ai-bridge/route";

function createFakeRedisWithHashes(options?: {
  failAll?: boolean;
}): RedisClientLike {
  const kv = new Map<string, string>();
  const lists = new Map<string, string[]>();
  const hashes = new Map<string, Map<string, number>>();
  const fail = Boolean(options?.failAll);

  return {
    status: "ready",
    async get(key) {
      if (fail) throw new Error("REDIS_OFFLINE");
      return kv.get(key) ?? null;
    },
    async set(key, value) {
      if (fail) throw new Error("REDIS_OFFLINE");
      kv.set(key, value);
      return "OK";
    },
    async del(...keys) {
      if (fail) throw new Error("REDIS_OFFLINE");
      let deleted = 0;
      for (const key of keys) {
        if (kv.delete(key) || lists.delete(key) || hashes.delete(key)) {
          deleted += 1;
        }
      }
      return deleted;
    },
    async lpush(key, ...values) {
      if (fail) throw new Error("REDIS_OFFLINE");
      const current = lists.get(key) ?? [];
      for (const val of values) current.unshift(val);
      lists.set(key, current);
      return current.length;
    },
    async ltrim(key, start, stop) {
      if (fail) throw new Error("REDIS_OFFLINE");
      const current = lists.get(key) ?? [];
      lists.set(key, current.slice(start, stop + 1));
      return "OK";
    },
    async lrange(key, start, stop) {
      if (fail) throw new Error("REDIS_OFFLINE");
      return (lists.get(key) ?? []).slice(start, stop + 1);
    },
    async llen(key) {
      if (fail) throw new Error("REDIS_OFFLINE");
      return (lists.get(key) ?? []).length;
    },
    async hincrby(key, field, increment) {
      if (fail) throw new Error("REDIS_OFFLINE");
      let map = hashes.get(key);
      if (!map) {
        map = new Map<string, number>();
        hashes.set(key, map);
      }
      const next = (map.get(field) ?? 0) + increment;
      map.set(field, next);
      return next;
    },
    async hgetall(key) {
      if (fail) throw new Error("REDIS_OFFLINE");
      const map = hashes.get(key);
      if (!map) return {};
      const out: Record<string, string> = {};
      for (const [k, v] of map.entries()) out[k] = String(v);
      return out;
    },
    async expire() {
      return 1;
    },
  };
}

function createFakePrismaClient(options?: { fail?: boolean }): {
  client: PrismaArchiveClientLike;
  rows: Map<string, PrismaArchiveRow>;
  daily: Map<string, Record<string, number>>;
} {
  const rows = new Map<string, PrismaArchiveRow>();
  const daily = new Map<string, Record<string, number>>();
  const fail = Boolean(options?.fail);

  const client: PrismaArchiveClientLike = {
    aiBridgeAuditLog: {
      async createMany({ data, skipDuplicates }) {
        if (fail) throw new Error("POSTGRES_UNREACHABLE");
        let count = 0;
        for (const item of data) {
          if (skipDuplicates && rows.has(item.id)) continue;
          rows.set(item.id, { ...item });
          count += 1;
        }
        return { count };
      },
      async findMany({ where, take }) {
        if (fail) throw new Error("POSTGRES_UNREACHABLE");
        const routeFilter =
          typeof where?.routeKey === "string" ? where.routeKey : undefined;
        const list = Array.from(rows.values())
          .filter((r) => (routeFilter ? r.routeKey === routeFilter : true))
          .sort(
            (a, b) => b.eventTimestamp.getTime() - a.eventTimestamp.getTime(),
          );
        return list.slice(0, take ?? 50);
      },
      async count() {
        if (fail) throw new Error("POSTGRES_UNREACHABLE");
        return rows.size;
      },
      async deleteMany() {
        if (fail) throw new Error("POSTGRES_UNREACHABLE");
        const count = rows.size;
        rows.clear();
        return { count };
      },
    },
    aiBridgeDailyUsage: {
      async upsert({ where, create }) {
        if (fail) throw new Error("POSTGRES_UNREACHABLE");
        const key = `${where.dateKey_routeKey.dateKey}:${where.dateKey_routeKey.routeKey}`;
        const prev = daily.get(key) ?? {
          requestCount: 0,
          totalTokens: 0,
          costUsdMicros: 0,
        };
        daily.set(key, {
          requestCount: prev.requestCount + Number(create.requestCount ?? 0),
          totalTokens: prev.totalTokens + Number(create.totalTokens ?? 0),
          costUsdMicros: prev.costUsdMicros + Number(create.costUsdMicros ?? 0),
        });
        return {};
      },
    },
  };

  return { client, rows, daily };
}

describe("EPIC-035 Phase 2: FinOps Quota Guardrail & Cold Audit Archive", () => {
  const envBackup = {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GLM_API_KEY: process.env.GLM_API_KEY,
    AI_BRIDGE_DAILY_TOKEN_LIMIT: process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT,
    AI_BRIDGE_DAILY_COST_USD_LIMIT: process.env.AI_BRIDGE_DAILY_COST_USD_LIMIT,
    AI_BRIDGE_ENFORCE_BUDGET_GUARD: process.env.AI_BRIDGE_ENFORCE_BUDGET_GUARD,
    AI_BRIDGE_ADMIN_TOKEN: process.env.AI_BRIDGE_ADMIN_TOKEN,
    AI_BRIDGE_ENFORCE_ADMIN_GUARD: process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD,
  };

  beforeEach(() => {
    setBridgeStateStore(null);
    setBridgeArchiveRepository(null);
    resetAllBridgeCircuits();
    mockGenerateObject.mockReset();
    mockAuth.mockReset();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";
    process.env.GLM_API_KEY = "test-glm-key";
    delete process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT;
    delete process.env.AI_BRIDGE_DAILY_COST_USD_LIMIT;
    delete process.env.AI_BRIDGE_ENFORCE_BUDGET_GUARD;
    delete process.env.AI_BRIDGE_ADMIN_TOKEN;
    delete process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD;
  });

  afterEach(() => {
    setBridgeStateStore(null);
    setBridgeArchiveRepository(null);
    resetAllBridgeCircuits();
    for (const [k, v] of Object.entries(envBackup)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("computes deterministic micro-USD token costs without floating-point drift", () => {
    const micros = calculateModelCostMicros({
      modelName: "gemini-2.5-flash",
      promptTokens: 1_000,
      completionTokens: 400,
    });
    // 1000 * 300k/1M = 300 microUSD, 400 * 2.5M/1M = 1000 microUSD => 1300 microUSD ($0.0013)
    expect(micros).toBe(1300);
    expect(microsToUsd(micros)).toBe(0.0013);
    expect(
      calculateModelCostMicros({
        modelName: "glm-5.3-flash",
        promptTokens: 0,
        completionTokens: 0,
      }),
    ).toBe(0);
  });

  it("enforces daily token cap with BUDGET_EXCEEDED short-circuit and DEGRADED global status", async () => {
    process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT = "100";
    process.env.AI_BRIDGE_DAILY_COST_USD_LIMIT = "5.0";

    mockGenerateObject.mockResolvedValueOnce({
      object: { answer: "ok" },
      usage: { promptTokens: 80, completionTokens: 40 },
    });

    const first = await executeGeminiBridge({
      routeKey: "stateflow:intent",
      schema: z.object({ answer: z.string() }),
      system: "sys",
      prompt: "hi",
    });
    expect(first.ok).toBe(true);
    expect(mockGenerateObject).toHaveBeenCalledTimes(1);

    // Second call must trip daily token quota BEFORE calling generateObject
    const second = await executeGeminiBridge({
      routeKey: "stateflow:intent",
      schema: z.object({ answer: z.string() }),
      system: "sys",
      prompt: "blocked prompt",
    });
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.reason).toBe("BUDGET_EXCEEDED");
    }
    expect(mockGenerateObject).toHaveBeenCalledTimes(1);

    const snapshot = await getAiBridgeHealthSnapshotAsync();
    expect(snapshot.status).toBe("DEGRADED");
    expect(snapshot.finops.tokensUsed).toBe(120);
    expect(snapshot.finops.isBudgetExceeded).toBe(true);
    expect(
      snapshot.recentAuditEvents.some((e) => e.eventType === "BUDGET_EXCEEDED"),
    ).toBe(true);
  });

  it("permits upstream calls when AI_BRIDGE_ENFORCE_BUDGET_GUARD=false even over limit", async () => {
    process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT = "10";
    process.env.AI_BRIDGE_ENFORCE_BUDGET_GUARD = "false";

    mockGenerateObject.mockResolvedValue({
      object: { ok: true },
      usage: { inputTokens: 25, outputTokens: 25 },
    });

    const first = await runWithCircuitGuard({
      routeKey: "agentic-testing:intent",
      modelName: "gemini-2.5-flash",
      extractUsage: () => ({ promptTokens: 25, completionTokens: 25 }),
      execute: async () => ({ ok: true }),
    });
    const second = await runWithCircuitGuard({
      routeKey: "agentic-testing:intent",
      modelName: "gemini-2.5-flash",
      extractUsage: () => ({ promptTokens: 25, completionTokens: 25 }),
      execute: async () => ({ ok: true }),
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("syncs FinOps daily usage across Redis instances and fails open when Redis is unreachable", async () => {
    process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT = "1000";
    const redis = createFakeRedisWithHashes();
    const workerA = new RedisBridgeStateStore(redis);
    const workerB = new RedisBridgeStateStore(redis);

    setBridgeStateStore(workerA);
    await runWithCircuitGuard({
      routeKey: "pms:draft-goal",
      modelName: "gemini-2.5-flash",
      extractUsage: () => ({ promptTokens: 400, completionTokens: 600 }),
      execute: async () => ({ done: true }),
    });

    // Worker B shares exact Redis counter & short-circuits immediately
    setBridgeStateStore(workerB);
    let upstreamInvoked = false;
    const blocked = await runWithCircuitGuard({
      routeKey: "pms:evaluation",
      execute: async () => {
        upstreamInvoked = true;
        return { done: true };
      },
    });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.reason).toBe("BUDGET_EXCEEDED");
    }
    expect(upstreamInvoked).toBe(false);

    // Offline Redis fails open to L1 memory without throwing
    const offlineRedis = new RedisBridgeStateStore(
      createFakeRedisWithHashes({ failAll: true }),
    );
    setBridgeStateStore(offlineRedis);
    const fallbackAllowed = await runWithCircuitGuard({
      routeKey: "pms:feedback",
      extractUsage: () => ({ promptTokens: 10, completionTokens: 10 }),
      execute: async () => ({ ok: true }),
    });
    expect(fallbackAllowed.ok).toBe(true);
    expect(offlineRedis.getPersistenceStatus().connected).toBe(false);
  });

  it("archives PII-scrubbed audit events idempotently via Prisma repository and fails open on DB error", async () => {
    const fakeDb = createFakePrismaClient();
    const repo = new PrismaBridgeArchiveRepository(fakeDb.client);
    setBridgeArchiveRepository(repo);

    await repo.archiveEvents([
      {
        id: "audit-1",
        timestamp: new Date().toISOString(),
        routeKey: "stateflow:intent",
        eventType: "REQUEST_COMPLETED",
        outcome: "LIVE_GEMINI",
        promptTokens: 50,
        completionTokens: 25,
        totalTokens: 75,
        costUsdMicros: 78,
        detail:
          "Prompt from user@example.com phone 081-234-5678 ID 1-2345-67890-12-3",
      },
    ]);
    // Duplicate ID must be ignored via skipDuplicates
    const secondInsert = await repo.archiveEvents([
      {
        id: "audit-1",
        timestamp: new Date().toISOString(),
        routeKey: "stateflow:intent",
        eventType: "REQUEST_COMPLETED",
      },
    ]);
    expect(secondInsert).toBe(0);
    expect(fakeDb.rows.size).toBe(1);

    const storedRow = fakeDb.rows.get("audit-1");
    expect(storedRow?.detail).not.toContain("user@example.com");
    expect(storedRow?.detail).not.toContain("081-234-5678");
    expect(storedRow?.detail).not.toContain("1-2345-67890-12-3");

    const listed = await repo.listArchivedEvents({
      routeKey: "stateflow:intent",
    });
    expect(listed.length).toBe(1);
    expect(listed[0]?.totalTokens).toBe(75);

    // Offline DB fails open cleanly
    const brokenRepo = new PrismaBridgeArchiveRepository(
      createFakePrismaClient({ fail: true }).client,
    );
    const brokenInserted = await brokenRepo.archiveEvents([
      {
        id: "audit-2",
        timestamp: new Date().toISOString(),
        routeKey: "terminal:stream",
        eventType: "REQUEST_COMPLETED",
      },
    ]);
    expect(brokenInserted).toBe(0);
    expect((await brokenRepo.getArchiveStatus()).connected).toBe(false);
    expect(await brokenRepo.listArchivedEvents()).toEqual([]);
  });

  it("supports ARCHIVE_FLUSH, RESET_DAILY_BUDGET, and auditSource=archive behind Admin Role Guard", async () => {
    process.env.AI_BRIDGE_ADMIN_TOKEN = "finops-secret";
    process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT = "100";

    const memArchive = new MemoryBridgeArchiveRepository();
    setBridgeArchiveRepository(memArchive);

    mockGenerateObject.mockResolvedValueOnce({
      object: { ok: true },
      usage: { promptTokens: 70, completionTokens: 60 },
    });
    await executeGeminiBridge({
      routeKey: "chat:assistant",
      schema: z.object({ ok: z.boolean() }),
      system: "sys",
      prompt: "hello",
    });

    // Unauthenticated POST must still be rejected with RFC 7807 403
    const forbiddenRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_DAILY_BUDGET" }),
      }),
    );
    expect(forbiddenRes.status).toBe(403);

    // Authorized ARCHIVE_FLUSH flushes buffered events cleanly
    const flushRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ai-bridge-admin-token": "finops-secret",
        },
        body: JSON.stringify({ action: "ARCHIVE_FLUSH" }),
      }),
    );
    expect(flushRes.status).toBe(200);
    const flushJson = (await flushRes.json()) as {
      ok: boolean;
      actionApplied: string;
    };
    expect(flushJson.ok).toBe(true);
    expect(flushJson.actionApplied).toBe("ARCHIVE_FLUSH");

    // GET with auditSource=archive reads cold archive records cleanly
    const archiveGetRes = await GET(
      new NextRequest(
        "http://localhost:3000/api/health/ai-bridge?auditSource=archive",
      ),
    );
    expect(archiveGetRes.status).toBe(200);
    const archiveSnapshot = AiBridgeHealthResponseSchema.parse(
      await archiveGetRes.json(),
    );
    expect(archiveSnapshot.archive.driver).toBe("memory");
    expect(archiveSnapshot.finops.isBudgetExceeded).toBe(true);
    expect(
      archiveSnapshot.recentAuditEvents.some(
        (ev) => ev.eventType === "AUDIT_ARCHIVED",
      ),
    ).toBe(true);

    // Authorized RESET_DAILY_BUDGET clears daily spend and restores remaining budget
    const resetBudgetRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ai-bridge-admin-token": "finops-secret",
        },
        body: JSON.stringify({ action: "RESET_DAILY_BUDGET" }),
      }),
    );
    expect(resetBudgetRes.status).toBe(200);
    const resetJson = (await resetBudgetRes.json()) as {
      snapshot: unknown;
    };
    const resetSnapshot = AiBridgeHealthResponseSchema.parse(
      resetJson.snapshot,
    );
    expect(resetSnapshot.finops.tokensUsed).toBe(0);
    expect(resetSnapshot.finops.isBudgetExceeded).toBe(false);
  });
});
