import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NoteState {
  markdown: string;
  setMarkdown: (text: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      markdown: '# Hello NoteFlow\n\nWrite your markdown here...',
      setMarkdown: (markdown) => set({ markdown }),
    }),
    { name: 'noteflow-storage' }
  )
);
