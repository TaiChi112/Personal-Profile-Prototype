"use client";
import React, { useTransition, useRef } from 'react';
import { addTimeBlockAction, deleteTimeBlockAction } from '../actions';
import { TimeBlock } from '@prisma/client';

export default function TimePie({ timeBlocks }: { timeBlocks: TimeBlock[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const getDuration = (start: string, end: string) => {
    if (!start.includes(':')) {
      return Math.max(0, Number(end || 0) - Number(start || 0));
    }
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let hrs = (eh - sh) + (em - sm) / 60;
    if (hrs < 0) hrs += 24;
    return hrs;
  };

  const activities = timeBlocks.map(tb => ({
    ...tb,
    hours: getDuration(tb.start, tb.end)
  }));

  const totalUsed = activities.reduce((s, a) => s + a.hours, 0);

  // Build conic gradient string
  const stops: string[] = [];
  let currentPct = 0;
  for (const a of activities) {
    const startPct = currentPct;
    currentPct += (a.hours / 24) * 100;
    stops.push(`${a.color} ${startPct}%, ${a.color} ${currentPct}%`);
  }
  if (24 - totalUsed > 0) stops.push(`#e5e7eb ${currentPct}%, #e5e7eb 100%`);

  const gradient = `conic-gradient(${stops.join(', ')})`;

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="flex justify-center relative md:sticky md:top-8">
        <div className="w-64 h-64 rounded-full shadow-2xl relative" style={{background: gradient}}>
          <div className="absolute inset-0 m-auto w-40 h-40 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-black">{Math.round((24 - totalUsed) * 10) / 10}h</span>
            <span className="text-xs font-bold text-gray-500">FREE TIME</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl">
        <h3 className="font-black text-xl mb-6">Your 24 Hours</h3>
        <div className="space-y-4 mb-6">
          {activities.map(a => (
            <div key={a.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{backgroundColor: a.color}}></span>
                <span className="font-bold">{a.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 text-right">
                  <div>{a.start} - {a.end}</div>
                  <div className="font-bold">{Math.round(a.hours * 10) / 10} hrs</div>
                </div>
                <button 
                  onClick={() => {
                    startTransition(() => {
                      deleteTimeBlockAction(a.id);
                    });
                  }}
                  className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                  disabled={isPending}
                >×</button>
              </div>
            </div>
          ))}
          {activities.length === 0 && <p className="text-gray-500 text-center text-sm">No time blocks added yet.</p>}
        </div>
        
        <form 
          ref={formRef}
          action={(fd) => {
            startTransition(() => {
              addTimeBlockAction(fd).then(() => {
                formRef.current?.reset();
              });
            });
          }} 
          className="border-t border-gray-100 dark:border-gray-700 pt-6"
        >
          <h4 className="font-bold mb-4">Add Block</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input name="title" required placeholder="Activity Name" className="col-span-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Start</label>
              <input name="start" type="time" required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">End</label>
              <input name="end" type="time" required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500">Color</label>
              <input name="color" type="color" defaultValue="#6366F1" className="w-8 h-8 rounded cursor-pointer" />
            </div>
            <button disabled={isPending} type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 disabled:opacity-50">
              Add Activity
            </button>
          </div>
        </form>

        {24 - totalUsed < 0 && <p className="text-red-500 font-bold text-center mt-6 text-sm">Warning: You exceeded 24 hours!</p>}
      </div>
    </div>
  );
}
