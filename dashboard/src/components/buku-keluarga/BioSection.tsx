"use client"

import React from "react"
import { Biography } from "@/lib/family-book-data"
import { ScrollText, Quote } from "lucide-react"

interface BioSectionProps {
    biography: Biography
}

export function BioSection({ biography }: BioSectionProps) {
    return (
        <section className="max-w-4xl mx-auto py-16 px-6 space-y-12">
            <div className="flex items-center gap-4 text-slate-400">
                <ScrollText className="w-5 h-5" />
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Narasi Biografi</span>
            </div>

            <div className="relative">
                <Quote className="absolute -left-10 -top-4 w-12 h-12 text-slate-100 dark:text-slate-800 fill-current -z-10" />
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-2xl md:text-3xl font-serif leading-relaxed text-slate-800 dark:text-slate-200">
                        {biography.bio}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                <div className="space-y-6">
                    <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Pencapaian</h3>
                    <ul className="space-y-4">
                        {biography.achievements.map((item, idx) => (
                            <li key={idx} className="flex gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 px-8 py-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 rotate-1 shadow-sm">
                    <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase mb-8">Data Keluarga</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pasangan</p>
                                <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">{biography.partner || "-"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Lahir</p>
                                <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">{biography.birthDate}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Anak-anak</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {biography.children.map((child, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                                        {child}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
