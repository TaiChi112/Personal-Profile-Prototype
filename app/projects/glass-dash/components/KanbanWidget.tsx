"use client";

import React from "react";

export default function KanbanWidget({ tasks }: { tasks: any[] }) {
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const inProgressCount = inProgressTasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Kanban Overview</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm opacity-70">To Do</div>
          <div className="text-2xl font-bold">{todoCount}</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm opacity-70">In Progress</div>
          <div className="text-2xl font-bold">{inProgressCount}</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm opacity-70">Done</div>
          <div className="text-2xl font-bold">{doneCount}</div>
        </div>
      </div>

      {inProgressTasks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium opacity-70 mb-2">In Progress Tasks:</h4>
          <ul className="list-disc list-inside space-y-1">
            {inProgressTasks.map((task, idx) => (
              <li key={idx} className="text-sm truncate" title={task.title}>
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
