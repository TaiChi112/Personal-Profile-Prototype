import React, { useMemo } from 'react';
import { useBooksStore } from '../store/useBooksStore';

export default function TimelineLayout({ books }: { books: any[] }) {
  const { favorites, toggleFavorite } = useBooksStore();

  const sortedBooks = useMemo(() => {
    if (!books) return [];
    return [...books]
      .filter(book => book.volumeInfo.publishedDate)
      .sort((a, b) => {
        // Sort descending by date
        return new Date(b.volumeInfo.publishedDate).getTime() - new Date(a.volumeInfo.publishedDate).getTime();
      });
  }, [books]);

  if (!sortedBooks || sortedBooks.length === 0) {
    return <div className="text-center p-12 text-gray-500">No timeline data available.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Publication Timeline</h2>
      
      <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-blue-200 dark:before:bg-blue-900">
        {sortedBooks.map((book) => {
          const info = book.volumeInfo;
          const isFav = favorites.some((fav) => fav.id === book.id);
          const year = info.publishedDate.substring(0, 4);
          
          return (
            <div key={book.id} className="relative group">
              {/* Timeline Node */}
              <span className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 z-10 shadow-sm group-hover:scale-125 transition-transform"></span>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5">
                
                <div className="w-24 flex-shrink-0">
                  <img 
                    src={info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/128x192.png?text=No+Cover'} 
                    alt={info.title}
                    className="w-full rounded shadow-sm"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-md mb-2">
                        {year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                        By {info.authors ? info.authors.join(', ') : 'Unknown'}
                      </p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(book)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Toggle Favorite"
                    >
                      <svg className={`w-6 h-6 ${isFav ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
                    {info.description || 'No description available for this book.'}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    {info.categories && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600">
                        {info.categories[0]}
                      </span>
                    )}
                    {info.pageCount && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {info.pageCount} pages
                      </span>
                    )}
                    <a href={info.previewLink} target="_blank" rel="noreferrer" className="ml-auto text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      Preview on Google &rarr;
                    </a>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
