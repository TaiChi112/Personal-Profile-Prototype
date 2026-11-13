import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type EmployeeProfile,
  type GoalDraft,
  INITIAL_GOAL_DRAFTS,
  MOCK_EMPLOYEES,
} from "./mockData";

export type FilterStatus =
  | "ALL"
  | "DRAFT_AI"
  | "ENDORSED_MANAGER"
  | "CONFIRMED_EMPLOYEE";

interface PmsState {
  selectedEmployeeId: string;
  goals: GoalDraft[];
  filterStatus: FilterStatus;
  isGenerating: boolean;
  maskPii: boolean;

  setSelectedEmployeeId: (id: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  toggleMaskPii: () => void;
  generateDraftGoals: (employeeId: string) => Promise<void>;
  endorseGoal: (goalId: string) => void;
  confirmGoal: (goalId: string) => void;
  updateGoalText: (goalId: string, title: string, description: string) => void;
  resetToDefaults: () => void;
}

export const usePmsStore = create<PmsState>()(
  persist(
    (set, get) => ({
      selectedEmployeeId: MOCK_EMPLOYEES[0].id,
      goals: INITIAL_GOAL_DRAFTS,
      filterStatus: "ALL",
      isGenerating: false,
      maskPii: true,

      setSelectedEmployeeId: (id: string) => {
        set({ selectedEmployeeId: id });
      },

      setFilterStatus: (filterStatus: FilterStatus) => {
        set({ filterStatus });
      },

      toggleMaskPii: () => {
        set((state) => ({ maskPii: !state.maskPii }));
      },

      generateDraftGoals: async (employeeId: string) => {
        set({ isGenerating: true });

        // Simulate asynchronous AI inference
        await new Promise((resolve) => setTimeout(resolve, 600));

        const existing = get().goals.find((g) => g.employeeId === employeeId);
        if (existing) {
          // Refresh existing draft
          set((state) => ({
            isGenerating: false,
            goals: state.goals.map((g) =>
              g.id === existing.id
                ? {
                    ...g,
                    status: "DRAFT_AI",
                    confidenceScore: Math.min(0.99, g.confidenceScore + 0.02),
                    updatedAt: new Date().toISOString(),
                  }
                : g,
            ),
          }));
        } else {
          set({ isGenerating: false });
        }
      },

      endorseGoal: (goalId: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  status: "ENDORSED_MANAGER",
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      confirmGoal: (goalId: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  status: "CONFIRMED_EMPLOYEE",
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      updateGoalText: (goalId: string, title: string, description: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  title,
                  description,
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      resetToDefaults: () => {
        set({
          selectedEmployeeId: MOCK_EMPLOYEES[0].id,
          goals: INITIAL_GOAL_DRAFTS,
          filterStatus: "ALL",
          isGenerating: false,
          maskPii: true,
        });
      },
    }),
    {
      name: "rsxyz-pms-agent-store-v1",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    },
  ),
);
