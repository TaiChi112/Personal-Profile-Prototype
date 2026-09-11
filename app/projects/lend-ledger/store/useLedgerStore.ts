import { create } from 'zustand';

export const useLedgerStore = create((set) => ({
  records: [
    { id: 1, name: 'John Doe', item: '500 THB', date: '2024-09-01', returned: false },
    { id: 2, name: 'Jane Smith', item: 'Harry Potter Book', date: '2024-08-15', returned: true },
  ],
  addRecord: (r: any) => set((s:any) => ({ records: [{...r, id: Date.now(), returned: false}, ...s.records] })),
  toggleReturn: (id: number) => set((s:any) => ({ records: s.records.map((r:any) => r.id === id ? {...r, returned: !r.returned} : r) })),
  delRecord: (id: number) => set((s:any) => ({ records: s.records.filter((r:any) => r.id !== id) }))
}));
