"use client";

import React, { useState } from "react";
import { type GoalDraft } from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";
import {
  CheckCircle2,
  Clock,
  Database,
  Edit3,
  Save,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface GoalCardProps {
  goal: GoalDraft;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { endorseGoal, confirmGoal, updateGoalText } = usePmsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDescription, setEditDescription] = useState(goal.description);

  const handleSave = () => {
    updateGoalText(goal.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(goal.title);
    setEditDescription(goal.description);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    switch (goal.status) {
      case "DRAFT_AI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            AI ร่าง (Awaiting Endorsement)
          </span>
        );
      case "ENDORSED_MANAGER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            หัวหน้ารับรองแล้ว (Manager Endorsed)
          </span>
        );
      case "CONFIRMED_EMPLOYEE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            พนักงานยืนยันแล้ว (Cycle Confirmed)
          </span>
        );
      default:
        return null;
    }
  };

  const confidencePercent = Math.round(goal.confidenceScore * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      {/* Header: Status & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ID: {goal.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>AI Confidence:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
            {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Goal Title & Description */}
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                บันทึกการแก้ไข
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {goal.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="แก้ไขเป้าหมาย"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {goal.description}
            </p>
          </div>
        )}
      </div>

      {/* KPI & Baseline Binding Box (Core Feature P1) */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              KPI & Baseline Binding (หลักฐานรอบประเมิน)
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
            P1 Mandatory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
              ตัวชี้วัด (Metric Name):
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">
              {goal.kpiBinding.metricName}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
              เปรียบเทียบค่าตั้งต้น กับ เป้าหมาย:
            </span>
            <div className="flex items-center gap-2 mt-0.5 font-mono font-bold">
              <span className="text-slate-600 dark:text-slate-400">
                Baseline: {goal.kpiBinding.baselineValue} {goal.kpiBinding.unit}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 dark:text-blue-400">
                Target: {goal.kpiBinding.targetValue} {goal.kpiBinding.unit}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60 pt-2 font-mono">
          <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">
            Data Source: {goal.kpiBinding.dataSourceUri}
          </span>
        </div>
      </div>

      {/* SMART Validation Score Box */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            SMART Criteria Validation
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Score: {goal.smartValidation.score}/100
          </span>
        </div>

        {/* 5 SMART Check Pills */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
              goal.smartValidation.specific
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            [S] Specific
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
              goal.smartValidation.measurable
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            [M] Measurable
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
              goal.smartValidation.achievable
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            [A] Achievable
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
              goal.smartValidation.relevant
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            [R] Relevant
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
              goal.smartValidation.timeBound
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            [T] Time-bound
          </span>
        </div>

        {/* Critiques */}
        <ul className="text-[11px] text-slate-500 dark:text-slate-400 list-disc list-inside space-y-0.5 pt-1">
          {goal.smartValidation.critique.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* HITL Action Controls (Bottom Footer) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          <span>
            Updated:{" "}
            {new Date(goal.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {goal.status === "DRAFT_AI" && (
            <button
              type="button"
              onClick={() => endorseGoal(goal.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              หัวหน้ารับรองร่าง (Manager Endorse)
            </button>
          )}

          {goal.status === "ENDORSED_MANAGER" && (
            <button
              type="button"
              onClick={() => confirmGoal(goal.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              พนักงานยืนยันเป้าหมาย (Employee Confirm)
            </button>
          )}

          {goal.status === "CONFIRMED_EMPLOYEE" && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              พร้อมสำหรับการติดตามผลในรอบ (Phase 2)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
