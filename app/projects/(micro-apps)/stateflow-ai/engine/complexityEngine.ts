import type {
  ComplexityMetrics,
  CompoundIntentResult,
  IntentParserAdapter,
  OptimizationResult,
  ParsedIntentResult,
  StateEdge,
  StateNode,
} from "./types";

/**
 * Calibrated weights for Graph-Driven Complexity & Quotation Engine.
 * E-Commerce base (5 nodes, 4 forward, 2 loop, 2 fallback) produces exactly 320 Pts & 125,000 THB.
 */
export const COMPLEXITY_WEIGHTS = {
  node: 30,
  forward: 10,
  loop: 30,
  fallback: 35,
  leapfrog: 60,
} as const;

export const ARCHITECTURAL_BASE_FEE_THB = 29000;
export const COST_PER_POINT_THB = 300;

/**
 * Compute Cyclomatic Complexity, N x N combinatorics, Quota Points, and THB Estimate
 * directly from canonical graph nodes and edges.
 */
export function calculateComplexityMetrics(
  nodes: StateNode[],
  edges: StateEdge[],
  quotaLimit = 500,
  referenceBaseCost = 125000,
): ComplexityMetrics {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  const forwardCount = edges.filter((e) => e.type === "forward").length;
  const loopCount = edges.filter((e) => e.type === "loop").length;
  const fallbackCount = edges.filter((e) => e.type === "fallback").length;
  const leapfrogCount = edges.filter((e) => e.type === "leapfrog").length;

  const cyclomatic = Math.max(1, edgeCount - nodeCount + 2);
  const possiblePaths = Math.max(
    1,
    Math.round(
      cyclomatic * 2.2 +
        loopCount * 2 +
        fallbackCount * 3.5 +
        leapfrogCount * 2,
    ),
  );

  const points =
    nodeCount * COMPLEXITY_WEIGHTS.node +
    forwardCount * COMPLEXITY_WEIGHTS.forward +
    loopCount * COMPLEXITY_WEIGHTS.loop +
    fallbackCount * COMPLEXITY_WEIGHTS.fallback +
    leapfrogCount * COMPLEXITY_WEIGHTS.leapfrog;

  const cost =
    nodeCount === 0
      ? 0
      : ARCHITECTURAL_BASE_FEE_THB + points * COST_PER_POINT_THB;

  return {
    nodeCount,
    edgeCount,
    forwardCount,
    loopCount,
    fallbackCount,
    leapfrogCount,
    cyclomatic,
    possiblePaths,
    points,
    cost,
    overQuota: points > quotaLimit,
    costDeltaFromBase: cost - referenceBaseCost,
  };
}

/**
 * Deterministic Local NLP Intent Parser (Zero-API prototype engine).
 * Converts natural language rules into structured AST nodes and transitions.
 */
export function parseNaturalLanguageIntent(
  promptText: string,
  existingNodes: StateNode[],
  customSeqNumber: number,
): ParsedIntentResult {
  const normalized = promptText.toLowerCase();
  const nodeIds = existingNodes.map((n) => n.id);
  const fallbackStartId = nodeIds[0] || "start";
  const midAnchorId =
    nodeIds[Math.min(1, Math.max(0, nodeIds.length - 1))] || fallbackStartId;
  const nextAnchorId =
    nodeIds[Math.min(2, Math.max(0, nodeIds.length - 1))] || midAnchorId;
  const endAnchorId = nodeIds[nodeIds.length - 1] || nextAnchorId;

  const isKyc =
    normalized.includes("kyc") ||
    normalized.includes("ยืนยันตัวตน") ||
    normalized.includes("สแกนหน้า");
  const isFlash =
    normalized.includes("flash") ||
    normalized.includes("ทางด่วน") ||
    normalized.includes("ข้าม") ||
    normalized.includes("vip");
  const isStock =
    normalized.includes("สต็อก") ||
    normalized.includes("คลัง") ||
    normalized.includes("stock") ||
    normalized.includes("inventory");
  const isCreditOrApproval =
    normalized.includes("เครดิต") ||
    normalized.includes("บูโร") ||
    normalized.includes("อนุมัติ") ||
    normalized.includes("credit") ||
    normalized.includes("approval");

  const ts = Date.now();
  const suffix = customSeqNumber + 1;

  if (isFlash) {
    const bypassNode: StateNode = {
      id: `fast_lane_${suffix}`,
      label: `Fast Lane #${suffix}`,
      sub: "ทางด่วนพิเศษ (Bypass Gate)",
      x: 490 + ((suffix * 45) % 240),
      y: 120 + ((suffix * 35) % 100),
      traffic: "12%",
      isAddon: true,
    };

    const targetId =
      nodeIds.length >= 4 ? nodeIds[nodeIds.length - 2] : endAnchorId;
    const edges: StateEdge[] = [
      {
        id: `ai_${ts}_${suffix}_1`,
        from: midAnchorId,
        to: bypassNode.id,
        label: "เข้าเงื่อนไขทางด่วน",
        type: "leapfrog",
        prob: "12%",
      },
      {
        id: `ai_${ts}_${suffix}_2`,
        from: bypassNode.id,
        to: targetId,
        label: "อนุมัติข้ามขั้นตอน",
        type: "leapfrog",
        prob: "92%",
      },
      {
        id: `ai_${ts}_${suffix}_3`,
        from: bypassNode.id,
        to: fallbackStartId,
        label: "สิทธิ์หมดอายุ (กลับเริ่มต้น)",
        type: "fallback",
        prob: "8%",
      },
    ];

    return {
      node: bypassNode,
      edges,
      summary:
        "AI แปลงคำสั่งสำเร็จ: เพิ่มโหนดทางด่วนพร้อมเส้นทาง Leapfrog และ Fallback อัตโนมัติ",
    };
  }

  let label = `AI Custom Gate #${suffix}`;
  let sub = "เงื่อนไขจาก AI Prompt";
  let fromId = fallbackStartId;
  let toId = midAnchorId;
  let forwardLabel = "ผ่านเกณฑ์ AI";
  let loopLabel = "ข้อมูลไม่ชัด (วนซ้ำ)";
  let fallbackLabel = "ไม่ผ่านเกณฑ์ (รีเซ็ต)";

  if (isKyc) {
    label = `e-KYC Verify #${suffix}`;
    sub = "สแกนใบหน้ายืนยันตัวตน";
    fromId = fallbackStartId;
    toId = midAnchorId;
    forwardLabel = "ยืนยันตัวตนผ่าน";
    loopLabel = "สแกนไม่ติด (ลองใหม่)";
    fallbackLabel = "ต้องสงสัยปลอมแปลง (รีเซ็ต)";
  } else if (isStock) {
    label = `Warehouse Lock #${suffix}`;
    sub = "เช็คสต็อกคลังสินค้า";
    fromId = midAnchorId;
    toId = nextAnchorId;
    forwardLabel = "มีสินค้าพร้อมแพ็ค";
    loopLabel = "รอซิงค์คลัง (Loop)";
    fallbackLabel = "สินค้าหมด (ย้อนคืนเงิน)";
  } else if (isCreditOrApproval) {
    label = `Credit & Audit #${suffix}`;
    sub = "ตรวจสอบเครดิต/อนุมัติ";
    fromId = midAnchorId;
    toId = nextAnchorId;
    forwardLabel = "ผ่านการอนุมัติ";
    loopLabel = "ขอเอกสารเพิ่ม (Loop)";
    fallbackLabel = "ไม่ผ่านเกณฑ์ (รีเซ็ต)";
  }

  const newNode: StateNode = {
    id: `ai_node_${suffix}`,
    label,
    sub,
    x: 260 + ((customSeqNumber * 150) % 450),
    y: 120 + ((customSeqNumber * 70) % 320),
    traffic: "14%",
    isAddon: true,
  };

  const edges: StateEdge[] = [
    {
      id: `ai_${ts}_${suffix}_1`,
      from: fromId,
      to: newNode.id,
      label: `เข้าสู่ ${label}`,
      type: "forward",
      prob: "14%",
    },
    {
      id: `ai_${ts}_${suffix}_2`,
      from: newNode.id,
      to: toId,
      label: forwardLabel,
      type: "forward",
      prob: "75%",
    },
    {
      id: `ai_${ts}_${suffix}_3`,
      from: newNode.id,
      to: newNode.id,
      label: loopLabel,
      type: "loop",
      prob: "18%",
    },
    {
      id: `ai_${ts}_${suffix}_4`,
      from: newNode.id,
      to: fallbackStartId,
      label: fallbackLabel,
      type: "fallback",
      prob: "7%",
    },
  ];

  return {
    node: newNode,
    edges,
    summary: `AI แปลงคำสั่งสำเร็จ: เพิ่มโหนด ${label} พร้อมสร้างเส้นทาง Forward, Self-Loop และ Fallback อัตโนมัติ`,
  };
}

/**
 * Validates and normalizes JSON AST edits from Developer view.
 */
export function validateAndParseAstJson(rawJson: string): {
  valid: boolean;
  nodes?: StateNode[];
  edges?: StateEdge[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson) as {
      nodes?: Partial<StateNode>[];
      edges?: Partial<StateEdge>[];
    };

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return {
        valid: false,
        error: 'JSON ต้องมี Array ของ "nodes" และ "edges"',
      };
    }

    const sanitizedNodes: StateNode[] = parsed.nodes.map((n, idx) => {
      if (!n.id || typeof n.id !== "string") {
        throw new Error(`Node ลำดับที่ ${idx + 1} ต้องมีฟิลด์ "id" เป็นข้อความ`);
      }
      return {
        id: n.id.trim(),
        label: n.label ? String(n.label) : n.id,
        sub: n.sub ? String(n.sub) : "Edited via JSON AST",
        x: Math.max(80, Math.min(920, Number(n.x) || 400)),
        y: Math.max(50, Math.min(560, Number(n.y) || 300)),
        traffic: n.traffic ? String(n.traffic) : "50%",
        isAddon: Boolean(n.isAddon),
      };
    });

    const validNodeIds = new Set(sanitizedNodes.map((n) => n.id));
    const allowedEdgeTypes = new Set([
      "forward",
      "loop",
      "fallback",
      "leapfrog",
    ]);

    const sanitizedEdges: StateEdge[] = parsed.edges.map((e, idx) => {
      if (!e.from || !e.to) {
        throw new Error(`Edge ลำดับที่ ${idx + 1} ต้องมีฟิลด์ "from" และ "to"`);
      }
      if (!validNodeIds.has(e.from) || !validNodeIds.has(e.to)) {
        throw new Error(
          `Edge "${e.id || idx}" อ้างอิง node ที่ไม่มีอยู่ (${e.from} -> ${e.to})`,
        );
      }
      const edgeType =
        e.type && allowedEdgeTypes.has(e.type) ? e.type : "forward";

      return {
        id: e.id ? String(e.id) : `ast_e_${idx}`,
        from: e.from,
        to: e.to,
        label: e.label ? String(e.label) : "Condition",
        type: edgeType,
        prob: e.prob ? String(e.prob) : "50%",
      };
    });

    return {
      valid: true,
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Invalid JSON AST",
    };
  }
}

/**
 * Multi-clause NLP intention parser splitting compound prompts cleanly while preserving single-clause parity.
 */
export function parseCompoundNaturalLanguageIntent(
  promptText: string,
  existingNodes: StateNode[],
  customSeqNumber: number,
): CompoundIntentResult {
  const clauses = promptText
    .split(/(?:แล้ว|ต่อด้วย|พร้อมทั้ง|\band\b|\bthen\b|;|,)/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);

  const effectiveClauses =
    clauses.length > 0 ? clauses.slice(0, 4) : [promptText.trim()];

  const addedNodes: StateNode[] = [];
  const addedEdges: StateEdge[] = [];
  let runningNodes = [...existingNodes];
  let seq = customSeqNumber;

  for (const clause of effectiveClauses) {
    const parsed = parseNaturalLanguageIntent(clause, runningNodes, seq);
    addedNodes.push(parsed.node);
    addedEdges.push(...parsed.edges);
    runningNodes = [...runningNodes, parsed.node];
    seq += 1;
  }

  const summary =
    addedNodes.length === 1
      ? `AI แปลงคำสั่งสำเร็จ: เพิ่มโหนด ${addedNodes[0].label} (${addedEdges.length} เส้นทาง)`
      : `AI แปลงคำสั่งแบบต่อเนื่อง (${addedNodes.length} ขั้นตอน): ${addedNodes.map((n) => n.label).join(" -> ")}`;

  return {
    nodes: addedNodes,
    edges: addedEdges,
    summary,
  };
}

/**
 * Adapter seam matching external AI SDK / Server intent engines without UI coupling.
 */
export const localDeterministicIntentAdapter: IntentParserAdapter = {
  id: "local-deterministic-nlp-v2",
  parse(promptText, existingNodes, customSeqNumber) {
    return parseCompoundNaturalLanguageIntent(
      promptText,
      existingNodes,
      customSeqNumber,
    );
  },
};

/**
 * Executable Topology Cost Optimizer: replaces cyclic backward fallbacks (>= 2) with
 * a unidirectional Webhook Dead-Letter Queue sink to reduce test explosion and THB cost.
 */
export function applyWebhookCostOptimization(
  nodes: StateNode[],
  edges: StateEdge[],
  quotaLimit = 500,
  referenceBaseCost = 125000,
): OptimizationResult {
  const before = calculateComplexityMetrics(
    nodes,
    edges,
    quotaLimit,
    referenceBaseCost,
  );

  const fallbackEdges = edges.filter((e) => e.type === "fallback");
  const alreadyHasWebhook = nodes.some((n) => n.id === "webhook_queue");

  if (fallbackEdges.length < 2 || alreadyHasWebhook) {
    return {
      applied: false,
      beforePoints: before.points,
      afterPoints: before.points,
      beforeCost: before.cost,
      afterCost: before.cost,
      savingsThb: 0,
      removedFallbackIds: [],
      summary: alreadyHasWebhook
        ? "ระบบเปิดใช้งาน Webhook Queue อยู่แล้ว ไม่พบเส้น Fallback ซ้ำซ้อนเพิ่มเติม"
        : "กราฟปัจจุบันมีเส้น Fallback น้อยกว่า 2 เส้น จึงยังคุ้มค่ากว่าการใช้ Webhook Queue",
      nextNodes: nodes.map((n) => ({ ...n })),
      nextEdges: edges.map((e) => ({ ...e })),
    };
  }

  const removedIds = fallbackEdges.map((e) => e.id);
  const removedSet = new Set(removedIds);
  const uniqueSources = Array.from(new Set(fallbackEdges.map((e) => e.from)));

  const webhookNode: StateNode = {
    id: "webhook_queue",
    label: "Webhook Dead-Letter Queue",
    sub: "พักงานอัตโนมัติทางเดียว (Async)",
    x: 490,
    y: 500,
    traffic: "8%",
    isAddon: true,
  };

  const forwardSinkEdges: StateEdge[] = uniqueSources.map((sourceId, idx) => ({
    id: `opt_wh_${idx + 1}`,
    from: sourceId,
    to: webhookNode.id,
    label: "ส่งเข้า Webhook Queue",
    type: "forward",
    prob: "5%",
  }));

  const nextNodes = [...nodes.map((n) => ({ ...n })), webhookNode];
  const nextEdges = [
    ...edges.filter((e) => !removedSet.has(e.id)).map((e) => ({ ...e })),
    ...forwardSinkEdges,
  ];

  const after = calculateComplexityMetrics(
    nextNodes,
    nextEdges,
    quotaLimit,
    referenceBaseCost,
  );

  const savingsThb = before.cost - after.cost;
  if (after.points >= before.points || savingsThb <= 0) {
    return {
      applied: false,
      beforePoints: before.points,
      afterPoints: before.points,
      beforeCost: before.cost,
      afterCost: before.cost,
      savingsThb: 0,
      removedFallbackIds: [],
      summary: "โครงสร้างกราฟปัจจุบันคุ้มค่ากว่าการแยก Webhook Queue แล้ว",
      nextNodes: nodes.map((n) => ({ ...n })),
      nextEdges: edges.map((e) => ({ ...e })),
    };
  }

  return {
    applied: true,
    beforePoints: before.points,
    afterPoints: after.points,
    beforeCost: before.cost,
    afterCost: after.cost,
    savingsThb,
    removedFallbackIds: removedIds,
    addedNode: webhookNode,
    addedEdges: forwardSinkEdges,
    summary: `รวบ ${removedIds.length} เส้น Fallback เป็น Webhook Queue ลดความซับซ้อนลง ${before.points - after.points} Pts ประหยัดงบได้ ${savingsThb.toLocaleString()} THB`,
    nextNodes,
    nextEdges,
  };
}
