import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AiExecutionMode,
  AiRuntimeSource,
  BridgeCircuitState,
} from "@/app/lib/ai/bridgeRuntime";
import {
  generateMermaidStateDiagram,
  generatePlaywrightMbtSpec,
} from "../engine/codegenEngine";
import {
  applyWebhookCostOptimization,
  calculateComplexityMetrics,
  parseCompoundNaturalLanguageIntent,
  validateAndParseAstJson,
} from "../engine/complexityEngine";
import type {
  GraphSnapshot,
  McpToolName,
  OptimizationResult,
  RolePerspective,
  SimulationMode,
  StateEdge,
  StateNode,
  WorkflowPresetId,
} from "../engine/types";
import { WORKFLOW_PRESETS } from "./presets";

export interface CustomStatePayload {
  name: string;
  fromId: string;
  toId: string;
  hasLoop: boolean;
}

interface StateFlowState {
  presetId: WorkflowPresetId;
  activeRole: RolePerspective;
  selectedNodeId: string;
  activeAddons: string[];
  baseNodes: StateNode[];
  baseEdges: StateEdge[];
  customNodes: StateNode[];
  customEdges: StateEdge[];
  isCustomAstOverride: boolean;
  undoSnapshot: GraphSnapshot | null;

  // Simulation & UI state
  simMode: SimulationMode;
  simStepIndex: number;
  highlightedNodeId: string | null;
  highlightedEdgeIds: string[];
  aiIntentStatus: string | null;
  aiMode: AiExecutionMode;
  aiSourceBadge: AiRuntimeSource;
  aiCircuitState: BridgeCircuitState;
  aiLatencyMs: number | null;
  isAiExecuting: boolean;
  mcpLog: string;

  // Actions
  setPreset: (presetId: WorkflowPresetId) => void;
  setRole: (role: RolePerspective) => void;
  setAiMode: (mode: AiExecutionMode) => void;
  selectNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  toggleAddon: (addonId: string) => void;
  addCustomState: (payload: CustomStatePayload) => void;
  executeAiIntention: (promptText: string) => { ok: boolean; summary: string };
  executeAiIntentionBridge: (promptText: string) => Promise<{
    ok: boolean;
    source: AiRuntimeSource;
    summary: string;
  }>;
  applyJsonAst: (rawJson: string) => { valid: boolean; error?: string };
  optimizeGraphCost: () => OptimizationResult;
  undoLastGraphChange: () => boolean;
  startSimulation: (mode: Exclude<SimulationMode, null>) => void;
  stepSimulation: () => void;
  stopSimulation: () => void;
  runMcpToolWithParams: (
    toolName: McpToolName,
    rawArgsJson?: string,
  ) => { ok: boolean; log: string; generatedCode?: string };
  triggerMcpTool: (toolName: McpToolName) => void;
  resetWorkflow: () => void;
}

export function composeGraph(state: {
  presetId: WorkflowPresetId;
  activeAddons: string[];
  baseNodes: StateNode[];
  baseEdges: StateEdge[];
  customNodes: StateNode[];
  customEdges: StateEdge[];
}): { nodes: StateNode[]; edges: StateEdge[] } {
  const preset = WORKFLOW_PRESETS[state.presetId];
  const nodes: StateNode[] = state.baseNodes.map((n) => ({ ...n }));
  const edges: StateEdge[] = state.baseEdges.map((e) => ({ ...e }));

  const existingNodeIds = new Set(nodes.map((n) => n.id));
  const existingEdgeIds = new Set(edges.map((e) => e.id));

  for (const addonId of state.activeAddons) {
    const addon = preset.addons.find((a) => a.id === addonId);
    if (!addon) continue;

    for (const node of addon.nodesToAdd) {
      if (!existingNodeIds.has(node.id)) {
        nodes.push({ ...node });
        existingNodeIds.add(node.id);
      }
    }
    for (const edge of addon.edgesToAdd) {
      if (!existingEdgeIds.has(edge.id)) {
        edges.push({ ...edge });
        existingEdgeIds.add(edge.id);
      }
    }
  }

  for (const cn of state.customNodes) {
    if (!existingNodeIds.has(cn.id)) {
      nodes.push({ ...cn });
      existingNodeIds.add(cn.id);
    }
  }
  for (const ce of state.customEdges) {
    if (!existingEdgeIds.has(ce.id)) {
      edges.push({ ...ce });
      existingEdgeIds.add(ce.id);
    }
  }

  return { nodes, edges };
}

function captureSnapshot(state: StateFlowState): GraphSnapshot {
  return {
    baseNodes: state.baseNodes.map((n) => ({ ...n })),
    baseEdges: state.baseEdges.map((e) => ({ ...e })),
    activeAddons: [...state.activeAddons],
    customNodes: state.customNodes.map((n) => ({ ...n })),
    customEdges: state.customEdges.map((e) => ({ ...e })),
    selectedNodeId: state.selectedNodeId,
  };
}

function getInitialSlice(presetId: WorkflowPresetId) {
  const preset = WORKFLOW_PRESETS[presetId];
  return {
    presetId,
    selectedNodeId: preset.baseNodes[1]?.id || preset.baseNodes[0].id,
    activeAddons: [] as string[],
    baseNodes: preset.baseNodes.map((n) => ({ ...n })),
    baseEdges: preset.baseEdges.map((e) => ({ ...e })),
    customNodes: [] as StateNode[],
    customEdges: [] as StateEdge[],
    isCustomAstOverride: false,
    undoSnapshot: null as GraphSnapshot | null,
    simMode: null as SimulationMode,
    simStepIndex: 0,
    highlightedNodeId: null as string | null,
    highlightedEdgeIds: [] as string[],
    aiIntentStatus: null as string | null,
    aiSourceBadge: "IDLE" as AiRuntimeSource,
    aiCircuitState: "CLOSED" as BridgeCircuitState,
    aiLatencyMs: null as number | null,
    isAiExecuting: false,
  };
}

export const useStateFlowStore = create<StateFlowState>()(
  persist(
    (set, get) => ({
      ...getInitialSlice("ecommerce"),
      activeRole: "client",
      aiMode: "AUTO",
      mcpLog: "// รอรับคำสั่งจาก AI Agent ผ่าน MCP Protocol...",

      setPreset: (presetId) => {
        set({
          ...getInitialSlice(presetId),
          mcpLog: "// สลับ Preset เรียบร้อย: รอรับคำสั่งจาก AI Agent...",
        });
      },

      setRole: (activeRole) => set({ activeRole }),

      setAiMode: (aiMode) =>
        set({
          aiMode,
          aiSourceBadge: aiMode === "LOCAL_ONLY" ? "LOCAL_ONLY" : "IDLE",
        }),

      selectNode: (selectedNodeId) => set({ selectedNodeId }),

      moveNode: (nodeId, rawX, rawY) => {
        const x = Math.max(80, Math.min(920, Math.round(rawX)));
        const y = Math.max(50, Math.min(560, Math.round(rawY)));

        set((state) => ({
          baseNodes: state.baseNodes.map((n) =>
            n.id === nodeId ? { ...n, x, y } : n,
          ),
          customNodes: state.customNodes.map((n) =>
            n.id === nodeId ? { ...n, x, y } : n,
          ),
        }));
      },

      toggleAddon: (addonId) => {
        set((state) => {
          const exists = state.activeAddons.includes(addonId);
          const nextAddons = exists
            ? state.activeAddons.filter((id) => id !== addonId)
            : [...state.activeAddons, addonId];

          return {
            activeAddons: nextAddons,
            simMode: null,
            simStepIndex: 0,
            highlightedNodeId: null,
            highlightedEdgeIds: [],
          };
        });
      },

      addCustomState: ({ name, fromId, toId, hasLoop }) => {
        const state = get();
        const cleanName = name.trim() || "Custom_State";
        const newId = `custom_${state.customNodes.length + 1}_${Date.now().toString().slice(-4)}`;
        const ts = Date.now();
        const anchorStart = state.baseNodes[0]?.id || fromId;

        const newNode: StateNode = {
          id: newId,
          label: cleanName,
          sub: "Custom Add-on",
          x: 460 + ((state.customNodes.length * 55) % 240),
          y: 120 + ((state.customNodes.length * 45) % 180),
          traffic: "11%",
          isAddon: true,
        };

        const newEdges: StateEdge[] = [
          {
            id: `ce_${ts}_1`,
            from: fromId,
            to: newId,
            label: "เข้าเงื่อนไขพิเศษ",
            type: "forward",
            prob: "11%",
          },
          {
            id: `ce_${ts}_2`,
            from: newId,
            to: toId,
            label: "อนุมัติผ่าน",
            type: "forward",
            prob: "80%",
          },
        ];

        if (hasLoop) {
          newEdges.push(
            {
              id: `ce_${ts}_3`,
              from: newId,
              to: newId,
              label: "รอตรวจสอบซ้ำ",
              type: "loop",
              prob: "15%",
            },
            {
              id: `ce_${ts}_4`,
              from: newId,
              to: anchorStart,
              label: "ไม่อนุมัติ (รีเซ็ต)",
              type: "fallback",
              prob: "5%",
            },
          );
        }

        set({
          undoSnapshot: captureSnapshot(state),
          customNodes: [...state.customNodes, newNode],
          customEdges: [...state.customEdges, ...newEdges],
          selectedNodeId: newId,
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        });
      },

      executeAiIntention: (promptText) => {
        const state = get();
        const { nodes } = composeGraph(state);
        const text =
          promptText.trim() ||
          WORKFLOW_PRESETS[state.presetId].samplePrompts[0]?.prompt ||
          "แทรกขั้นตอนตรวจสอบเพิ่มเติม";

        const parsed = parseCompoundNaturalLanguageIntent(
          text,
          nodes,
          state.customNodes.length,
        );

        set({
          undoSnapshot: captureSnapshot(state),
          customNodes: [...state.customNodes, ...parsed.nodes],
          customEdges: [...state.customEdges, ...parsed.edges],
          selectedNodeId:
            parsed.nodes[parsed.nodes.length - 1]?.id || state.selectedNodeId,
          aiIntentStatus: parsed.summary,
          aiSourceBadge:
            state.aiMode === "LOCAL_ONLY" ? "LOCAL_ONLY" : "LOCAL_FALLBACK",
          aiLatencyMs: 0,
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        });

        return { ok: true, summary: parsed.summary };
      },

      executeAiIntentionBridge: async (promptText) => {
        const state = get();
        const text =
          promptText.trim() ||
          WORKFLOW_PRESETS[state.presetId].samplePrompts[0]?.prompt ||
          "แทรกขั้นตอนตรวจสอบเพิ่มเติม";

        if (state.aiMode === "LOCAL_ONLY") {
          const localRes = get().executeAiIntention(text);
          set({
            aiSourceBadge: "LOCAL_ONLY",
            aiLatencyMs: 0,
            isAiExecuting: false,
          });
          return {
            ok: localRes.ok,
            source: "LOCAL_ONLY",
            summary: localRes.summary,
          };
        }

        const { nodes, edges } = composeGraph(state);
        set({ isAiExecuting: true });

        const controller = new AbortController();
        const clientTimer = setTimeout(() => controller.abort(), 8_000);

        try {
          const res = await fetch("/api/stateflow/intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              prompt: text,
              presetId: state.presetId,
              nodes: nodes.map((n) => ({
                id: n.id,
                label: n.label,
                sub: n.sub,
                x: n.x,
                y: n.y,
              })),
              edges: edges.map((e) => ({
                id: e.id,
                from: e.from,
                to: e.to,
                label: e.label,
                type: e.type,
              })),
            }),
          });

          const data = (await res.json()) as {
            ok?: boolean;
            source?: string;
            reason?: string;
            circuitState?: BridgeCircuitState;
            latencyMs?: number;
            patch?: {
              addNodes: Array<{
                id: string;
                label: string;
                sub: string;
                x: number;
                y: number;
                traffic: string;
              }>;
              addEdges: Array<{
                id: string;
                from: string;
                to: string;
                label: string;
                type: StateEdge["type"];
                prob: string;
              }>;
              explanation: string;
            };
          };

          if (
            res.ok &&
            data.ok &&
            data.patch &&
            data.patch.addNodes.length > 0
          ) {
            const stamp = Date.now().toString().slice(-4);
            const existingIds = new Set(nodes.map((n) => n.id));
            const idRemap = new Map<string, string>();

            const newNodes: StateNode[] = data.patch.addNodes.map((n, idx) => {
              const safeId = existingIds.has(n.id)
                ? `${n.id}_${stamp}_${idx}`
                : n.id;
              idRemap.set(n.id, safeId);
              existingIds.add(safeId);
              return {
                id: safeId,
                label: n.label,
                sub: n.sub,
                x: Math.max(80, Math.min(920, Math.round(n.x))),
                y: Math.max(50, Math.min(560, Math.round(n.y))),
                traffic: n.traffic,
                isAddon: true,
              };
            });

            const fallbackAnchor = nodes[0]?.id || newNodes[0].id;
            const newEdges: StateEdge[] = data.patch.addEdges.map((e, idx) => {
              const resolvedFrom = idRemap.get(e.from) ?? e.from;
              const resolvedTo = idRemap.get(e.to) ?? e.to;
              return {
                id: `gem_edge_${stamp}_${idx}_${e.id}`,
                from: existingIds.has(resolvedFrom)
                  ? resolvedFrom
                  : fallbackAnchor,
                to: existingIds.has(resolvedTo) ? resolvedTo : newNodes[0].id,
                label: e.label,
                type: e.type,
                prob: e.prob,
              };
            });

            const current = get();
            set({
              undoSnapshot: captureSnapshot(current),
              customNodes: [...current.customNodes, ...newNodes],
              customEdges: [...current.customEdges, ...newEdges],
              selectedNodeId:
                newNodes[newNodes.length - 1]?.id || current.selectedNodeId,
              aiIntentStatus: `${data.patch.explanation} [Live Gemini]`,
              aiSourceBadge: "LIVE_GEMINI",
              aiCircuitState: "CLOSED",
              aiLatencyMs: data.latencyMs ?? null,
              isAiExecuting: false,
              simMode: null,
              highlightedNodeId: null,
              highlightedEdgeIds: [],
            });

            return {
              ok: true,
              source: "LIVE_GEMINI",
              summary: data.patch.explanation,
            };
          }

          const localRes = get().executeAiIntention(text);
          set({
            aiSourceBadge: "LOCAL_FALLBACK",
            aiCircuitState: data.circuitState ?? "CLOSED",
            aiLatencyMs: data.latencyMs ?? 0,
            aiIntentStatus: `${localRes.summary} (Fallback: ${data.reason ?? "LOCAL_ENGINE"})`,
            isAiExecuting: false,
          });
          return {
            ok: localRes.ok,
            source: "LOCAL_FALLBACK",
            summary: localRes.summary,
          };
        } catch {
          const localRes = get().executeAiIntention(text);
          set({
            aiSourceBadge: "LOCAL_FALLBACK",
            aiCircuitState: "OPEN",
            aiLatencyMs: 0,
            aiIntentStatus: `${localRes.summary} (Fallback: NETWORK_OFFLINE)`,
            isAiExecuting: false,
          });
          return {
            ok: localRes.ok,
            source: "LOCAL_FALLBACK",
            summary: localRes.summary,
          };
        } finally {
          clearTimeout(clientTimer);
        }
      },

      applyJsonAst: (rawJson) => {
        const state = get();
        const result = validateAndParseAstJson(rawJson);
        if (!result.valid || !result.nodes || !result.edges) {
          return { valid: false, error: result.error || "Invalid JSON AST" };
        }

        set({
          undoSnapshot: captureSnapshot(state),
          baseNodes: result.nodes,
          baseEdges: result.edges,
          activeAddons: [],
          customNodes: [],
          customEdges: [],
          isCustomAstOverride: true,
          selectedNodeId: result.nodes[0]?.id || "",
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        });

        return { valid: true };
      },

      optimizeGraphCost: () => {
        const state = get();
        const preset = WORKFLOW_PRESETS[state.presetId];
        const { nodes, edges } = composeGraph(state);
        const result = applyWebhookCostOptimization(
          nodes,
          edges,
          preset.quotaLimit,
          preset.baseCost,
        );

        if (!result.applied) {
          set({ aiIntentStatus: result.summary });
          return result;
        }

        set({
          undoSnapshot: captureSnapshot(state),
          baseNodes: result.nextNodes,
          baseEdges: result.nextEdges,
          activeAddons: [],
          customNodes: [],
          customEdges: [],
          isCustomAstOverride: true,
          selectedNodeId: result.addedNode?.id || state.selectedNodeId,
          aiIntentStatus: result.summary,
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        });

        return result;
      },

      undoLastGraphChange: () => {
        const state = get();
        if (!state.undoSnapshot) return false;
        const snap = state.undoSnapshot;
        set({
          baseNodes: snap.baseNodes,
          baseEdges: snap.baseEdges,
          activeAddons: snap.activeAddons,
          customNodes: snap.customNodes,
          customEdges: snap.customEdges,
          selectedNodeId: snap.selectedNodeId,
          undoSnapshot: null,
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
          aiIntentStatus: "ย้อนกลับการเปลี่ยนแปลงล่าสุดเรียบร้อยแล้ว (Undo)",
        });
        return true;
      },

      startSimulation: (mode) => {
        const state = get();
        const preset = WORKFLOW_PRESETS[state.presetId];

        if (mode === "mining") {
          set({
            simMode: "mining",
            simStepIndex: 0,
            highlightedNodeId: null,
            highlightedEdgeIds: [],
          });
          return;
        }

        let nextAddons = state.activeAddons;
        if (
          mode === "leapfrog" &&
          preset.addons[0] &&
          !nextAddons.includes(preset.addons[0].id)
        ) {
          nextAddons = [...nextAddons, preset.addons[0].id];
        }

        const seq = preset.simulations[mode];
        const firstStep = seq[0];

        set({
          activeAddons: nextAddons,
          simMode: mode,
          simStepIndex: 1,
          highlightedNodeId: firstStep?.node || null,
          selectedNodeId: firstStep?.node || state.selectedNodeId,
          highlightedEdgeIds: firstStep?.edge ? [firstStep.edge] : [],
        });
      },

      stepSimulation: () => {
        const state = get();
        if (!state.simMode || state.simMode === "mining") return;

        const preset = WORKFLOW_PRESETS[state.presetId];
        const seq = preset.simulations[state.simMode];
        if (!seq || seq.length === 0) return;

        const resetCycle = state.simStepIndex >= seq.length;
        const idx = resetCycle ? 0 : state.simStepIndex;
        const item = seq[idx];

        const nextHighlightedEdges = resetCycle
          ? item.edge
            ? [item.edge]
            : []
          : item.edge && !state.highlightedEdgeIds.includes(item.edge)
            ? [...state.highlightedEdgeIds, item.edge]
            : state.highlightedEdgeIds;

        set({
          simStepIndex: idx + 1,
          highlightedNodeId: item.node,
          selectedNodeId: item.node,
          highlightedEdgeIds: nextHighlightedEdges,
        });
      },

      stopSimulation: () =>
        set({
          simMode: null,
          simStepIndex: 0,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        }),

      runMcpToolWithParams: (toolName, rawArgsJson) => {
        const state = get();
        const preset = WORKFLOW_PRESETS[state.presetId];

        let parsedArgs: Record<string, unknown> = {};
        if (rawArgsJson && rawArgsJson.trim()) {
          try {
            const candidate = JSON.parse(rawArgsJson);
            if (
              !candidate ||
              typeof candidate !== "object" ||
              Array.isArray(candidate)
            ) {
              const errLog = JSON.stringify(
                {
                  jsonrpc: "2.0",
                  error: {
                    code: -32602,
                    message:
                      "Invalid params: MCP tool arguments must be a JSON object",
                  },
                },
                null,
                2,
              );
              set({ mcpLog: errLog });
              return { ok: false, log: errLog };
            }
            parsedArgs = candidate as Record<string, unknown>;
          } catch (err) {
            const errLog = JSON.stringify(
              {
                jsonrpc: "2.0",
                error: {
                  code: -32700,
                  message:
                    err instanceof Error
                      ? err.message
                      : "Malformed JSON arguments",
                },
              },
              null,
              2,
            );
            set({ mcpLog: errLog });
            return { ok: false, log: errLog };
          }
        }

        const { nodes, edges } = composeGraph(state);
        const metrics = calculateComplexityMetrics(
          nodes,
          edges,
          preset.quotaLimit,
          preset.baseCost,
        );

        let log = "";
        let generatedCode: string | undefined;

        if (toolName === "read_ssot_graph") {
          const includeMetrics = parsedArgs.includeMetrics !== false;
          log = JSON.stringify(
            {
              jsonrpc: "2.0",
              method: "tools/call",
              params: {
                name: "read_ssot_graph",
                arguments: { includeMetrics },
              },
              result: {
                workflowSlug: preset.workflowSlug,
                nodeCount: nodes.length,
                edgeCount: edges.length,
                ...(includeMetrics ? { metrics } : {}),
                nodes: nodes.map((n) => ({ id: n.id, label: n.label })),
              },
            },
            null,
            2,
          );
        } else if (toolName === "mutate_state_graph") {
          const intentArg =
            typeof parsedArgs.intent === "string" && parsedArgs.intent.trim()
              ? parsedArgs.intent
              : preset.samplePrompts[preset.samplePrompts.length - 1]?.prompt ||
                "แทรกขั้นตอนตรวจสอบสต็อกคลังสินค้า";
          const res = get().executeAiIntention(intentArg);
          const nextGraph = composeGraph(get());
          const nextMetrics = calculateComplexityMetrics(
            nextGraph.nodes,
            nextGraph.edges,
            preset.quotaLimit,
            preset.baseCost,
          );
          log = JSON.stringify(
            {
              jsonrpc: "2.0",
              method: "tools/call",
              params: {
                name: "mutate_state_graph",
                arguments: { intent: intentArg, autoCalculateCost: true },
              },
              result: {
                status: "AST_UPDATED",
                summary: res.summary,
                newQuotaPoints: nextMetrics.points,
                estimatedCostTHB: nextMetrics.cost,
              },
            },
            null,
            2,
          );
        } else if (toolName === "evaluate_nxn_matrix") {
          const includePaths = parsedArgs.includePaths !== false;
          log = JSON.stringify(
            {
              jsonrpc: "2.0",
              method: "tools/call",
              params: {
                name: "evaluate_nxn_matrix",
                arguments: { includePaths },
              },
              result: {
                matrixSize: `${metrics.nodeCount}x${metrics.nodeCount}`,
                cyclomaticComplexity: metrics.cyclomatic,
                combinatorialTestPaths: metrics.possiblePaths,
                quotaPoints: metrics.points,
                estimatedCostTHB: metrics.cost,
                ...(includePaths
                  ? {
                      breakdown: {
                        forward: metrics.forwardCount,
                        loop: metrics.loopCount,
                        fallback: metrics.fallbackCount,
                        leapfrog: metrics.leapfrogCount,
                      },
                    }
                  : {}),
              },
            },
            null,
            2,
          );
        } else if (toolName === "generate_qa_playwright") {
          const format =
            parsedArgs.format === "mermaid" ? "mermaid" : "playwright";
          generatedCode =
            format === "mermaid"
              ? generateMermaidStateDiagram(preset.workflowSlug, nodes, edges)
              : generatePlaywrightMbtSpec(preset, nodes, edges, metrics);
          log = generatedCode;
        } else if (toolName === "optimize_topology") {
          const opt = get().optimizeGraphCost();
          log = JSON.stringify(
            {
              jsonrpc: "2.0",
              method: "tools/call",
              params: {
                name: "optimize_topology",
                arguments: { mode: "webhook_queue" },
              },
              result: {
                applied: opt.applied,
                beforePoints: opt.beforePoints,
                afterPoints: opt.afterPoints,
                savingsThb: opt.savingsThb,
                removedFallbackCount: opt.removedFallbackIds.length,
                summary: opt.summary,
              },
            },
            null,
            2,
          );
        }

        set({ mcpLog: log });
        return { ok: true, log, generatedCode };
      },

      triggerMcpTool: (toolName) => {
        get().runMcpToolWithParams(toolName);
      },

      resetWorkflow: () => {
        const currentPreset = get().presetId;
        set({
          ...getInitialSlice(currentPreset),
          mcpLog: "// รีเซ็ต Workflow กลับสู่ค่าเริ่มต้นแล้ว",
        });
      },
    }),
    {
      name: "stateflow-ai-ssot-store-v1",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    },
  ),
);
