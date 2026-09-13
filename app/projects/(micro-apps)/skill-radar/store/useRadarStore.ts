import { create } from 'zustand';

export const useRadarStore = create((set) => ({
  skills: [
    { id: 1, name: 'React', val: 8 },
    { id: 2, name: 'UI/UX', val: 5 },
    { id: 3, name: 'Backend', val: 6 },
    { id: 4, name: 'DevOps', val: 3 },
    { id: 5, name: 'Soft Skills', val: 9 }
  ],
  updateSkill: (id: number, v: number) => set((s:any) => ({ skills: s.skills.map((sk:any) => sk.id === id ? {...sk, val: v} : sk) }))
}));
