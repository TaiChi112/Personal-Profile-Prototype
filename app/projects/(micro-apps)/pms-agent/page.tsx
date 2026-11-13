"use client";

import React, { useTransition } from "react";
import { EmployeeSelector } from "./components/EmployeeSelector";
import { GoalCard } from "./components/GoalCard";
import { usePmsStore, type FilterStatus } from "./store/usePmsStore";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Layers,
  ArrowRight,
  FileCheck,
} from "lucide-react";

export default function PmsAgentPage() {
  const {
    selectedEmployeeId,
    goals,
    filterStatus,
    setFilterStatus,
    isGenerating,
    generateDraftGoals,
    resetToDefaults,
  } = usePmsStore();

  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      await generateDraftGoals(selectedEmployeeId);
    });
  };

  const filteredGoals = goals.filter((g) => {
    // Show goals matching selected employee
    if (g.employeeId !== selectedEmployeeId) return false;
    if (filterStatus === "ALL") return true;
    return g.status === filterStatus;
  });

  const endorsedCount = goals.filter(
    (g) => g.status === "ENDORSED_MANAGER",
  ).length;
  const confirmedCount = goals.filter(
    (g) => g.status === "CONFIRMED_EMPLOYEE",
  ).length;
  const avgSmartScore = Math.round(
    goals.reduce((acc, g) => acc + g.smartValidation.score, 0) /
      (goals.length || 1),
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top Header & Actions */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                EPIC-032 · Micro-App Prototype
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Zero-DB / Stateful Local Storage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-slate-50">
              rsxyz PMS AI Agent Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              AI ร่าง คนตัดสิน: ระบบจัดทำเป้าหมายอัตโนมัติ ตรวจสอบเกณฑ์ SMART และผูกตัวชี้วัด
              (KPI) พร้อมค่า Baseline ตั้งแต่วันแรก
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-xs"
              title="รีเซ็ตข้อมูล Mock ทั้งหมด"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </header>

        {/* PMS Swimlane Cycle Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs overflow-x-auto">
          <div className="flex items-center min-w-[620px] justify-between gap-2 text-xs">
            {/* Phase 1 */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold shadow-xs">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Phase 1: Goal & KPI Binding (Active)</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* In-Cycle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 dark:text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>ระหว่าง Cycle: ติดตามผล</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Phase 2 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 dark:text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Phase 2: Evaluation</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Phase 3 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 dark:text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px]">
                4
              </span>
              <span>Phase 3: Calibration</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Phase 4 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 dark:text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px]">
                5
              </span>
              <span>Phase 4: Publish & IDP</span>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-slate-400 block font-medium">
              เป้าหมายทั้งหมดในรอบ
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {goals.length}
              </span>
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-slate-400 block font-medium">
              รับรองแล้ว (HITL)
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">
                {endorsedCount}
              </span>
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-slate-400 block font-medium">
              ยืนยันรอบ (Confirmed)
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">
                {confirmedCount}
              </span>
              <FileCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-slate-400 block font-medium">
              SMART Avg Score
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-blue-600">
                {avgSmartScore}/100
              </span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Step 1: Employee Selector */}
        <EmployeeSelector />

        {/* Step 2: Goal Studio Board */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                Step 2: AI Synthesis & Human Endorsement
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                เป้าหมายที่ได้รับการร่างและผูกตัวชี้วัด
              </h2>
            </div>

            {/* Actions: Trigger AI Generation & Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800 p-1 text-xs">
                {(
                  [
                    "ALL",
                    "DRAFT_AI",
                    "ENDORSED_MANAGER",
                    "CONFIRMED_EMPLOYEE",
                  ] as FilterStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      filterStatus === st
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {st === "ALL" && "ทั้งหมด"}
                    {st === "DRAFT_AI" && "รอหัวหน้ารับรอง"}
                    {st === "ENDORSED_MANAGER" && "รับรองแล้ว"}
                    {st === "CONFIRMED_EMPLOYEE" && "ยืนยันแล้ว"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles
                  className={`w-4 h-4 ${isGenerating || isPending ? "animate-spin" : ""}`}
                />
                <span>
                  {isGenerating || isPending
                    ? "กำลังสังเคราะห์..."
                    : "Generate AI Draft"}
                </span>
              </button>
            </div>
          </div>

          {/* Goal Cards Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  ไม่พบเป้าหมายในสถานะที่เลือก
                </p>
                <button
                  type="button"
                  onClick={() => setFilterStatus("ALL")}
                  className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  ดูเป้าหมายทั้งหมด
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer Reference */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span>อ้างอิงพิมพ์เขียวสถาปัตยกรรม: </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              docs/architecture/pms-ai-agent-blueprint.md
            </span>
          </div>
          <div className="font-mono">
            EPIC-032 · Zero-DB Prototype Version 1.0.0
          </div>
        </footer>
      </div>
    </div>
  );
}
