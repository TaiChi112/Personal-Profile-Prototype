"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Lightbulb,
  Play,
  Plug,
  Rocket,
  Terminal,
  Zap,
} from "lucide-react";
import {
  ARCHITECTURAL_BASE_FEE_THB,
  COMPLEXITY_WEIGHTS,
  COST_PER_POINT_THB,
  calculateComplexityMetrics,
} from "../engine/complexityEngine";
import { WORKFLOW_PRESETS } from "../store/presets";
import { composeGraph, useStateFlowStore } from "../store/useStateFlowStore";

export function RightInspectorSidebar() {
  const state = useStateFlowStore();
  const preset = WORKFLOW_PRESETS[state.presetId];
  const { nodes, edges } = useMemo(
    () => composeGraph(state),
    [
      state.presetId,
      state.activeAddons,
      state.baseNodes,
      state.baseEdges,
      state.customNodes,
      state.customEdges,
    ],
  );

  const metrics = useMemo(
    () =>
      calculateComplexityMetrics(
        nodes,
        edges,
        preset.quotaLimit,
        preset.baseCost,
      ),
    [nodes, edges, preset.quotaLimit, preset.baseCost],
  );

  const selectedNode =
    nodes.find((n) => n.id === state.selectedNodeId) || nodes[0];
  const incoming = selectedNode
    ? edges.filter((e) => e.to === selectedNode.id)
    : [];
  const outgoing = selectedNode
    ? edges.filter((e) => e.from === selectedNode.id)
    : [];

  // Dev AST JSON editor state
  const astPayloadString = useMemo(
    () =>
      JSON.stringify(
        {
          workflowId: preset.workflowSlug,
          metrics: {
            nodes: metrics.nodeCount,
            edges: metrics.edgeCount,
            cyclomatic: metrics.cyclomatic,
            quotaPts: metrics.points,
            estimatedCostTHB: metrics.cost,
          },
          nodes: nodes.map((n) => ({
            id: n.id,
            label: n.label,
            sub: n.sub,
            x: n.x,
            y: n.y,
            traffic: n.traffic,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            from: e.from,
            to: e.to,
            label: e.label,
            type: e.type,
            prob: e.prob,
          })),
        },
        null,
        2,
      ),
    [preset.workflowSlug, metrics, nodes, edges],
  );

  const [devJsonInput, setDevJsonInput] = useState(astPayloadString);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDevJsonInput(astPayloadString);
    setJsonError(null);
  }, [astPayloadString]);

  const handleParseAst = () => {
    const res = state.applyJsonAst(devJsonInput);
    if (!res.valid) {
      setJsonError(res.error || "Invalid JSON AST");
    } else {
      setJsonError(null);
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(devJsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const getRoleHeader = () => {
    switch (state.activeRole) {
      case "client":
        return {
          title: "มุมมองผู้บริหาร & ลูกค้า (Executive View)",
          sub: "วิเคราะห์ความคุ้มค่า ความเสี่ยง และทางเลือกลดต้นทุน",
        };
      case "qa":
        return {
          title: "มุมมอง QA & Tester (Model-Based Testing)",
          sub: "รายการ Test Paths ที่ AI สร้างอัตโนมัติจาก State Diagram",
        };
      case "dev":
        return {
          title: "มุมมอง Developer (Live JSON AST Parser)",
          sub: "แก้ไข JSON สดเพื่อเปลี่ยนรูปกราฟและอัปเดตราคาทันที",
        };
      case "mcp":
        return {
          title: "MCP Server & Agentic Orchestrator",
          sub: "Model Context Protocol สำหรับให้ AI ภายนอกเชื่อมต่อ",
        };
    }
  };

  const roleHeader = getRoleHeader();
  const leapfrogEdges = edges.filter((e) => e.type === "leapfrog");
  const loopAndFallbackEdges = edges.filter(
    (e) => e.type === "loop" || e.type === "fallback",
  );

  return (
    <aside className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col z-10 overflow-hidden shrink-0">
      {/* Dynamic Role Panel Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {roleHeader.title}
          </h2>
          <p className="text-[11px] text-slate-400">{roleHeader.sub}</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      </div>

      {/* Panel Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.activeRole === "client" && (
          <>
            {selectedNode && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-indigo-400 font-bold uppercase">
                  State ที่เลือกอยู่ตอนนี้
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedNode.label} ({selectedNode.sub})
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">
                      ทางเข้า (Incoming)
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {incoming.length} เงื่อนไข
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">
                      ทางออก (Outgoing)
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {outgoing.length} เงื่อนไข
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Cost & Impact Advisor */}
            <div
              className={`p-3.5 rounded-xl border ${
                metrics.overQuota
                  ? "bg-rose-950/30 border-rose-500/40"
                  : "bg-indigo-950/20 border-indigo-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="w-4 h-4 text-indigo-300" />
                <span
                  className={`text-xs font-bold ${
                    metrics.overQuota ? "text-rose-300" : "text-indigo-300"
                  }`}
                >
                  AI Impact &amp; Cost Analysis
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                {metrics.overQuota ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <p>
                  {metrics.overQuota ? (
                    <>
                      <strong>
                        เกินโควต้าความซับซ้อน ({metrics.points}/{preset.quotaLimit}{" "}
                        Pts):
                      </strong>{" "}
                      การแทรก State และเส้นย้อนกลับแบบ Many-to-Many ทำให้ทีมต้องเขียนดัก
                      Test Case เพิ่มเป็น{" "}
                      <strong>{metrics.possiblePaths} เส้นทาง</strong>
                    </>
                  ) : (
                    <>
                      <strong>
                        อยู่ในงบโควต้า ({metrics.points}/{preset.quotaLimit} Pts):
                      </strong>{" "}
                      ระบบมีความซับซ้อนระดับจัดการได้ มีเส้นทางที่ต้องทดสอบรวม{" "}
                      <strong>{metrics.possiblePaths} รูปแบบ</strong>
                    </>
                  )}
                </p>
              </div>

              {(metrics.fallbackCount >= 3 || state.customNodes.length > 0) && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/90 border border-emerald-500/30">
                  <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>AI แนะนำทางเลือกที่ถูกกว่า (Cost Optimization):</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    แทนที่จะสร้างลูปย้อนกลับไปมาหลาย State แนะนำให้ใช้{" "}
                    <strong>Webhook Queue แบบทางเดียว</strong> จะช่วยลดเส้น
                    Fallback ลงได้ 2-3 เส้น ประหยัดงบได้ <strong>28,500 THB</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Graph-Driven Transparent Cost Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-300 mb-1">
                โครงสร้างการคำนวณจากกราฟจริง (Graph-Driven):
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Architectural Base Setup:</span>
                <span className="font-mono text-slate-200">
                  {metrics.nodeCount === 0
                    ? "0 THB"
                    : `${ARCHITECTURAL_BASE_FEE_THB.toLocaleString()} THB`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  States ({metrics.nodeCount} x {COMPLEXITY_WEIGHTS.node} Pts):
                </span>
                <span className="font-mono text-slate-200">
                  +
                  {(
                    metrics.nodeCount *
                    COMPLEXITY_WEIGHTS.node *
                    COST_PER_POINT_THB
                  ).toLocaleString()}{" "}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Forward Edges ({metrics.forwardCount} x{" "}
                  {COMPLEXITY_WEIGHTS.forward} Pts):
                </span>
                <span className="font-mono text-emerald-300">
                  +
                  {(
                    metrics.forwardCount *
                    COMPLEXITY_WEIGHTS.forward *
                    COST_PER_POINT_THB
                  ).toLocaleString()}{" "}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Retry Loops ({metrics.loopCount} x {COMPLEXITY_WEIGHTS.loop}{" "}
                  Pts):
                </span>
                <span className="font-mono text-amber-300">
                  +
                  {(
                    metrics.loopCount *
                    COMPLEXITY_WEIGHTS.loop *
                    COST_PER_POINT_THB
                  ).toLocaleString()}{" "}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Fallbacks ({metrics.fallbackCount} x{" "}
                  {COMPLEXITY_WEIGHTS.fallback} Pts):
                </span>
                <span className="font-mono text-rose-300">
                  +
                  {(
                    metrics.fallbackCount *
                    COMPLEXITY_WEIGHTS.fallback *
                    COST_PER_POINT_THB
                  ).toLocaleString()}{" "}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Leapfrog Skips ({metrics.leapfrogCount} x{" "}
                  {COMPLEXITY_WEIGHTS.leapfrog} Pts):
                </span>
                <span className="font-mono text-purple-300">
                  +
                  {(
                    metrics.leapfrogCount *
                    COMPLEXITY_WEIGHTS.leapfrog *
                    COST_PER_POINT_THB
                  ).toLocaleString()}{" "}
                  THB
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>รวมประมาณการ ({metrics.points} Pts):</span>
                <span className="font-mono text-indigo-300">
                  {metrics.cost.toLocaleString()} THB
                </span>
              </div>
            </div>
          </>
        )}

        {state.activeRole === "qa" && (
          <>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>1. Best Case (Happy Path)</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded">
                {nodes.map((n) => n.label).join(" -> ")}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <div className="text-xs font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>2. Leapfrog / Bypass Cases ({leapfrogEdges.length})</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded space-y-1">
                {leapfrogEdges.length > 0 ? (
                  leapfrogEdges.map((le) => (
                    <div key={le.id}>
                      {le.from} -&gt; [{le.label}] -&gt; {le.to}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400">
                    ยังไม่ได้เปิดใช้งานเงื่อนไขข้าม State (Leapfrog)
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
              <div className="text-xs font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  3. Worst / Edge Cases ({loopAndFallbackEdges.length})
                </span>
              </div>
              <ul className="text-[11px] font-mono text-slate-300 space-y-1.5 bg-slate-950 p-2.5 rounded">
                {loopAndFallbackEdges.map((edge) => (
                  <li
                    key={edge.id}
                    className={
                      edge.type === "fallback"
                        ? "text-rose-300"
                        : "text-amber-300"
                    }
                  >
                    [{edge.type.toUpperCase()}] {edge.from} -&gt; {edge.to} (
                    {edge.label})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {state.activeRole === "dev" && (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-300 font-semibold">
                Live Canonical JSON AST
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleParseAst}
                  className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-medium shadow inline-flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Parse &amp; Render</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              ลองแก้ไข <code>nodes</code> หรือ <code>edges</code> ด้านล่างแล้วกด{" "}
              <strong>Parse &amp; Render</strong> กราฟและราคาประเมินจะเปลี่ยนทันที
            </p>
            {jsonError && (
              <div className="text-[11px] text-rose-400 bg-rose-950/50 border border-rose-500/40 p-2 rounded-lg font-mono">
                Error: {jsonError}
              </div>
            )}
            <textarea
              rows={17}
              value={devJsonInput}
              onChange={(e) => setDevJsonInput(e.target.value)}
              className="w-full text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </>
        )}

        {state.activeRole === "mcp" && (
          <>
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Plug className="w-3.5 h-3.5" />
                  <span>MCP Server Endpoint</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  Simulated Active
                </span>
              </div>
              <div className="text-[11px] font-mono bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                mcp://stateflow-ssot.internal:8080/sse
              </div>
              <p className="text-[11px] text-slate-400">
                จำลองการเรียกใช้ MCP Tool สำหรับ Agent ภายนอกในการอ่านและขยาย State
                AST
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">
                Exposed MCP Tools (คลิกเพื่อจำลองการยิงคำสั่ง):
              </div>

              <button
                type="button"
                onClick={() => state.triggerMcpTool("mutate_state_graph")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    1. mutate_state_graph()
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    Run <Play className="w-2.5 h-2.5" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  แปลง Human Intention เป็น JSON Node &amp; Edges
                  ใหม่โดยไม่ต้องวาดมือ
                </p>
              </button>

              <button
                type="button"
                onClick={() => state.triggerMcpTool("evaluate_nxn_matrix")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    2. evaluate_nxn_matrix()
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    Run <Play className="w-2.5 h-2.5" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  คำนวณผลกระทบ N x N, หา Loop Risk และประเมินราคาส่วนเพิ่ม
                </p>
              </button>

              <button
                type="button"
                onClick={() => state.triggerMcpTool("generate_qa_playwright")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    3. generate_qa_playwright()
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    Run <Play className="w-2.5 h-2.5" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ให้ QA Agent ดึง JSON AST ไปสร้างโค้ด Automated Test ทันที
                </p>
              </button>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>JSON-RPC 2.0 Live Log:</span>
              </div>
              <pre className="text-[10px] font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-cyan-300 overflow-x-auto h-36 leading-relaxed">
                {state.mcpLog}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section: N x N Matrix Mini Map */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">
            ตารางความสัมพันธ์ State (N x N Matrix)
          </span>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            {metrics.nodeCount} x {metrics.nodeCount}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center font-mono text-[10px] border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-slate-500 border border-slate-800">
                  From\To
                </th>
                {nodes.map((n, idx) => (
                  <th
                    key={`h-${n.id}`}
                    className="p-1 text-slate-300 border border-slate-800"
                    title={n.label}
                  >
                    S{idx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((rowNode, rIdx) => (
                <tr key={`r-${rowNode.id}`}>
                  <td
                    className="p-1 font-bold text-slate-300 border border-slate-800"
                    title={rowNode.label}
                  >
                    S{rIdx + 1}
                  </td>
                  {nodes.map((colNode) => {
                    const match = edges.find(
                      (e) => e.from === rowNode.id && e.to === colNode.id,
                    );
                    let cellClass = "text-slate-700";
                    let symbol = ".";
                    if (match) {
                      symbol = "1";
                      if (match.type === "forward")
                        cellClass =
                          "bg-emerald-500/20 text-emerald-300 font-bold";
                      if (match.type === "loop")
                        cellClass = "bg-amber-500/20 text-amber-300 font-bold";
                      if (match.type === "fallback")
                        cellClass = "bg-rose-500/20 text-rose-300 font-bold";
                      if (match.type === "leapfrog")
                        cellClass =
                          "bg-purple-500/20 text-purple-300 font-bold";
                    }
                    return (
                      <td
                        key={`c-${rowNode.id}-${colNode.id}`}
                        className={`p-1 border border-slate-800 ${cellClass}`}
                      >
                        {symbol}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  );
}
