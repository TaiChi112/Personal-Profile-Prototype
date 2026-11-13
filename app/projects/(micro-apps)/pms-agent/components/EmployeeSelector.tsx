"use client";

import React from "react";
import {
  MOCK_COMPANY_OKRS,
  MOCK_DEPARTMENT_ISSUES,
  MOCK_EMPLOYEES,
} from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";
import {
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Briefcase,
  Target,
  AlertCircle,
} from "lucide-react";

export function EmployeeSelector() {
  const { selectedEmployeeId, setSelectedEmployeeId, maskPii, toggleMaskPii } =
    usePmsStore();

  const selectedEmployee =
    MOCK_EMPLOYEES.find((e) => e.id === selectedEmployeeId) ||
    MOCK_EMPLOYEES[0];
  const relatedIssue = MOCK_DEPARTMENT_ISSUES.find(
    (i) => i.department === selectedEmployee.department,
  );
  const relatedOkr =
    MOCK_COMPANY_OKRS.find((_, idx) => {
      if (selectedEmployee.department === "Engineering") return idx === 0;
      if (selectedEmployee.department === "Sales") return idx === 1;
      return idx === 2;
    }) || MOCK_COMPANY_OKRS[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      {/* Top Header & Privacy Shield */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
              Step 1: Frontline Grounding & Context
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            เลือกพนักงานเพื่อดูบริบทงานและร่างเป้าหมาย
          </h2>
        </div>

        {/* PII Masking Control */}
        <button
          type="button"
          onClick={toggleMaskPii}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            maskPii
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
          }`}
        >
          {maskPii ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PII Protection: Active (Masked ID)</span>
              <EyeOff className="w-3 h-3 ml-1 opacity-70" />
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>PII Protection: Revealed</span>
              <Eye className="w-3 h-3 ml-1 opacity-70" />
            </>
          )}
        </button>
      </div>

      {/* Employee Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MOCK_EMPLOYEES.map((emp) => {
          const isSelected = emp.id === selectedEmployeeId;
          const displayName = maskPii ? emp.anonymizedId : emp.name;

          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                isSelected
                  ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                {emp.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {emp.band}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {emp.role}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  <Briefcase className="w-3 h-3" />
                  <span>{emp.department}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Context Synthesis Banner: Top-Down vs Bottom-Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-xs">
        {/* Top-Down OKR */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Top-Down OKR ({relatedOkr.cycle})
            </span>
            <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
              {relatedOkr.title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {relatedOkr.keyResult}
            </p>
          </div>
        </div>

        {/* Bottom-Up Department Issue */}
        <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Bottom-Up Issue ({relatedIssue?.source})
            </span>
            <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
              {relatedIssue?.title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {relatedIssue?.impact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
