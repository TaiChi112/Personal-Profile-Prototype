import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const INITIAL_MARKDOWN = `# Welcome to NoteFlow 📝

NoteFlow is a minimalist, real-time markdown editor designed for speed and clarity.

## Key Features
- **Dual-Pane Live Preview**: Instant markdown rendering side-by-side
- **Local Persistence**: Notes are preserved across browser sessions
- **Clean Interface**: Focused writing experience with syntax styling

### Getting Started
1. Type markdown in the editor pane
2. Watch the live formatted preview update instantly
3. Use standard markdown syntax:
   - Headings (\`#\`, \`##\`, \`###\`)
   - Bulleted and numbered lists
   - Code blocks and inline code
   - *Italics* and **bold** text
   - Blockquotes and links

### Next Steps
- [x] Set up markdown store
- [ ] Connect live editor components
- [ ] Add export and download options
`;

export interface NoteState {
  markdown: string;
  setMarkdown: (text: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      markdown: INITIAL_MARKDOWN,
      setMarkdown: (text: string) => set({ markdown: text }),
    }),
    {
      name: 'noteflow-note-storage',
    }
  )
);

export const setMarkdown = (text: string) => {
  useNoteStore.getState().setMarkdown(text);
};

export default useNoteStore;
