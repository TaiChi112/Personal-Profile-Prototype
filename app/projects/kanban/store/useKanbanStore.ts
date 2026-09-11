import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

interface KanbanState {
  tasks: Task[];
  addTask: (title: string, status: TaskStatus) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [
    { id: '1', title: 'Research competitors', status: 'todo' },
    { id: '2', title: 'Design system', status: 'in-progress' },
    { id: '3', title: 'Setup repository', status: 'done' },
  ],
  addTask: (title, status) => set((state) => ({
    tasks: [...state.tasks, { id: Math.random().toString(36).substring(7), title, status }]
  })),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
  })),
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== taskId)
  })),
}));
