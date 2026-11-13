"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import { calculateComplexityMetrics } from "../engine/complexityEngine";
import type { EdgeType, StateNode } from "../engine/types";
import { WORKFLOW_PRESETS } from "../store/presets";
import { composeGraph, useStateFlowStore } from "../store/useStateFlowStore";

const EDGE_COLORS: Record<EdgeType, { stroke: string; marker: string }> = {
  forward: { stroke: "#34d399", marker: "url(#arrow-forward)" },
  loop: { stroke: "#fbbf24", marker: "url(#arrow-loop)" },
  fallback: { stroke: "#f43f5e", marker: "url(#arrow-fallback)" },
  leapfrog: { stroke: "#c084fc", marker: "url(#arrow-leapfrog)" },
};

export function StateCanvasSvg() {
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

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Simulation playback timer
  useEffect(() => {
    if (!state.simMode || state.simMode === "mining") return;
    const timer = setInterval(() => {
      useStateFlowStore.getState().stepSimulation();
    }, 1100);
    return () => clearInterval(timer);
  }, [state.simMode]);

  // Global mouse move / up listeners for SVG node dragging
  useEffect(() => {
    if (!draggingNodeId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const cursorPt = pt.matrixTransform(ctm.inverse());
      state.moveNode(draggingNodeId, cursorPt.x, cursorPt.y);
    };

    const handleMouseUp = () => {
      setDraggingNodeId(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingNodeId, state.moveNode]);

  const nodeMap = useMemo(() => {
    const map: Record<string, StateNode> = {};
    for (const n of nodes) {
      map[n.id] = n;
    }
    return map;
  }, [nodes]);

  const highlightedSet = useMemo(
    () => new Set(state.highlightedEdgeIds),
    [state.highlightedEdgeIds],
  );

  const isMiningMode = state.simMode === "mining";

  const getSimBannerText = () => {
    switch (state.simMode) {
      case "mining":
        return "Live Process Mining: แสดงความน่าจะเป็น (% Traffic) ที่ไหลผ่านแต่ละ State จริง";
      case "best":
        return "AI กำลังวิ่งทดสอบ Best Case (Happy Path ที่สั้นที่สุด)...";
      case "worst":
        return "AI กำลังจำลอง Worst Case (ติด Loop ที่เดิม + เด้งย้อนกลับข้าม State)...";
      case "leapfrog":
        return "AI กำลังทดสอบเงื่อนไขข้ามขั้น (Leapfrog Bypass)...";
      default:
        return "";
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden min-h-[460px]">
      {/* Floating Simulation Status Banner */}
      {state.simMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-indigo-500/50 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 max-w-[90%]">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
          <span className="text-xs font-medium text-indigo-200 truncate">
            {getSimBannerText()}
          </span>
        </div>
      )}

      {/* Floating Graph Metrics Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="text-[10px] text-slate-400">จำนวน States (Nodes)</div>
          <div className="text-sm font-bold font-mono text-white">
            {metrics.nodeCount}
          </div>
        </div>
        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="text-[10px] text-slate-400">
            เส้นเชื่อมเงื่อนไข (Edges)
          </div>
          <div className="text-sm font-bold font-mono text-indigo-400">
            {metrics.edgeCount}
          </div>
        </div>
        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="text-[10px] text-slate-400">
            Cyclomatic Complexity
          </div>
          <div className="text-sm font-bold font-mono text-amber-400">
            {metrics.cyclomatic}
          </div>
        </div>
        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="text-[10px] text-slate-400">
            Possible Test Paths (N x N)
          </div>
          <div className="text-sm font-bold font-mono text-rose-400">
            {metrics.possiblePaths} รูปแบบ
          </div>
        </div>
      </div>

      {/* Interactive Hint */}
      <div className="absolute bottom-3 left-4 z-10 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          เคล็ดลับ: คลิกแล้วลาก (Drag) กล่อง State เพื่อจัดระเบียบ หรือคลิกที่ State เพื่อดู
          Data Flow เข้า-ออก
        </span>
      </div>

      {/* SVG Graph Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        <svg
          ref={svgRef}
          className="w-full h-full select-none"
          viewBox="0 0 1000 620"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrow-forward"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>
            <marker
              id="arrow-loop"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
            </marker>
            <marker
              id="arrow-fallback"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
            </marker>
            <marker
              id="arrow-leapfrog"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffffff" />
            </marker>
            <style>{`
              @keyframes stateflowDash {
                to { stroke-dashoffset: -40; }
              }
              .sf-edge-animated {
                stroke-dasharray: 6, 6;
                animation: stateflowDash 1s linear infinite;
              }
              @keyframes stateflowPulse {
                0%, 100% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.8)); }
                50% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.25)); }
              }
              .sf-node-pulse {
                animation: stateflowPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
            `}</style>
          </defs>

          {/* Layer 1: Edges */}
          <g>
            {edges.map((edge) => {
              const s = nodeMap[edge.from];
              const t = nodeMap[edge.to];
              if (!s || !t) return null;

              const isHighlighted = highlightedSet.has(edge.id);
              const palette = EDGE_COLORS[edge.type] || EDGE_COLORS.forward;
              const strokeColor = isHighlighted ? "#ffffff" : palette.stroke;
              const marker = isHighlighted
                ? "url(#arrow-active)"
                : palette.marker;

              let pathD = "";
              if (edge.from === edge.to) {
                const dir = s.y > 350 ? 1 : -1;
                pathD = `M ${s.x - 28} ${s.y + dir * 28} C ${s.x - 75} ${s.y + dir * 95}, ${s.x + 75} ${s.y + dir * 95}, ${s.x + 28} ${s.y + dir * 28}`;
              } else {
                const dy = t.y - s.y;
                const mx = (s.x + t.x) / 2;
                const my = (s.y + t.y) / 2;

                let curveOffset = 0;
                if (edge.type === "fallback") curveOffset = 55;
                else if (edge.type === "leapfrog") curveOffset = -110;
                else if (Math.abs(dy) > 80) curveOffset = -20;

                const cx = mx - dy * 0.18 + curveOffset * (dy === 0 ? 0 : 0.3);
                const cy = my + curveOffset;

                const angleEnd = Math.atan2(t.y - cy, t.x - cx);
                const endX = t.x - Math.cos(angleEnd) * 62;
                const endY = t.y - Math.sin(angleEnd) * 34;
                pathD = `M ${s.x} ${s.y} Q ${cx} ${cy} ${endX} ${endY}`;
              }

              return (
                <path
                  key={edge.id}
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 3.5 : isMiningMode ? 2.5 : 1.8}
                  markerEnd={marker}
                  opacity={isHighlighted ? 1 : 0.78}
                  className={
                    isHighlighted || isMiningMode ? "sf-edge-animated" : ""
                  }
                />
              );
            })}
          </g>

          {/* Layer 2: Edge Labels */}
          <g>
            {edges.map((edge) => {
              const s = nodeMap[edge.from];
              const t = nodeMap[edge.to];
              if (!s || !t) return null;

              const isHighlighted = highlightedSet.has(edge.id);
              const palette = EDGE_COLORS[edge.type] || EDGE_COLORS.forward;
              const strokeColor = isHighlighted ? "#ffffff" : palette.stroke;

              let labelX = 0;
              let labelY = 0;

              if (edge.from === edge.to) {
                const dir = s.y > 350 ? 1 : -1;
                labelX = s.x;
                labelY = s.y + dir * 82;
              } else {
                const dy = t.y - s.y;
                const mx = (s.x + t.x) / 2;
                const my = (s.y + t.y) / 2;

                let curveOffset = 0;
                if (edge.type === "fallback") curveOffset = 55;
                else if (edge.type === "leapfrog") curveOffset = -110;
                else if (Math.abs(dy) > 80) curveOffset = -20;

                const cx = mx - dy * 0.18 + curveOffset * (dy === 0 ? 0 : 0.3);
                const cy = my + curveOffset;

                const angleEnd = Math.atan2(t.y - cy, t.x - cx);
                const endX = t.x - Math.cos(angleEnd) * 62;
                const endY = t.y - Math.sin(angleEnd) * 34;

                labelX = 0.25 * s.x + 0.5 * cx + 0.25 * endX;
                labelY = 0.25 * s.y + 0.5 * cy + 0.25 * endY;
              }

              const labelText = isMiningMode
                ? `${edge.label} (${edge.prob})`
                : edge.label;
              const rectWidth = Math.max(64, labelText.length * 6.2 + 16);

              return (
                <g
                  key={`lbl-${edge.id}`}
                  transform={`translate(${labelX}, ${labelY})`}
                >
                  <rect
                    x={-rectWidth / 2}
                    y={-10}
                    width={rectWidth}
                    height={19}
                    rx={6}
                    fill={isHighlighted ? "#312e81" : "#0f172a"}
                    stroke={strokeColor}
                    strokeWidth={0.8}
                  />
                  <text
                    textAnchor="middle"
                    dy={3}
                    fill={isHighlighted ? "#ffffff" : "#cbd5e1"}
                    fontSize={10}
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Layer 3: State Nodes */}
          <g>
            {nodes.map((node) => {
              const isSelected = node.id === state.selectedNodeId;
              const isSimActive = node.id === state.highlightedNodeId;

              const fill = isSimActive
                ? "#312e81"
                : node.isAddon
                  ? "#1e1b4b"
                  : "#0f172a";
              const stroke = isSimActive
                ? "#ffffff"
                : isSelected
                  ? "#6366f1"
                  : node.isAddon
                    ? "#a855f7"
                    : "#334155";

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    state.selectNode(node.id);
                  }}
                >
                  <rect
                    x={-68}
                    y={-30}
                    width={136}
                    height={60}
                    rx={14}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected || isSimActive ? 3 : 2}
                    className={isSelected || isSimActive ? "sf-node-pulse" : ""}
                  />
                  <text
                    textAnchor="middle"
                    dy={-4}
                    fill="#f8fafc"
                    fontSize={11.5}
                    fontWeight={700}
                  >
                    {node.label}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={13}
                    fill="#94a3b8"
                    fontSize={10}
                  >
                    {isMiningMode ? `Traffic: ${node.traffic}` : node.sub}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </main>
  );
}
