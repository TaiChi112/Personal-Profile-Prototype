"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBooksStore, LayoutMode } from './store/useBooksStore';
import BookshelfLayout from './layouts/BookshelfLayout';
import BentoLayout from './layouts/BentoLayout';
import TimelineLayout from './layouts/TimelineLayout';

export default function GoogleBooksExplorer() {
  const [mounted, setMounted] = useState(false);
  const {
    searchQuery,
    layoutMode,
    booksData,
    favorites,
    isLoading,
    setSearchQuery,
    setLayoutMode,
    setBooksData,
    setIsLoading,
  } = useBooksStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBooks = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/google-books/proxy?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setBooksData(data.items || []);
      // Switch back to bookshelf if searching from favorites tab
      if (layoutMode === 'FAVORITES') setLayoutMode('BOOKSHELF');
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooksData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    await fetchBooks(searchQuery);
  };

  const loadRandomSubject = () => {
    const subjects = ['React.js', 'Artificial Intelligence', 'Software Architecture', 'UI/UX Design', 'History of Rome', 'Space Exploration'];
    const random = subjects[Math.floor(Math.random() * subjects.length)];
    setSearchQuery(random);
    fetchBooks(random);
  };

  // Initial load
  useEffect(() => {
    if (booksData.length === 0 && !isLoading) {
      loadRandomSubject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch for LocalStorage

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-500">Google</span> Books Explorer
            </h1>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 flex w-full gap-2">
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                Search
              </button>
              <button type="button" onClick={loadRandomSubject} title="Feeling Lucky" className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {(['BOOKSHELF', 'BENTO', 'TIMELINE'] as LayoutMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layoutMode === mode
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {mode.charAt(0) + mode.slice(1).toLowerCase()}
              </button>
            ))}
            
            <div className="flex-1"></div>
            
            <button
              onClick={() => setLayoutMode('FAVORITES')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                layoutMode === 'FAVORITES'
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
              }`}
            >
              <svg className={`w-4 h-4 ${favorites.length > 0 ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              My Library ({favorites.length})
            </button>
          </div>
        </div>

        {/* Layout Content */}
        <div className="layout-container min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {layoutMode === 'BOOKSHELF' && <BookshelfLayout books={booksData} />}
              {layoutMode === 'BENTO' && <BentoLayout books={booksData} />}
              {layoutMode === 'TIMELINE' && <TimelineLayout books={booksData} />}
              {layoutMode === 'FAVORITES' && <BookshelfLayout books={favorites} title="My Saved Library" />}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
