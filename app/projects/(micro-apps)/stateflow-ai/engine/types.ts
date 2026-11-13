export type EdgeType = "forward" | "loop" | "fallback" | "leapfrog";

export type RolePerspective = "client" | "qa" | "dev" | "mcp";

export type SimulationMode = "best" | "worst" | "leapfrog" | "mining" | null;

export type WorkflowPresetId = "ecommerce" | "pms" | "fintech";

export interface StateNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  traffic: string;
  isAddon?: boolean;
}

export interface StateEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  type: EdgeType;
  prob: string;
}

export interface AddonDefinition {
  id: string;
  title: string;
  description: string;
  summaryTag: string;
  impactLabel: string;
  nodesToAdd: StateNode[];
  edgesToAdd: StateEdge[];
}

export interface SimulationStep {
  node: string;
  edge: string | null;
}

export interface WorkflowPreset {
  id: WorkflowPresetId;
  name: string;
  subtitle: string;
  workflowSlug: string;
  quotaLimit: number;
  baseCost: number;
  basePoints: number;
  baseNodes: StateNode[];
  baseEdges: StateEdge[];
  addons: AddonDefinition[];
  samplePrompts: {
    id: string;
    label: string;
    prompt: string;
  }[];
  simulations: {
    best: SimulationStep[];
    worst: SimulationStep[];
    leapfrog: SimulationStep[];
  };
}

export interface ComplexityMetrics {
  nodeCount: number;
  edgeCount: number;
  forwardCount: number;
  loopCount: number;
  fallbackCount: number;
  leapfrogCount: number;
  cyclomatic: number;
  possiblePaths: number;
  points: number;
  cost: number;
  overQuota: boolean;
  costDeltaFromBase: number;
}

export interface ParsedIntentResult {
  node: StateNode;
  edges: StateEdge[];
  summary: string;
}

export interface CompoundIntentResult {
  nodes: StateNode[];
  edges: StateEdge[];
  summary: string;
}

export interface OptimizationResult {
  applied: boolean;
  beforePoints: number;
  afterPoints: number;
  beforeCost: number;
  afterCost: number;
  savingsThb: number;
  removedFallbackIds: string[];
  addedNode?: StateNode;
  addedEdges?: StateEdge[];
  summary: string;
  nextNodes: StateNode[];
  nextEdges: StateEdge[];
}

export interface GraphSnapshot {
  baseNodes: StateNode[];
  baseEdges: StateEdge[];
  activeAddons: string[];
  customNodes: StateNode[];
  customEdges: StateEdge[];
  selectedNodeId: string;
}

export type McpToolName =
  | "read_ssot_graph"
  | "mutate_state_graph"
  | "evaluate_nxn_matrix"
  | "generate_qa_playwright"
  | "optimize_topology";

export interface IntentParserAdapter {
  id: string;
  parse(
    promptText: string,
    existingNodes: StateNode[],
    customSeqNumber: number,
  ): Promise<CompoundIntentResult> | CompoundIntentResult;
}
