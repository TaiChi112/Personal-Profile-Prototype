import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  calculateComplexityMetrics,
  parseNaturalLanguageIntent,
  validateAndParseAstJson,
} from "../engine/complexityEngine";
import type {
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

  // Simulation & UI state
  simMode: SimulationMode;
  simStepIndex: number;
  highlightedNodeId: string | null;
  highlightedEdgeIds: string[];
  aiIntentStatus: string | null;
  mcpLog: string;

  // Actions
  setPreset: (presetId: WorkflowPresetId) => void;
  setRole: (role: RolePerspective) => void;
  selectNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  toggleAddon: (addonId: string) => void;
  addCustomState: (payload: CustomStatePayload) => void;
  executeAiIntention: (promptText: string) => { ok: boolean; summary: string };
  applyJsonAst: (rawJson: string) => { valid: boolean; error?: string };
  startSimulation: (mode: Exclude<SimulationMode, null>) => void;
  stepSimulation: () => void;
  stopSimulation: () => void;
  triggerMcpTool: (
    toolName:
      | "mutate_state_graph"
      | "evaluate_nxn_matrix"
      | "generate_qa_playwright",
  ) => void;
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
    simMode: null as SimulationMode,
    simStepIndex: 0,
    highlightedNodeId: null as string | null,
    highlightedEdgeIds: [] as string[],
    aiIntentStatus: null as string | null,
  };
}

export const useStateFlowStore = create<StateFlowState>()(
  persist(
    (set, get) => ({
      ...getInitialSlice("ecommerce"),
      activeRole: "client",
      mcpLog: "// รอรับคำสั่งจาก AI Agent ผ่าน MCP Protocol...",

      setPreset: (presetId) => {
        set({
          ...getInitialSlice(presetId),
          mcpLog: "// สลับ Preset เรียบร้อย: รอรับคำสั่งจาก AI Agent...",
        });
      },

      setRole: (activeRole) => set({ activeRole }),

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

        const parsed = parseNaturalLanguageIntent(
          text,
          nodes,
          state.customNodes.length,
        );

        set({
          customNodes: [...state.customNodes, parsed.node],
          customEdges: [...state.customEdges, ...parsed.edges],
          selectedNodeId: parsed.node.id,
          aiIntentStatus: parsed.summary,
          simMode: null,
          highlightedNodeId: null,
          highlightedEdgeIds: [],
        });

        return { ok: true, summary: parsed.summary };
      },

      applyJsonAst: (rawJson) => {
        const result = validateAndParseAstJson(rawJson);
        if (!result.valid || !result.nodes || !result.edges) {
          return { valid: false, error: result.error || "Invalid JSON AST" };
        }

        set({
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

      triggerMcpTool: (toolName) => {
        const state = get();
        const preset = WORKFLOW_PRESETS[state.presetId];
        const { nodes, edges } = composeGraph(state);
        const metrics = calculateComplexityMetrics(
          nodes,
          edges,
          preset.quotaLimit,
          preset.baseCost,
        );

        if (toolName === "mutate_state_graph") {
          const samplePrompt =
            preset.samplePrompts[preset.samplePrompts.length - 1]?.prompt ||
            "แทรกขั้นตอนตรวจสอบสต็อกคลังสินค้า";
          const res = get().executeAiIntention(samplePrompt);
          const nextGraph = composeGraph(get());
          const nextMetrics = calculateComplexityMetrics(
            nextGraph.nodes,
            nextGraph.edges,
            preset.quotaLimit,
            preset.baseCost,
          );

          set({
            mcpLog: JSON.stringify(
              {
                jsonrpc: "2.0",
                method: "tools/call",
                params: {
                  name: "mutate_state_graph",
                  arguments: {
                    intent: samplePrompt,
                    autoCalculateCost: true,
                  },
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
            ),
          });
        } else if (toolName === "evaluate_nxn_matrix") {
          set({
            mcpLog: JSON.stringify(
              {
                jsonrpc: "2.0",
                method: "tools/call",
                params: { name: "evaluate_nxn_matrix" },
                result: {
                  matrixSize: `${metrics.nodeCount}x${metrics.nodeCount}`,
                  cyclomaticComplexity: metrics.cyclomatic,
                  combinatorialTestPaths: metrics.possiblePaths,
                  quotaPoints: metrics.points,
                  estimatedCostTHB: metrics.cost,
                },
              },
              null,
              2,
            ),
          });
        } else if (toolName === "generate_qa_playwright") {
          const first = nodes[0]?.id || "start";
          const second = nodes[1]?.id || first;
          set({
            mcpLog: `// Generated by MCP Tool: generate_qa_playwright()\ntest('Worst Case Loop & Fallback Path (${preset.workflowSlug})', async ({ page }) => {\n  await page.goto('/${preset.id}');\n  await triggerTransition('${first}', '${second}');\n  await simulateLoopCondition('${second}', 2);\n  await expectStateToFallback('${first}');\n});`,
          });
        }
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
