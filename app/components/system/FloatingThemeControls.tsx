"use client";

import { useState, useRef, useEffect } from 'react';
import { ThemeControls } from './ThemeControls';

// กำหนด Props ให้รับฟังก์ชันมาจากไฟล์แม่
type FloatingThemeControlsProps = {
    isDark: boolean;
    toggleDark: () => void;
    openCommandPalette: () => void;
    undoLastAction: () => void;
    isAdmin: boolean;
    toggleRole: () => void;
    startTour: () => void;
    isAuthenticated: boolean;
    userDisplayName: string | null;
    onSignIn: () => void;
    onSignOut: () => void;
};

export function FloatingThemeControls(props: FloatingThemeControlsProps) {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const paletteRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // ดักจับการคลิกพื้นที่ว่างเพื่อปิดเมนู
    useEffect(() => {
        if (!isPaletteOpen) return;
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            const isClickedInside = paletteRef.current?.contains(target) || buttonRef.current?.contains(target);
            if (!isClickedInside) {
                setIsPaletteOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPaletteOpen]);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-2">
            <button
                ref={buttonRef}
                aria-expanded={isPaletteOpen}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsPaletteOpen((p) => !p);
                }}
                className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 transform transition-all duration-300 hover:scale-105 bg-linear-to-br from-white to-gray-100 dark:from-gray-800 dark:to-black z-50"
            >
                {!isPaletteOpen && <span className="absolute inset-0 rounded-full bg-blue-400/10 animate-pulse" aria-hidden />}
                <svg className={`w-7 h-7 text-gray-700 dark:text-gray-200 transform transition-transform duration-300 ${isPaletteOpen ? 'rotate-45' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div
                ref={paletteRef}
                className={`origin-bottom-right transform transition-all duration-300 z-40 ${isPaletteOpen ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'}`}
            >
                {/* ส่ง Props ทั้งหมดต่อไปยัง ThemeControls เดิมของคุณ */}
                <ThemeControls {...props} />
            </div>
        </div>
    );
}