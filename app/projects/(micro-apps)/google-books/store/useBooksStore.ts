import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayoutMode = 'BOOKSHELF' | 'BENTO' | 'TIMELINE' | 'FAVORITES';

interface BooksState {
  searchQuery: string;
  layoutMode: LayoutMode;
  booksData: any[];
  favorites: any[]; // Store full book objects for favorites
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setBooksData: (data: any[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFavorite: (book: any) => void;
}

export const useBooksStore = create<BooksState>()(
  persist(
    (set) => ({
      searchQuery: '',
      layoutMode: 'BOOKSHELF',
      booksData: [],
      favorites: [],
      isLoading: false,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setBooksData: (data) => set({ booksData: data }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      toggleFavorite: (book) => set((state) => {
        const isFav = state.favorites.some((fav) => fav.id === book.id);
        if (isFav) {
          return { favorites: state.favorites.filter((fav) => fav.id !== book.id) };
        } else {
          return { favorites: [...state.favorites, book] };
        }
      }),
    }),
    {
      name: 'google-books-storage', // Key for LocalStorage
      partialize: (state) => ({ favorites: state.favorites }), // Only persist favorites
    }
  )
);
