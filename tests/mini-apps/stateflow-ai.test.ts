import { beforeEach, describe, expect, it } from "bun:test";
import {
  generateMermaidStateDiagram,
  generatePlaywrightMbtSpec,
  generateQuotationReportMarkdown,
} from "../../app/projects/(micro-apps)/stateflow-ai/engine/codegenEngine";
import {
  ARCHITECTURAL_BASE_FEE_THB,
  COMPLEXITY_WEIGHTS,
  COST_PER_POINT_THB,
  applyWebhookCostOptimization,
  calculateComplexityMetrics,
  localDeterministicIntentAdapter,
  parseCompoundNaturalLanguageIntent,
  parseNaturalLanguageIntent,
  validateAndParseAstJson,
} from "../../app/projects/(micro-apps)/stateflow-ai/engine/complexityEngine";
import { WORKFLOW_PRESETS } from "../../app/projects/(micro-apps)/stateflow-ai/store/presets";
import {
  composeGraph,
  useStateFlowStore,
} from "../../app/projects/(micro-apps)/stateflow-ai/store/useStateFlowStore";

describe("StateFlow AI Complexity Engine & Store", () => {
  beforeEach(() => {
    const store = useStateFlowStore.getState();
    store.setPreset("ecommerce");
    store.setRole("client");
  });

  it("calculates calibrated E-Commerce baseline metrics (320 Pts, 125,000 THB, cyclomatic 5)", () => {
    const preset = WORKFLOW_PRESETS.ecommerce;
    const { nodes, edges } = composeGraph(useStateFlowStore.getState());
    const metrics = calculateComplexityMetrics(
      nodes,
      edges,
      preset.quotaLimit,
      preset.baseCost,
    );

    expect(metrics.nodeCount).toBe(5);
    expect(metrics.edgeCount).toBe(8);
    expect(metrics.forwardCount).toBe(4);
    expect(metrics.loopCount).toBe(2);
    expect(metrics.fallbackCount).toBe(2);
    expect(metrics.leapfrogCount).toBe(0);
    expect(metrics.cyclomatic).toBe(5);
    expect(metrics.points).toBe(320);
    expect(metrics.cost).toBe(125000);
    expect(metrics.overQuota).toBe(false);
    expect(metrics.costDeltaFromBase).toBe(0);
  });

  it("recalculates points and cost when toggling VIP Leapfrog add-on (380 Pts, 143,000 THB)", () => {
    const store = useStateFlowStore.getState();
    store.toggleAddon("vip");

    const updated = useStateFlowStore.getState();
    expect(updated.activeAddons).toContain("vip");

    const { nodes, edges } = composeGraph(updated);
    const metrics = calculateComplexityMetrics(
      nodes,
      edges,
      WORKFLOW_PRESETS.ecommerce.quotaLimit,
      WORKFLOW_PRESETS.ecommerce.baseCost,
    );

    // Toggle VIP adds 1 leapfrog edge (+60 Pts, +18,000 THB)
    expect(metrics.leapfrogCount).toBe(1);
    expect(metrics.points).toBe(380);
    expect(metrics.cost).toBe(143000);
    expect(metrics.costDeltaFromBase).toBe(18000);

    // Toggling off restores baseline
    updated.toggleAddon("vip");
    const restored = useStateFlowStore.getState();
    expect(restored.activeAddons).not.toContain("vip");
  });

  it("supports graph-driven recalculation via applyJsonAst and rejects invalid AST JSON", () => {
    const invalidResult = validateAndParseAstJson("{ invalid json");
    expect(invalidResult.valid).toBe(false);

    const store = useStateFlowStore.getState();
    const storeInvalid = store.applyJsonAst(
      JSON.stringify({ nodes: [], edges: "not-an-array" }),
    );
    expect(storeInvalid.valid).toBe(false);

    const customAst = {
      nodes: [
        {
          id: "n1",
          label: "Start",
          sub: "Init",
          x: 120,
          y: 200,
          traffic: "100%",
        },
        {
          id: "n2",
          label: "Gate",
          sub: "Check",
          x: 320,
          y: 200,
          traffic: "80%",
        },
        { id: "n3", label: "End", sub: "Done", x: 520, y: 200, traffic: "60%" },
      ],
      edges: [
        {
          id: "e1",
          from: "n1",
          to: "n2",
          label: "Go",
          type: "forward",
          prob: "80%",
        },
        {
          id: "e2",
          from: "n2",
          to: "n3",
          label: "Finish",
          type: "forward",
          prob: "75%",
        },
        {
          id: "e3",
          from: "n1",
          to: "n3",
          label: "Skip",
          type: "leapfrog",
          prob: "15%",
        },
      ],
    };

    const applied = store.applyJsonAst(JSON.stringify(customAst));
    expect(applied.valid).toBe(true);

    const updated = useStateFlowStore.getState();
    expect(updated.isCustomAstOverride).toBe(true);
    const { nodes, edges } = composeGraph(updated);
    const metrics = calculateComplexityMetrics(
      nodes,
      edges,
      WORKFLOW_PRESETS.ecommerce.quotaLimit,
      WORKFLOW_PRESETS.ecommerce.baseCost,
    );

    const expectedPoints =
      3 * COMPLEXITY_WEIGHTS.node +
      2 * COMPLEXITY_WEIGHTS.forward +
      1 * COMPLEXITY_WEIGHTS.leapfrog;
    expect(metrics.points).toBe(expectedPoints);
    expect(metrics.cost).toBe(
      ARCHITECTURAL_BASE_FEE_THB + expectedPoints * COST_PER_POINT_THB,
    );
  });

  it("parses natural language intents (KYC, Flash Sale, Stock) and mutates store graph", () => {
    const store = useStateFlowStore.getState();
    const initialGraph = composeGraph(store);

    const kycParsed = parseNaturalLanguageIntent(
      "เพิ่มขั้นตอน e-KYC สแกนหน้าก่อนจ่ายเงิน",
      initialGraph.nodes,
      0,
    );
    expect(kycParsed.node.id).toBe("ai_node_1");
    expect(kycParsed.node.label).toContain("e-KYC Verify");
    expect(kycParsed.edges.length).toBe(4);

    const flashParsed = parseNaturalLanguageIntent(
      "สร้างทางด่วน Flash Sale ข้ามขั้นตอนไปแพ็คของ",
      initialGraph.nodes,
      1,
    );
    expect(flashParsed.node.id).toBe("fast_lane_2");
    expect(flashParsed.edges.some((e) => e.type === "leapfrog")).toBe(true);

    const stockParsed = parseNaturalLanguageIntent(
      "เพิ่มระบบเช็คสต็อกคลังสินค้าก่อนชำระเงิน",
      initialGraph.nodes,
      2,
    );
    expect(stockParsed.node.label).toContain("Warehouse Lock");

    const execResult = store.executeAiIntention(
      "เพิ่มขั้นตอน e-KYC สแกนหน้าก่อนชำระเงิน",
    );
    expect(execResult.ok).toBe(true);
    const afterState = useStateFlowStore.getState();
    expect(afterState.customNodes.length).toBe(1);
    expect(afterState.customEdges.length).toBe(4);
    expect(afterState.aiIntentStatus).toBe(execResult.summary);

    // Whitespace falls back cleanly to the preset's primary sample prompt
    const fallbackResult = store.executeAiIntention("   ");
    expect(fallbackResult.ok).toBe(true);
    expect(useStateFlowStore.getState().customNodes.length).toBe(2);
  });

  it("switches multi-workflow presets cleanly (pms and fintech)", () => {
    const store = useStateFlowStore.getState();

    store.setPreset("pms");
    const pmsState = useStateFlowStore.getState();
    expect(pmsState.presetId).toBe("pms");
    expect(pmsState.activeAddons.length).toBe(0);
    const pmsGraph = composeGraph(pmsState);
    expect(pmsGraph.nodes.length).toBe(WORKFLOW_PRESETS.pms.baseNodes.length);

    store.setPreset("fintech");
    const fintechState = useStateFlowStore.getState();
    expect(fintechState.presetId).toBe("fintech");
    const fintechGraph = composeGraph(fintechState);
    expect(fintechGraph.nodes.length).toBe(
      WORKFLOW_PRESETS.fintech.baseNodes.length,
    );
  });

  it("clamps node coordinates within SVG viewport bounds in moveNode", () => {
    const store = useStateFlowStore.getState();
    const targetId = store.baseNodes[0].id;

    store.moveNode(targetId, -100, 1000);
    let moved = useStateFlowStore
      .getState()
      .baseNodes.find((n) => n.id === targetId);
    expect(moved?.x).toBe(80);
    expect(moved?.y).toBe(560);

    store.moveNode(targetId, 1500, -25);
    moved = useStateFlowStore
      .getState()
      .baseNodes.find((n) => n.id === targetId);
    expect(moved?.x).toBe(920);
    expect(moved?.y).toBe(50);
  });

  it("runs and stops workflow path simulations cleanly", () => {
    const store = useStateFlowStore.getState();

    store.startSimulation("best");
    let simState = useStateFlowStore.getState();
    expect(simState.simMode).toBe("best");
    expect(simState.simStepIndex).toBe(1);
    expect(simState.highlightedNodeId).toBe(
      WORKFLOW_PRESETS.ecommerce.simulations.best[0].node,
    );

    simState.stepSimulation();
    simState = useStateFlowStore.getState();
    expect(simState.simStepIndex).toBe(2);
    expect(simState.highlightedNodeId).toBe(
      WORKFLOW_PRESETS.ecommerce.simulations.best[1].node,
    );

    simState.startSimulation("mining");
    simState = useStateFlowStore.getState();
    expect(simState.simMode).toBe("mining");
    expect(simState.highlightedNodeId).toBeNull();

    simState.stopSimulation();
    simState = useStateFlowStore.getState();
    expect(simState.simMode).toBeNull();
    expect(simState.highlightedEdgeIds.length).toBe(0);
  });

  it("handles MCP tool invocations and updates mcpLog", () => {
    const store = useStateFlowStore.getState();

    store.triggerMcpTool("mutate_state_graph");
    let state = useStateFlowStore.getState();
    expect(state.customNodes.length).toBe(1);
    expect(state.mcpLog).toContain("mutate_state_graph");
    expect(state.mcpLog).toContain("AST_UPDATED");

    store.triggerMcpTool("evaluate_nxn_matrix");
    state = useStateFlowStore.getState();
    expect(state.mcpLog).toContain("evaluate_nxn_matrix");

    store.triggerMcpTool("generate_qa_playwright");
    state = useStateFlowStore.getState();
    expect(state.mcpLog).toContain("@playwright/test");
    expect(state.mcpLog).toContain("StateFlow SSOT MBT Suite");
  });

  it("parses compound multi-clause intents cleanly via localDeterministicIntentAdapter", () => {
    const store = useStateFlowStore.getState();
    const initialGraph = composeGraph(store);

    const compound = parseCompoundNaturalLanguageIntent(
      "เพิ่มขั้นตอน e-KYC สแกนหน้า แล้วเพิ่มระบบเช็คสต็อกคลังสินค้า",
      initialGraph.nodes,
      0,
    );
    expect(compound.nodes.length).toBe(2);
    expect(compound.nodes[0].label).toContain("e-KYC Verify");
    expect(compound.nodes[1].label).toContain("Warehouse Lock");
    expect(compound.edges.length).toBe(8);

    const uniqueEdgeIds = new Set(compound.edges.map((e) => e.id));
    expect(uniqueEdgeIds.size).toBe(8);

    const adapterResult = localDeterministicIntentAdapter.parse(
      "เพิ่ม Fast Lane VIP แล้วตรวจสอบเครดิตบูโร",
      initialGraph.nodes,
      2,
    ) as ReturnType<typeof parseCompoundNaturalLanguageIntent>;
    expect(adapterResult.nodes.length).toBe(2);

    const storeExec = store.executeAiIntention(
      "เพิ่มขั้นตอน e-KYC สแกนหน้า แล้วเพิ่มระบบเช็คสต็อกคลังสินค้า",
    );
    expect(storeExec.ok).toBe(true);
    expect(useStateFlowStore.getState().customNodes.length).toBe(2);
  });

  it("applies executable Webhook Queue cost optimization and supports 1-click undo", () => {
    const store = useStateFlowStore.getState();
    const beforeGraph = composeGraph(store);
    const beforeMetrics = calculateComplexityMetrics(
      beforeGraph.nodes,
      beforeGraph.edges,
      WORKFLOW_PRESETS.ecommerce.quotaLimit,
      WORKFLOW_PRESETS.ecommerce.baseCost,
    );

    const preview = applyWebhookCostOptimization(
      beforeGraph.nodes,
      beforeGraph.edges,
      WORKFLOW_PRESETS.ecommerce.quotaLimit,
      WORKFLOW_PRESETS.ecommerce.baseCost,
    );
    expect(preview.applied).toBe(true);
    expect(preview.savingsThb).toBeGreaterThan(0);
    expect(preview.afterPoints).toBeLessThan(preview.beforePoints);

    const result = store.optimizeGraphCost();
    expect(result.applied).toBe(true);
    const optimizedState = useStateFlowStore.getState();
    expect(optimizedState.undoSnapshot).not.toBeNull();
    expect(optimizedState.baseNodes.some((n) => n.id === "webhook_queue")).toBe(
      true,
    );

    // Calling optimize a second time skips safely
    const secondRun = optimizedState.optimizeGraphCost();
    expect(secondRun.applied).toBe(false);

    // Undo restores exact prior metrics
    const undone = useStateFlowStore.getState().undoLastGraphChange();
    expect(undone).toBe(true);
    const restoredGraph = composeGraph(useStateFlowStore.getState());
    const restoredMetrics = calculateComplexityMetrics(
      restoredGraph.nodes,
      restoredGraph.edges,
      WORKFLOW_PRESETS.ecommerce.quotaLimit,
      WORKFLOW_PRESETS.ecommerce.baseCost,
    );
    expect(restoredMetrics.points).toBe(beforeMetrics.points);
    expect(restoredMetrics.cost).toBe(beforeMetrics.cost);
  });

  it("synthesizes Playwright MBT specs, Mermaid stateDiagram-v2, and Markdown quotation reports", () => {
    const store = useStateFlowStore.getState();
    store.toggleAddon("vip");
    const state = useStateFlowStore.getState();
    const preset = WORKFLOW_PRESETS[state.presetId];
    const { nodes, edges } = composeGraph(state);
    const metrics = calculateComplexityMetrics(
      nodes,
      edges,
      preset.quotaLimit,
      preset.baseCost,
    );

    const pwSpec = generatePlaywrightMbtSpec(preset, nodes, edges, metrics);
    expect(pwSpec).toContain('import { test, expect } from "@playwright/test"');
    expect(pwSpec).toContain("1. Happy Path");
    expect(pwSpec).toContain("2. Leapfrog Bypass Paths");
    expect(pwSpec).toContain("3. Retry Loop Boundaries");
    expect(pwSpec).toContain("4. Fallback Rollbacks");

    const mermaid = generateMermaidStateDiagram(
      preset.workflowSlug,
      nodes,
      edges,
    );
    expect(mermaid).toContain("stateDiagram-v2");
    expect(mermaid).toContain("[*] --> draft");
    expect(mermaid).toContain("[LEAPFROG]");

    const report = generateQuotationReportMarkdown(
      preset,
      nodes,
      edges,
      metrics,
    );
    expect(report).toContain(
      "# StateFlow AI Executive Quotation & Complexity Report",
    );
    expect(report).toContain("143,000 THB");
    expect(report).toContain("380 / 500 Pts");
  });

  it("runs all 5 interactive MCP tools with argument validation", () => {
    const store = useStateFlowStore.getState();

    // Invalid JSON rejected
    const badJson = store.runMcpToolWithParams("read_ssot_graph", "{ broken");
    expect(badJson.ok).toBe(false);
    expect(badJson.log).toContain("-32700");

    // Non-object params rejected
    const arrayJson = store.runMcpToolWithParams("read_ssot_graph", "[1,2]");
    expect(arrayJson.ok).toBe(false);
    expect(arrayJson.log).toContain("-32602");

    // read_ssot_graph
    const readRes = store.runMcpToolWithParams(
      "read_ssot_graph",
      JSON.stringify({ includeMetrics: true }),
    );
    expect(readRes.ok).toBe(true);
    expect(readRes.log).toContain("ecommerce_checkout_ssot");

    // mutate_state_graph with custom intent
    const mutateRes = store.runMcpToolWithParams(
      "mutate_state_graph",
      JSON.stringify({ intent: "เพิ่มตรวจเครดิตบูโร", autoCalculateCost: true }),
    );
    expect(mutateRes.ok).toBe(true);
    expect(mutateRes.log).toContain("AST_UPDATED");

    // evaluate_nxn_matrix
    const matrixRes = store.runMcpToolWithParams(
      "evaluate_nxn_matrix",
      JSON.stringify({ includePaths: true }),
    );
    expect(matrixRes.ok).toBe(true);
    expect(matrixRes.log).toContain("combinatorialTestPaths");

    // generate_qa_playwright (mermaid mode)
    const mermaidRes = store.runMcpToolWithParams(
      "generate_qa_playwright",
      JSON.stringify({ format: "mermaid" }),
    );
    expect(mermaidRes.ok).toBe(true);
    expect(mermaidRes.generatedCode).toContain("stateDiagram-v2");

    // optimize_topology
    const optRes = store.runMcpToolWithParams(
      "optimize_topology",
      JSON.stringify({ mode: "webhook_queue" }),
    );
    expect(optRes.ok).toBe(true);
    expect(optRes.log).toContain('"applied": true');
  });
});
