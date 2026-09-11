import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LayoutMode = 'BENTO' | 'TABS' | 'TIMELINE';

interface GithubStore {
  searchQuery: string;
  layoutMode: LayoutMode;
  userPat: string;
  userData: any;
  reposData: any[];
  eventsData: any[];
  setSearchQuery: (query: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setUserPat: (pat: string) => void;
  setUserData: (data: any) => void;
  setReposData: (data: any[]) => void;
  setEventsData: (data: any[]) => void;
}

export const useGithubStore = create<GithubStore>()(
  persist(
    (set) => ({
      searchQuery: '',
      layoutMode: 'BENTO',
      userPat: '',
      userData: null,
      reposData: [],
      eventsData: [],
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setUserPat: (pat) => set({ userPat: pat }),
      setUserData: (data) => set({ userData: data }),
      setReposData: (data) => set({ reposData: data }),
      setEventsData: (data) => set({ eventsData: data }),
    }),
    {
      name: 'github-store',
      // We persist the userPat to localStorage so it's not lost on reload, while other state can be temporary
      partialize: (state) => ({ userPat: state.userPat }), 
    }
  )
);
