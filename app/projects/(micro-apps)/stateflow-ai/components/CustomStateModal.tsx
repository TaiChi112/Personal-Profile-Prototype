"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { composeGraph, useStateFlowStore } from "../store/useStateFlowStore";

interface CustomStateModalProps {
  open: boolean;
  onClose: () => void;
}

export function CustomStateModal({ open, onClose }: CustomStateModalProps) {
  const state = useStateFlowStore();
  const { nodes } = useMemo(
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

  const [name, setName] = useState("Supervisor_Approval");
  const [fromId, setFromId] = useState(nodes[0]?.id || "");
  const [toId, setToId] = useState(
    nodes[2]?.id || nodes[1]?.id || nodes[0]?.id || "",
  );
  const [hasLoop, setHasLoop] = useState(true);

  useEffect(() => {
    if (open && nodes.length > 0) {
      setFromId(nodes[0].id);
      setToId(nodes[Math.min(2, nodes.length - 1)].id);
    }
  }, [open, nodes]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    state.addCustomState({ name, fromId, toId, hasLoop });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-white">
            เพิ่ม Custom State เข้าสู่ Workflow
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          จำลองการแทรก State ใหม่ตามความต้องการ แล้วดู AI คำนวณความซับซ้อนและราคา
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-300 block mb-1">
              ชื่อ State ใหม่ (เช่น รออนุมัติวงเงินพิเศษ)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                รับข้อมูลจาก State (From)
              </label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
              >
                {nodes.map((n) => (
                  <option key={`from-${n.id}`} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                เมื่อผ่าน ส่งต่อไปที่ (To)
              </label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
              >
                {nodes.map((n) => (
                  <option key={`to-${n.id}`} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={hasLoop}
              onChange={(e) => setHasLoop(e.target.checked)}
              className="accent-indigo-500"
            />
            <span className="text-xs text-slate-300">
              มีโอกาสติดลูปที่เดิม (Retry Condition) และเด้งกลับจุดเริ่มต้น
            </span>
          </label>

          <div className="mt-5 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              แทรก State &amp; คำนวณราคา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
