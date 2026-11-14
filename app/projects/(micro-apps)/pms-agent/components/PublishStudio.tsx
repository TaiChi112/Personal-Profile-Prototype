"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TONE_PROFILES } from "../engine/publishEngine";
import { type CorporateTone, MOCK_EMPLOYEES } from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";

const TONE_KEYS: CorporateTone[] = [
  "COACHING_GROWTH",
  "EXECUTIVE_DIRECT",
  "EMPATHETIC_SUPPORT",
];

export function PublishStudio() {
  const {
    selectedEmployeeId,
    publishPackages,
    maskPii,
    setActiveStage,
    generatePublishPackageWithBridge,
    updatePublishPackage,
    publishFeedbackPackage,
    feedIdpToNextCycleGoal,
  } = usePmsStore();

  const employee =
    MOCK_EMPLOYEES.find((e) => e.id === selectedEmployeeId) ||
    MOCK_EMPLOYEES[0];

  const employeePackages = publishPackages.filter(
    (pkg) => pkg.employeeId === employee.id,
  );

  const [selectedTone, setSelectedTone] = useState<CorporateTone>(
    employeePackages[0]?.tone ?? "COACHING_GROWTH",
  );
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>(
    {},
  );
  const [idpDrafts, setIdpDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextFeedback: Record<string, string> = {};
    const nextIdp: Record<string, string> = {};
    for (const pkg of employeePackages) {
      nextFeedback[pkg.id] = pkg.hrEditedFeedback;
      nextIdp[pkg.id] = pkg.idpActionPlan;
    }
    setFeedbackDrafts(nextFeedback);
    setIdpDrafts(nextIdp);
    if (employeePackages[0]) {
      setSelectedTone(employeePackages[0].tone);
    }
  }, [selectedEmployeeId, publishPackages]);

  const handleRegenerateTone = (tone: CorporateTone) => {
    setSelectedTone(tone);
    void generatePublishPackageWithBridge(employee.id, tone);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>
              Phase 5: Publishing, Tone-of-Voice &amp; Continuous IDP Loop
            </span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            ส่งมอบ Feedback ตาม Tone องค์กร และต่อยอด IDP สู่เป้าหมายรอบถัดไป
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Effort Shift: ลดเวลา HR เกลาคำ Feedback (28%) เหลือเพียงตรวจสอบก่อนส่ง
            (7%)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {maskPii
                ? `Letter Recipient: ${employee.anonymizedId}`
                : `Letter Recipient: ${employee.name}`}
            </span>
          </span>

          <button
            type="button"
            onClick={() => handleRegenerateTone(selectedTone)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Tone &amp; Calibrated Score</span>
          </button>
        </div>
      </div>

      {/* Tone-of-Voice Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>Corporate Tone of Voice Profile:</span>
        </span>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Corporate Tone of Voice"
        >
          {TONE_KEYS.map((toneKey) => (
            <button
              key={toneKey}
              type="button"
              onClick={() => handleRegenerateTone(toneKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedTone === toneKey
                  ? "bg-teal-600 border-teal-600 text-white font-semibold"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400"
              }`}
            >
              {TONE_PROFILES[toneKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* Publish & IDP Packages */}
      <div className="grid grid-cols-1 gap-6">
        {employeePackages.map((pkg) => {
          const isPublished = pkg.status === "PUBLISHED";

          return (
            <article
              key={pkg.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isPublished
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800"
                    }`}
                  >
                    {pkg.status}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Calibrated Score: {pkg.calibratedScore.toFixed(1)}/5.0
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Tone: {pkg.tone}
                  </span>
                </div>

                {pkg.fedToNextCycle && (
                  <button
                    type="button"
                    onClick={() => setActiveStage("PHASE_1_GOALS")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>View Next-Cycle Goal in Phase 1</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 7 cols: HR Feedback Letter Editor */}
                <div className="lg:col-span-7 flex flex-col gap-2.5">
                  <label
                    htmlFor={`feedback-${pkg.id}`}
                    className="text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    AI Feedback Draft (HR Review &amp; Approve Before Delivery)
                  </label>
                  <textarea
                    id={`feedback-${pkg.id}`}
                    aria-label={`Feedback draft for ${pkg.goalId}`}
                    rows={8}
                    value={feedbackDrafts[pkg.id] ?? pkg.hrEditedFeedback}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFeedbackDrafts((prev) => ({ ...prev, [pkg.id]: val }));
                      updatePublishPackage(
                        pkg.id,
                        val,
                        idpDrafts[pkg.id] ?? pkg.idpActionPlan,
                      );
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Right 5 cols: IDP & Continuous Loop Seed */}
                <div className="lg:col-span-5 flex flex-col gap-3 border border-teal-100 dark:border-teal-900/50 rounded-xl p-4 bg-teal-50/40 dark:bg-teal-950/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
                    <Compass className="w-4 h-4" />
                    <span>Next-Cycle IDP Builder</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      Focus Competency
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {pkg.idpFocusSkill}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor={`idp-${pkg.id}`}
                      className="text-[11px] font-mono text-slate-500 block mb-1"
                    >
                      Actionable IDP Plan
                    </label>
                    <textarea
                      id={`idp-${pkg.id}`}
                      aria-label={`IDP action plan for ${pkg.goalId}`}
                      rows={3}
                      value={idpDrafts[pkg.id] ?? pkg.idpActionPlan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIdpDrafts((prev) => ({ ...prev, [pkg.id]: val }));
                        updatePublishPackage(
                          pkg.id,
                          feedbackDrafts[pkg.id] ?? pkg.hrEditedFeedback,
                          val,
                        );
                      }}
                      className="w-full rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-950 p-2.5 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="border-t border-teal-200/70 dark:border-teal-800/70 pt-2.5 text-xs">
                    <span className="text-[10px] font-mono uppercase text-teal-700 dark:text-teal-400 block">
                      Continuous Feedback Loop Preview
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {pkg.nextCycleGoalTitle}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Suggested Target: {pkg.nextCycleTargetValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar: HR Publish HITL + Feed IDP Loop */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {pkg.publishedBy
                    ? `Published by ${pkg.publishedBy}`
                    : "Pending HR People Partner inspection prior to employee delivery"}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => publishFeedbackPackage(pkg.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isPublished
                        ? "Published (HR Verified)"
                        : "Approve & Publish Feedback (HR HITL)"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => feedIdpToNextCycleGoal(pkg.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>
                      {pkg.fedToNextCycle
                        ? "IDP Seeded in Next Cycle"
                        : "Feed IDP into Next Cycle Goals"}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
