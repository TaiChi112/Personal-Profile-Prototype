import { create } from 'zustand';

export const useChoreStore = create((set) => ({
  people: ['Alice', 'Bob', 'Charlie'],
  chores: ['Take out Trash', 'Wash Dishes', 'Clean Bathroom'],
  assignments: [] as {person: string, chore: string}[],
  assign: () => set((s:any) => {
    let shuffledChores = [...s.chores].sort(() => 0.5 - Math.random());
    const result = s.people.map((p:string, i:number) => ({
      person: p,
      chore: shuffledChores[i % shuffledChores.length] || 'Free Day'
    }));
    return { assignments: result };
  })
}));
