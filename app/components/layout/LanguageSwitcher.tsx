"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPath = (lang: string) => {
    if (!pathname) return `/${lang}/`;
    
    const segments = pathname.split('/');
    // Check if the path already starts with a language code
    if (segments[1] === 'en' || segments[1] === 'th') {
      segments[1] = lang;
      return segments.join('/') || '/';
    }
    
    // Otherwise prepend the language code
    return `/${lang}${pathname === '/' ? '' : pathname}`;
  };

  const currentLang = pathname?.startsWith('/th') ? 'th' : 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentLang.toUpperCase()}
        <svg 
          className={`w-4 h-4 ml-1.5 -mr-1 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-24 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <Link 
              href={getPath('en')}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors ${
                currentLang === 'en' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              EN
            </Link>
            <Link 
              href={getPath('th')}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors ${
                currentLang === 'th' 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              TH
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
