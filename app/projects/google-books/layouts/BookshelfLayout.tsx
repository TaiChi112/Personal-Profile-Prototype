import React from 'react';
import { useBooksStore } from '../store/useBooksStore';

export default function BookshelfLayout({ books, title = "Search Results" }: { books: any[], title?: string }) {
  const { favorites, toggleFavorite } = useBooksStore();

  if (!books || books.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No books found. Try searching for something else!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{title} ({books.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => {
          const info = book.volumeInfo;
          const isFav = favorites.some((fav) => fav.id === book.id);
          const thumbnail = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/128x192.png?text=No+Cover';
          
          return (
            <div key={book.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              
              {/* Cover Image */}
              <div className="relative w-full aspect-[2/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img src={thumbnail} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Favorite Button overlay */}
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(book); }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <svg className={`w-5 h-5 ${isFav ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>

              {/* Book Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  <a href={info.previewLink} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
                    {info.title}
                  </a>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                  {info.authors ? info.authors.join(', ') : 'Unknown Author'}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                  <span>{info.publishedDate ? info.publishedDate.substring(0, 4) : 'N/A'}</span>
                  <span>{info.pageCount ? `${info.pageCount}p` : ''}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
