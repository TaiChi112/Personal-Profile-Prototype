"use client";
import React from 'react';
import { useRadarStore } from '../store/useRadarStore';

export default function Radar() {
  const { skills, updateSkill } = useRadarStore() as any;
  const size = 300;
  const center = size / 2;
  const radius = size / 2.5;

  const points = skills.map((s:any, i:number) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const r = (s.val / 10) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  const gridPolygons = [0.2, 0.4, 0.6, 0.8, 1].map(scale => {
    return skills.map((_:any, i:number) => {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
      const r = scale * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
  });

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="relative flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="transparent" stroke="#e5e7eb" strokeWidth="1" />)}
          {skills.map((_:any, i:number) => {
             const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
             return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="#e5e7eb" strokeWidth="1" />;
          })}
          <polygon points={points} fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" strokeWidth="3" />
          {skills.map((s:any, i:number) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
            const tx = center + (radius + 25) * Math.cos(angle);
            const ty = center + (radius + 20) * Math.sin(angle);
            return <text key={i} x={tx} y={ty} textAnchor="middle" className="text-xs font-bold fill-gray-600 dark:fill-gray-400">{s.name}</text>;
          })}
        </svg>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl">
        <h3 className="font-black text-xl mb-6 text-violet-600">Attribute Points (1-10)</h3>
        <div className="space-y-4">
          {skills.map((s:any) => (
            <div key={s.id}>
              <div className="flex justify-between mb-1"><span className="font-bold text-sm">{s.name}</span><span className="text-xs font-bold text-violet-500">{s.val}/10</span></div>
              <input type="range" min="1" max="10" value={s.val} onChange={e=>updateSkill(s.id, Number(e.target.value))} className="w-full accent-violet-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
