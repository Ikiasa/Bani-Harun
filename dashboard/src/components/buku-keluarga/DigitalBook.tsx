"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { BookPageData } from '@/lib/family-book-data';
import { BookPage } from './BookPage';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface DigitalBookProps {
    pages: BookPageData[];
}

export function DigitalBook({ pages }: DigitalBookProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const step = isMobile ? 1 : 2;
    const maxIndex = isMobile ? pages.length - 1 : Math.ceil(pages.length / 2) * 2 - 2;

    const navNext = useCallback(() => {
        setCurrentIndex(prev => Math.min(prev + step, maxIndex));
    }, [step, maxIndex]);

    const navPrev = useCallback(() => {
        setCurrentIndex(prev => Math.max(prev - step, 0));
    }, [step]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') navNext();
            if (e.key === 'ArrowLeft') navPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navNext, navPrev]);

    const leftPageData = pages[currentIndex] || null;
    const rightPageData = !isMobile ? (pages[currentIndex + 1] || null) : null;

    return (
        <div className="w-full max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-2 md:p-6 animate-in fade-in duration-1000">

            {/* Book Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0ece1]/50 border border-[#e8e4d9] text-slate-600 text-xs font-bold tracking-widest uppercase mb-4">
                    <BookOpen className="w-4 h-4" /> Arsip Digital Keluarga
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-slate-800 tracking-tight">
                    Buku Keluarga
                </h1>
            </div>

            {/* Book Container */}
            <div className="relative w-full aspect-[3/4] md:aspect-[2/1.2] lg:aspect-[2/1.3] max-h-[92vh] perspective-[2000px]">
                {/* Book Shadow/Cover effect */}
                <div className="absolute inset-0 bg-black/5 rounded-2xl md:rounded-3xl blur-xl translate-y-4 md:translate-y-8 scale-[0.98]" />

                {/* Book Binding/Cover background */}
                <div className="absolute inset-0 bg-[#e8e4d9] rounded-2xl md:rounded-3xl p-1 md:p-2 flex shadow-2xl">
                    {/* Pages Wrapper */}
                    <div className="w-full h-full flex bg-[#fcfbfa] rounded-xl md:rounded-2xl overflow-hidden relative shadow-inner">

                        {/* Center Binding Line (Desktop only) */}
                        {!isMobile && (
                            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-black/10 to-transparent z-10" />
                        )}

                        {/* Page Content */}
                        <div className="w-full h-full flex transition-all duration-500 ease-in-out">
                            {/* Mobile View: Single Page */}
                            {isMobile ? (
                                <div className="w-full h-full shrink-0">
                                    <BookPage data={leftPageData} pageNumber={currentIndex + 1} />
                                </div>
                            ) : (
                                /* Desktop View: 2-Page Spread */
                                <>
                                    <div className="w-1/2 h-full shrink-0">
                                        <BookPage data={leftPageData} pageNumber={currentIndex + 1} isLeftPage />
                                    </div>
                                    <div className="w-1/2 h-full shrink-0">
                                        <BookPage data={rightPageData} pageNumber={currentIndex + 2} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Controls overlaying the book vertically centered */}
                <button
                    onClick={navPrev}
                    disabled={currentIndex === 0}
                    className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 p-3 rounded-full bg-white text-slate-600 shadow-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={navNext}
                    disabled={currentIndex >= maxIndex}
                    className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 p-3 rounded-full bg-white text-slate-600 shadow-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Pagination helper */}
            <div className="mt-8 text-slate-400 font-serif text-sm">
                Hal. {currentIndex + 1} {(!isMobile && rightPageData) ? `- ${currentIndex + 2}` : ''} dari {pages.length}
            </div>

        </div>
    );
}
