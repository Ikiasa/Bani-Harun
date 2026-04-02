"use client"

import React from "react"
import { Biography } from "@/lib/family-book-data"
import { Image as ImageIcon } from "lucide-react"

interface GalleryGridProps {
    biography: Biography
}

export function GalleryGrid({ biography }: GalleryGridProps) {
    if (!biography.gallery || biography.gallery.length === 0) return null

    return (
        <section className="max-w-6xl mx-auto py-20 px-6 space-y-10">
            <div className="flex items-center gap-4 text-slate-400">
                <ImageIcon className="w-5 h-5" />
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Galeri Kenangan</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {biography.gallery.map((url, idx) => (
                    <div
                        key={idx}
                        className={`relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${idx === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-square'
                            }`}
                    >
                        <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white/80 text-xs font-medium tracking-wide">Momen Bersejarah #{idx + 1}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
