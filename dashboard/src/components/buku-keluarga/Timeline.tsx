"use client"

import React from "react"
import { Biography } from "@/lib/family-book-data"
import { History } from "lucide-react"

interface TimelineProps {
    biography: Biography
}

export function Timeline({ biography }: TimelineProps) {
    if (!biography.timeline || biography.timeline.length === 0) return null

    return (
        <section className="max-w-4xl mx-auto py-20 px-6 space-y-12">
            <div className="flex items-center gap-4 text-slate-400">
                <History className="w-5 h-5" />
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Garis Waktu Perjalanan</span>
            </div>

            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary before:to-primary/20">
                {biography.timeline.map((item, idx) => (
                    <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-8 px-4`}>
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-primary shadow-xl z-10 absolute left-0 md:left-1/2 md:-translate-x-1/2 group-hover:scale-125 transition-transform">
                        </div>

                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 md:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                            <time className="block mb-2 text-xs font-black tracking-widest text-primary uppercase">
                                {item.date}
                            </time>
                            <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-200">
                                {item.event}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
