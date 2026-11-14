import {
  type AiBridgeArchiveDriver,
  type AiBridgeArchiveStatus,
  type AiBridgeAuditEvent,
  AiBridgeAuditEventSchema,
} from "@/app/lib/ai/healthContract";
import { sanitizeAuditDetail } from "@/app/lib/ai/stateStore";
import { prisma as defaultPrisma } from "@/app/lib/prisma";

export interface DailyUsageRollupInput {
  dateKey: string;
  routeKey: string;
  requestCount: number;
  liveSuccessCount: number;
  fallbackCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsdMicros: number;
}

export interface ArchiveListOptions {
  limit?: number;
  routeKey?: string;
  days?: number;
}

export interface AiBridgeArchiveRepository {
  getCachedArchiveStatus(): AiBridgeArchiveStatus;
  getArchiveStatus(): Promise<AiBridgeArchiveStatus>;
  archiveEvents(events: AiBridgeAuditEvent[]): Promise<number>;
  upsertDailyUsage(input: DailyUsageRollupInput): Promise<void>;
  listArchivedEvents(
    options?: ArchiveListOptions,
  ): Promise<AiBridgeAuditEvent[]>;
  pruneOlderThan(days: number): Promise<number>;
  clearSync?(): void;
}

export interface PrismaArchiveRow {
  id: string;
  eventTimestamp: Date;
  routeKey: string;
  eventType: string;
  outcome: string | null;
  fallbackReason: string | null;
  latencyMs: number | null;
  piiRedactedCount: number | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsdMicros: number;
  actor: string | null;
  detail: string | null;
}

export interface PrismaArchiveClientLike {
  aiBridgeAuditLog: {
    createMany(args: {
      data: Array<{
        id: string;
        eventTimestamp: Date;
        routeKey: string;
        eventType: string;
        outcome: string | null;
        fallbackReason: string | null;
        latencyMs: number | null;
        piiRedactedCount: number | null;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        costUsdMicros: number;
        actor: string | null;
        detail: string | null;
      }>;
      skipDuplicates?: boolean;
    }): Promise<{ count: number }>;
    findMany(args: {
      where?: Record<string, unknown>;
      orderBy?: Record<string, "asc" | "desc">;
      take?: number;
    }): Promise<PrismaArchiveRow[]>;
    count(): Promise<number>;
    deleteMany(args: {
      where: Record<string, unknown>;
    }): Promise<{ count: number }>;
  };
  aiBridgeDailyUsage: {
    upsert(args: {
      where: { dateKey_routeKey: { dateKey: string; routeKey: string } };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }): Promise<unknown>;
  };
}

function scrubEventForArchive(event: AiBridgeAuditEvent): AiBridgeAuditEvent {
  return {
    ...event,
    detail: sanitizeAuditDetail(event.detail),
  };
}

export class DisabledBridgeArchiveRepository
  implements AiBridgeArchiveRepository
{
  getCachedArchiveStatus(): AiBridgeArchiveStatus {
    return {
      driver: "disabled",
      connected: true,
      archivedEventCount: 0,
      lastArchivedAt: null,
    };
  }

  async getArchiveStatus(): Promise<AiBridgeArchiveStatus> {
    return this.getCachedArchiveStatus();
  }

  async archiveEvents(): Promise<number> {
    return 0;
  }

  async upsertDailyUsage(): Promise<void> {
    return undefined;
  }

  async listArchivedEvents(): Promise<AiBridgeAuditEvent[]> {
    return [];
  }

  async pruneOlderThan(): Promise<number> {
    return 0;
  }
}

export class MemoryBridgeArchiveRepository
  implements AiBridgeArchiveRepository
{
  private events = new Map<string, AiBridgeAuditEvent>();
  private dailyRollups = new Map<string, DailyUsageRollupInput>();
  private lastArchivedAt: string | null = null;

  getCachedArchiveStatus(): AiBridgeArchiveStatus {
    return {
      driver: "memory",
      connected: true,
      archivedEventCount: this.events.size,
      lastArchivedAt: this.lastArchivedAt,
    };
  }

  async getArchiveStatus(): Promise<AiBridgeArchiveStatus> {
    return this.getCachedArchiveStatus();
  }

  async archiveEvents(events: AiBridgeAuditEvent[]): Promise<number> {
    let inserted = 0;
    for (const raw of events) {
      if (this.events.has(raw.id)) continue;
      this.events.set(raw.id, scrubEventForArchive(raw));
      inserted += 1;
    }
    if (inserted > 0) {
      this.lastArchivedAt = new Date().toISOString();
    }
    return inserted;
  }

  async upsertDailyUsage(input: DailyUsageRollupInput): Promise<void> {
    const key = `${input.dateKey}:${input.routeKey}`;
    const prev = this.dailyRollups.get(key);
    if (!prev) {
      this.dailyRollups.set(key, { ...input });
      return;
    }
    this.dailyRollups.set(key, {
      dateKey: input.dateKey,
      routeKey: input.routeKey,
      requestCount: prev.requestCount + input.requestCount,
      liveSuccessCount: prev.liveSuccessCount + input.liveSuccessCount,
      fallbackCount: prev.fallbackCount + input.fallbackCount,
      promptTokens: prev.promptTokens + input.promptTokens,
      completionTokens: prev.completionTokens + input.completionTokens,
      totalTokens: prev.totalTokens + input.totalTokens,
      costUsdMicros: prev.costUsdMicros + input.costUsdMicros,
    });
  }

  getRollups(): DailyUsageRollupInput[] {
    return Array.from(this.dailyRollups.values());
  }

  async listArchivedEvents(
    options?: ArchiveListOptions,
  ): Promise<AiBridgeAuditEvent[]> {
    const limit = Math.max(1, options?.limit ?? 50);
    const cutoffMs =
      typeof options?.days === "number"
        ? Date.now() - options.days * 86_400_000
        : null;

    const all = Array.from(this.events.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
    );

    const filtered = all.filter((ev) => {
      if (options?.routeKey && ev.routeKey !== options.routeKey) return false;
      if (cutoffMs !== null && Date.parse(ev.timestamp) < cutoffMs) {
        return false;
      }
      return true;
    });

    return filtered.slice(0, limit);
  }

  async pruneOlderThan(days: number): Promise<number> {
    const cutoffMs = Date.now() - Math.max(0, days) * 86_400_000;
    let deleted = 0;
    for (const [id, ev] of this.events.entries()) {
      if (Date.parse(ev.timestamp) < cutoffMs) {
        this.events.delete(id);
        deleted += 1;
      }
    }
    return deleted;
  }

  clearSync(): void {
    this.events.clear();
    this.dailyRollups.clear();
    this.lastArchivedAt = null;
  }
}

export class PrismaBridgeArchiveRepository
  implements AiBridgeArchiveRepository
{
  private readonly prismaClient: PrismaArchiveClientLike;
  private lastConnected = true;
  private knownArchivedCount = 0;
  private lastArchivedAt: string | null = null;

  constructor(prismaClient?: PrismaArchiveClientLike) {
    this.prismaClient =
      prismaClient ?? (defaultPrisma as unknown as PrismaArchiveClientLike);
  }

  getCachedArchiveStatus(): AiBridgeArchiveStatus {
    return {
      driver: "prisma",
      connected: this.lastConnected,
      archivedEventCount: this.knownArchivedCount,
      lastArchivedAt: this.lastArchivedAt,
    };
  }

  private async runFailOpen<T>(
    operation: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    try {
      const value = await operation();
      this.lastConnected = true;
      return value;
    } catch {
      this.lastConnected = false;
      return fallback;
    }
  }

  async getArchiveStatus(): Promise<AiBridgeArchiveStatus> {
    const count = await this.runFailOpen(async () => {
      return this.prismaClient.aiBridgeAuditLog.count();
    }, this.knownArchivedCount);
    this.knownArchivedCount = count;
    return this.getCachedArchiveStatus();
  }

  async archiveEvents(events: AiBridgeAuditEvent[]): Promise<number> {
    if (events.length === 0) return 0;

    return this.runFailOpen(async () => {
      const rows = events.map((ev) => {
        const safe = scrubEventForArchive(ev);
        return {
          id: safe.id,
          eventTimestamp: new Date(safe.timestamp),
          routeKey: safe.routeKey,
          eventType: safe.eventType,
          outcome: safe.outcome ?? null,
          fallbackReason: safe.fallbackReason ?? null,
          latencyMs:
            typeof safe.latencyMs === "number"
              ? Math.round(safe.latencyMs)
              : null,
          piiRedactedCount: safe.piiRedactedCount ?? null,
          promptTokens: safe.promptTokens ?? 0,
          completionTokens: safe.completionTokens ?? 0,
          totalTokens: safe.totalTokens ?? 0,
          costUsdMicros: safe.costUsdMicros ?? 0,
          actor: safe.actor ?? null,
          detail: safe.detail ?? null,
        };
      });

      const res = await this.prismaClient.aiBridgeAuditLog.createMany({
        data: rows,
        skipDuplicates: true,
      });
      if (res.count > 0) {
        this.knownArchivedCount += res.count;
        this.lastArchivedAt = new Date().toISOString();
      }
      return res.count;
    }, 0);
  }

  async upsertDailyUsage(input: DailyUsageRollupInput): Promise<void> {
    await this.runFailOpen(async () => {
      await this.prismaClient.aiBridgeDailyUsage.upsert({
        where: {
          dateKey_routeKey: {
            dateKey: input.dateKey,
            routeKey: input.routeKey,
          },
        },
        create: {
          dateKey: input.dateKey,
          routeKey: input.routeKey,
          requestCount: input.requestCount,
          liveSuccessCount: input.liveSuccessCount,
          fallbackCount: input.fallbackCount,
          promptTokens: input.promptTokens,
          completionTokens: input.completionTokens,
          totalTokens: input.totalTokens,
          costUsdMicros: input.costUsdMicros,
        },
        update: {
          requestCount: { increment: input.requestCount },
          liveSuccessCount: { increment: input.liveSuccessCount },
          fallbackCount: { increment: input.fallbackCount },
          promptTokens: { increment: input.promptTokens },
          completionTokens: { increment: input.completionTokens },
          totalTokens: { increment: input.totalTokens },
          costUsdMicros: { increment: input.costUsdMicros },
        },
      });
    }, undefined);
  }

  async listArchivedEvents(
    options?: ArchiveListOptions,
  ): Promise<AiBridgeAuditEvent[]> {
    const limit = Math.max(1, options?.limit ?? 50);
    return this.runFailOpen(async () => {
      const where: Record<string, unknown> = {};
      if (options?.routeKey) {
        where.routeKey = options.routeKey;
      }
      if (typeof options?.days === "number" && options.days > 0) {
        where.eventTimestamp = {
          gte: new Date(Date.now() - options.days * 86_400_000),
        };
      }

      const rows = await this.prismaClient.aiBridgeAuditLog.findMany({
        where,
        orderBy: { eventTimestamp: "desc" },
        take: limit,
      });

      const events: AiBridgeAuditEvent[] = [];
      for (const row of rows) {
        const candidate = AiBridgeAuditEventSchema.safeParse({
          id: row.id,
          timestamp: row.eventTimestamp.toISOString(),
          routeKey: row.routeKey,
          eventType: row.eventType,
          outcome: row.outcome ?? undefined,
          fallbackReason: row.fallbackReason ?? undefined,
          latencyMs: row.latencyMs ?? undefined,
          piiRedactedCount: row.piiRedactedCount ?? undefined,
          promptTokens: row.promptTokens || undefined,
          completionTokens: row.completionTokens || undefined,
          totalTokens: row.totalTokens || undefined,
          costUsdMicros: row.costUsdMicros || undefined,
          actor: row.actor ?? undefined,
          detail: row.detail ?? undefined,
        });
        if (candidate.success) {
          events.push(candidate.data);
        }
      }
      return events;
    }, []);
  }

  async pruneOlderThan(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - Math.max(0, days) * 86_400_000);
    return this.runFailOpen(async () => {
      const res = await this.prismaClient.aiBridgeAuditLog.deleteMany({
        where: { eventTimestamp: { lt: cutoff } },
      });
      return res.count;
    }, 0);
  }
}

let activeArchiveRepository: AiBridgeArchiveRepository | null = null;

export function createDefaultBridgeArchiveRepository(): AiBridgeArchiveRepository {
  const configured = (
    process.env.AI_BRIDGE_ARCHIVE_DRIVER ?? "auto"
  ).toLowerCase() as AiBridgeArchiveDriver | "auto";

  if (configured === "disabled") {
    return new DisabledBridgeArchiveRepository();
  }
  if (configured === "memory") {
    return new MemoryBridgeArchiveRepository();
  }
  if (configured === "prisma") {
    return new PrismaBridgeArchiveRepository();
  }

  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (process.env.NODE_ENV === "test" || !dbUrl || dbUrl.includes("dummy")) {
    return new DisabledBridgeArchiveRepository();
  }

  return new PrismaBridgeArchiveRepository();
}

export function getBridgeArchiveRepository(): AiBridgeArchiveRepository {
  if (!activeArchiveRepository) {
    activeArchiveRepository = createDefaultBridgeArchiveRepository();
  }
  return activeArchiveRepository;
}

export function setBridgeArchiveRepository(
  repository: AiBridgeArchiveRepository | null,
): void {
  activeArchiveRepository = repository;
}
