import Redis from "ioredis";
import {
  type AiBridgeAuditEvent,
  AiBridgeAuditEventSchema,
  type AiBridgePersistenceStatus,
} from "@/app/lib/ai/healthContract";

export const DEFAULT_MAX_AUDIT_EVENTS = 100;
const CIRCUIT_KEY_PREFIX = "ai_bridge:circuit:";
const AUDIT_LIST_KEY = "ai_bridge:audit:events";
const BUDGET_KEY_PREFIX = "ai_bridge:budget:";
const CLOSED_FAILURE_TTL_MS = 300_000;
const AUDIT_KEY_TTL_SECONDS = 86_400;
const BUDGET_KEY_TTL_SECONDS = 172_800;

export interface PersistedCircuitState {
  failures: number;
  openedAt: number | null;
  updatedAtMs: number;
}

export interface DailyBudgetUsage {
  dateKey: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsdMicros: number;
}

export interface RecordDailyUsageInput {
  dateKey: string;
  routeKey: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsdMicros: number;
}

export interface RedisClientLike {
  status?: string;
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    expiryMode: "PX",
    time: number,
  ): Promise<unknown>;
  del(...keys: string[]): Promise<number>;
  lpush(key: string, ...values: string[]): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<unknown>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  llen(key: string): Promise<number>;
  hincrby?(key: string, field: string, increment: number): Promise<number>;
  hgetall?(key: string): Promise<Record<string, string>>;
  expire?(key: string, seconds: number): Promise<number>;
  on?(event: string, listener: (...args: unknown[]) => void): unknown;
}

export interface BridgeStateStore {
  getPersistenceStatus(): AiBridgePersistenceStatus;
  getCachedCircuit(routeKey: string): PersistedCircuitState | null;
  getCachedAuditEvents(limit?: number, routeKey?: string): AiBridgeAuditEvent[];
  getCachedDailyUsage(dateKey: string): DailyBudgetUsage;
  loadRouteCircuit(routeKey: string): Promise<PersistedCircuitState | null>;
  saveRouteCircuit(
    routeKey: string,
    state: PersistedCircuitState,
    cooldownMs: number,
  ): Promise<void>;
  deleteRouteCircuit(routeKey?: string): Promise<void>;
  appendAuditEvent(event: AiBridgeAuditEvent): Promise<void>;
  listAuditEvents(
    limit?: number,
    routeKey?: string,
  ): Promise<AiBridgeAuditEvent[]>;
  clearAuditEvents(routeKey?: string): Promise<void>;
  getDailyUsage(dateKey: string): Promise<DailyBudgetUsage>;
  recordDailyUsage(input: RecordDailyUsageInput): Promise<DailyBudgetUsage>;
  resetDailyUsage(dateKey?: string): Promise<void>;
  clearAllSync(): void;
}

/**
 * Defense-in-depth scrub ensuring audit metadata strings can never persist raw PII.
 */
export function sanitizeAuditDetail(detail?: string): string | undefined {
  if (!detail) return undefined;
  return detail
    .replace(/\b\d-\d{4}-\d{5}-\d{2}-\d\b/g, "[REDACTED_THAI_ID]")
    .replace(/(?<!\d)\d{13}(?!\d)/g, "[REDACTED_THAI_ID]")
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      "[REDACTED_EMAIL]",
    )
    .replace(/(?:\+66|0)[689]\d{1}[-\s]?\d{3}[-\s]?\d{4}/g, "[REDACTED_PHONE]")
    .slice(0, 180);
}

function normalizeAuditEvent(event: AiBridgeAuditEvent): AiBridgeAuditEvent {
  return {
    ...event,
    detail: sanitizeAuditDetail(event.detail),
  };
}

export class MemoryBridgeStateStore implements BridgeStateStore {
  private readonly maxAuditEvents: number;
  private readonly circuits = new Map<string, PersistedCircuitState>();
  private readonly dailyUsage = new Map<string, DailyBudgetUsage>();
  private auditEvents: AiBridgeAuditEvent[] = [];

  constructor(maxAuditEvents = DEFAULT_MAX_AUDIT_EVENTS) {
    this.maxAuditEvents = maxAuditEvents;
  }

  getPersistenceStatus(): AiBridgePersistenceStatus {
    return {
      driver: "memory",
      connected: true,
      auditEventCount: this.auditEvents.length,
    };
  }

  getCachedCircuit(routeKey: string): PersistedCircuitState | null {
    return this.circuits.get(routeKey) ?? null;
  }

  getCachedAuditEvents(limit = 50, routeKey?: string): AiBridgeAuditEvent[] {
    const filtered = routeKey
      ? this.auditEvents.filter((item) => item.routeKey === routeKey)
      : this.auditEvents;
    return filtered.slice(0, Math.max(0, limit));
  }

  getCachedDailyUsage(dateKey: string): DailyBudgetUsage {
    return (
      this.dailyUsage.get(dateKey) ?? {
        dateKey,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        costUsdMicros: 0,
      }
    );
  }

  setCachedDailyUsage(usage: DailyBudgetUsage): void {
    this.dailyUsage.set(usage.dateKey, usage);
  }

  async loadRouteCircuit(
    routeKey: string,
  ): Promise<PersistedCircuitState | null> {
    return this.getCachedCircuit(routeKey);
  }

  async saveRouteCircuit(
    routeKey: string,
    state: PersistedCircuitState,
  ): Promise<void> {
    this.circuits.set(routeKey, state);
  }

  async deleteRouteCircuit(routeKey?: string): Promise<void> {
    if (routeKey) {
      this.circuits.delete(routeKey);
      return;
    }
    this.circuits.clear();
  }

  async appendAuditEvent(event: AiBridgeAuditEvent): Promise<void> {
    this.appendAuditEventSync(event);
  }

  appendAuditEventSync(event: AiBridgeAuditEvent): void {
    const safeEvent = normalizeAuditEvent(event);
    this.auditEvents.unshift(safeEvent);
    if (this.auditEvents.length > this.maxAuditEvents) {
      this.auditEvents = this.auditEvents.slice(0, this.maxAuditEvents);
    }
  }

  async listAuditEvents(
    limit = 50,
    routeKey?: string,
  ): Promise<AiBridgeAuditEvent[]> {
    return this.getCachedAuditEvents(limit, routeKey);
  }

  async clearAuditEvents(routeKey?: string): Promise<void> {
    if (routeKey) {
      this.auditEvents = this.auditEvents.filter(
        (item) => item.routeKey !== routeKey,
      );
      return;
    }
    this.auditEvents = [];
  }

  async getDailyUsage(dateKey: string): Promise<DailyBudgetUsage> {
    return this.getCachedDailyUsage(dateKey);
  }

  async recordDailyUsage(
    input: RecordDailyUsageInput,
  ): Promise<DailyBudgetUsage> {
    const current = this.getCachedDailyUsage(input.dateKey);
    const updated: DailyBudgetUsage = {
      dateKey: input.dateKey,
      promptTokens: current.promptTokens + Math.max(0, input.promptTokens),
      completionTokens:
        current.completionTokens + Math.max(0, input.completionTokens),
      totalTokens: current.totalTokens + Math.max(0, input.totalTokens),
      costUsdMicros: current.costUsdMicros + Math.max(0, input.costUsdMicros),
    };
    this.dailyUsage.set(input.dateKey, updated);
    return updated;
  }

  async resetDailyUsage(dateKey?: string): Promise<void> {
    if (dateKey) {
      this.dailyUsage.delete(dateKey);
      return;
    }
    this.dailyUsage.clear();
  }

  clearAllSync(): void {
    this.circuits.clear();
    this.dailyUsage.clear();
    this.auditEvents = [];
  }
}

export class RedisBridgeStateStore implements BridgeStateStore {
  private readonly client: RedisClientLike;
  private readonly l1Memory: MemoryBridgeStateStore;
  private readonly maxAuditEvents: number;
  private lastConnected = true;
  private knownAuditCount = 0;

  constructor(client: RedisClientLike, options?: { maxAuditEvents?: number }) {
    this.client = client;
    this.maxAuditEvents = options?.maxAuditEvents ?? DEFAULT_MAX_AUDIT_EVENTS;
    this.l1Memory = new MemoryBridgeStateStore(this.maxAuditEvents);

    if (typeof this.client.on === "function") {
      this.client.on("ready", () => {
        this.lastConnected = true;
      });
      this.client.on("error", () => {
        this.lastConnected = false;
      });
      this.client.on("end", () => {
        this.lastConnected = false;
      });
    }
  }

  getPersistenceStatus(): AiBridgePersistenceStatus {
    const status = this.client.status;
    const isClientReady = status === "end" ? false : this.lastConnected;
    return {
      driver: "redis",
      connected: isClientReady,
      auditEventCount: Math.max(
        this.knownAuditCount,
        this.l1Memory.getPersistenceStatus().auditEventCount,
      ),
    };
  }

  getCachedCircuit(routeKey: string): PersistedCircuitState | null {
    return this.l1Memory.getCachedCircuit(routeKey);
  }

  getCachedAuditEvents(limit = 50, routeKey?: string): AiBridgeAuditEvent[] {
    return this.l1Memory.getCachedAuditEvents(limit, routeKey);
  }

  getCachedDailyUsage(dateKey: string): DailyBudgetUsage {
    return this.l1Memory.getCachedDailyUsage(dateKey);
  }

  private async runFailOpen<T>(
    operation: () => Promise<T>,
    fallback: () => T,
  ): Promise<T> {
    try {
      const value = await operation();
      this.lastConnected = true;
      return value;
    } catch {
      this.lastConnected = false;
      return fallback();
    }
  }

  async loadRouteCircuit(
    routeKey: string,
  ): Promise<PersistedCircuitState | null> {
    return this.runFailOpen(
      async () => {
        const raw = await this.client.get(`${CIRCUIT_KEY_PREFIX}${routeKey}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<PersistedCircuitState>;
        if (
          typeof parsed.failures !== "number" ||
          typeof parsed.updatedAtMs !== "number"
        ) {
          return null;
        }
        const state: PersistedCircuitState = {
          failures: Math.max(0, parsed.failures),
          openedAt:
            typeof parsed.openedAt === "number" ? parsed.openedAt : null,
          updatedAtMs: parsed.updatedAtMs,
        };
        await this.l1Memory.saveRouteCircuit(routeKey, state);
        return state;
      },
      () => this.l1Memory.getCachedCircuit(routeKey),
    );
  }

  async saveRouteCircuit(
    routeKey: string,
    state: PersistedCircuitState,
    cooldownMs: number,
  ): Promise<void> {
    await this.l1Memory.saveRouteCircuit(routeKey, state);
    const ttlMs =
      state.openedAt !== null
        ? Math.max(1_000, cooldownMs)
        : CLOSED_FAILURE_TTL_MS;

    await this.runFailOpen(
      async () => {
        await this.client.set(
          `${CIRCUIT_KEY_PREFIX}${routeKey}`,
          JSON.stringify(state),
          "PX",
          ttlMs,
        );
      },
      () => undefined,
    );
  }

  async deleteRouteCircuit(routeKey?: string): Promise<void> {
    await this.l1Memory.deleteRouteCircuit(routeKey);
    if (!routeKey) return;

    await this.runFailOpen(
      async () => {
        await this.client.del(`${CIRCUIT_KEY_PREFIX}${routeKey}`);
      },
      () => undefined,
    );
  }

  async appendAuditEvent(event: AiBridgeAuditEvent): Promise<void> {
    const safeEvent = normalizeAuditEvent(event);
    this.l1Memory.appendAuditEventSync(safeEvent);
    this.knownAuditCount = this.l1Memory.getPersistenceStatus().auditEventCount;

    await this.runFailOpen(
      async () => {
        const len = await this.client.lpush(
          AUDIT_LIST_KEY,
          JSON.stringify(safeEvent),
        );
        await this.client.ltrim(AUDIT_LIST_KEY, 0, this.maxAuditEvents - 1);
        if (typeof this.client.expire === "function") {
          await this.client.expire(AUDIT_LIST_KEY, AUDIT_KEY_TTL_SECONDS);
        }
        this.knownAuditCount = Math.min(len, this.maxAuditEvents);
      },
      () => undefined,
    );
  }

  async listAuditEvents(
    limit = 50,
    routeKey?: string,
  ): Promise<AiBridgeAuditEvent[]> {
    const safeLimit = Math.max(0, limit);
    return this.runFailOpen(
      async () => {
        const fetchLimit = routeKey
          ? this.maxAuditEvents - 1
          : Math.max(0, safeLimit - 1);
        const rows = await this.client.lrange(AUDIT_LIST_KEY, 0, fetchLimit);
        const totalLen = await this.client.llen(AUDIT_LIST_KEY);
        this.knownAuditCount = totalLen;

        const parsed: AiBridgeAuditEvent[] = [];
        for (const row of rows) {
          try {
            const candidate = AiBridgeAuditEventSchema.safeParse(
              JSON.parse(row),
            );
            if (candidate.success) {
              if (!routeKey || candidate.data.routeKey === routeKey) {
                parsed.push(candidate.data);
                if (parsed.length >= safeLimit) break;
              }
            }
          } catch {
            // Skip corrupted entry cleanly
          }
        }

        // Hydrate L1 cache when listing full set
        if (!routeKey && parsed.length > 0) {
          for (let i = parsed.length - 1; i >= 0; i -= 1) {
            const existing = this.l1Memory
              .getCachedAuditEvents(this.maxAuditEvents)
              .some((item) => item.id === parsed[i]?.id);
            if (!existing && parsed[i]) {
              this.l1Memory.appendAuditEventSync(parsed[i]);
            }
          }
        }

        return parsed;
      },
      () => this.l1Memory.getCachedAuditEvents(safeLimit, routeKey),
    );
  }

  async clearAuditEvents(routeKey?: string): Promise<void> {
    await this.l1Memory.clearAuditEvents(routeKey);
    if (routeKey) return;

    this.knownAuditCount = 0;
    await this.runFailOpen(
      async () => {
        await this.client.del(AUDIT_LIST_KEY);
      },
      () => undefined,
    );
  }

  async getDailyUsage(dateKey: string): Promise<DailyBudgetUsage> {
    if (typeof this.client.hgetall !== "function") {
      return this.l1Memory.getCachedDailyUsage(dateKey);
    }
    const hashKey = `${BUDGET_KEY_PREFIX}${dateKey}:global`;
    return this.runFailOpen(
      async () => {
        const raw = await this.client.hgetall?.(hashKey);
        if (!raw || Object.keys(raw).length === 0) {
          return this.l1Memory.getCachedDailyUsage(dateKey);
        }
        const hydrated: DailyBudgetUsage = {
          dateKey,
          promptTokens: Math.max(0, Number(raw.promptTokens ?? 0) || 0),
          completionTokens: Math.max(0, Number(raw.completionTokens ?? 0) || 0),
          totalTokens: Math.max(0, Number(raw.totalTokens ?? 0) || 0),
          costUsdMicros: Math.max(0, Number(raw.costUsdMicros ?? 0) || 0),
        };
        this.l1Memory.setCachedDailyUsage(hydrated);
        return hydrated;
      },
      () => this.l1Memory.getCachedDailyUsage(dateKey),
    );
  }

  async recordDailyUsage(
    input: RecordDailyUsageInput,
  ): Promise<DailyBudgetUsage> {
    const l1Updated = await this.l1Memory.recordDailyUsage(input);
    if (typeof this.client.hincrby !== "function") {
      return l1Updated;
    }

    const globalKey = `${BUDGET_KEY_PREFIX}${input.dateKey}:global`;
    const routeBudgetKey = `${BUDGET_KEY_PREFIX}${input.dateKey}:route:${input.routeKey}`;

    return this.runFailOpen(
      async () => {
        const pTokens = Math.max(0, Math.round(input.promptTokens));
        const cTokens = Math.max(0, Math.round(input.completionTokens));
        const tTokens = Math.max(0, Math.round(input.totalTokens));
        const micros = Math.max(0, Math.round(input.costUsdMicros));

        const [promptTokens, completionTokens, totalTokens, costUsdMicros] =
          await Promise.all([
            this.client.hincrby!(globalKey, "promptTokens", pTokens),
            this.client.hincrby!(globalKey, "completionTokens", cTokens),
            this.client.hincrby!(globalKey, "totalTokens", tTokens),
            this.client.hincrby!(globalKey, "costUsdMicros", micros),
          ]);

        await Promise.all([
          this.client.hincrby!(routeBudgetKey, "totalTokens", tTokens),
          this.client.hincrby!(routeBudgetKey, "costUsdMicros", micros),
        ]);

        if (typeof this.client.expire === "function") {
          await Promise.all([
            this.client.expire(globalKey, BUDGET_KEY_TTL_SECONDS),
            this.client.expire(routeBudgetKey, BUDGET_KEY_TTL_SECONDS),
          ]);
        }

        const synced: DailyBudgetUsage = {
          dateKey: input.dateKey,
          promptTokens,
          completionTokens,
          totalTokens,
          costUsdMicros,
        };
        this.l1Memory.setCachedDailyUsage(synced);
        return synced;
      },
      () => l1Updated,
    );
  }

  async resetDailyUsage(dateKey?: string): Promise<void> {
    await this.l1Memory.resetDailyUsage(dateKey);
    if (!dateKey) return;

    await this.runFailOpen(
      async () => {
        await this.client.del(`${BUDGET_KEY_PREFIX}${dateKey}:global`);
      },
      () => undefined,
    );
  }

  clearAllSync(): void {
    this.l1Memory.clearAllSync();
    this.knownAuditCount = 0;
  }
}

let activeStore: BridgeStateStore | null = null;

export function createDefaultBridgeStateStore(): BridgeStateStore {
  const driverPreference = (
    process.env.AI_BRIDGE_STATE_DRIVER ?? "auto"
  ).toLowerCase();
  const redisUrl = process.env.REDIS_URL?.trim() ?? "";

  if (driverPreference === "memory" || !redisUrl) {
    return new MemoryBridgeStateStore();
  }

  const client = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 500,
    enableOfflineQueue: false,
  });

  return new RedisBridgeStateStore(client as unknown as RedisClientLike);
}

export function getBridgeStateStore(): BridgeStateStore {
  if (!activeStore) {
    activeStore = createDefaultBridgeStateStore();
  }
  return activeStore;
}

export function setBridgeStateStore(store: BridgeStateStore | null): void {
  activeStore = store;
}
