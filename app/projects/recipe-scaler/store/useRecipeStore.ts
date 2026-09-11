import { create } from 'zustand';

export const useRecipeStore = create((set) => ({
  baseServings: 2,
  targetServings: 5,
  ingredients: [
    { id: 1, name: 'Flour', amount: 200, unit: 'g' },
    { id: 2, name: 'Eggs', amount: 2, unit: 'pcs' },
    { id: 3, name: 'Milk', amount: 100, unit: 'ml' }
  ],
  setBase: (n: number) => set({ baseServings: n }),
  setTarget: (n: number) => set({ targetServings: n }),
  addIng: (i: any) => set((s:any) => ({ ingredients: [...s.ingredients, {...i, id: Date.now()}] })),
  delIng: (id: number) => set((s:any) => ({ ingredients: s.ingredients.filter((i:any) => i.id !== id) }))
}));
