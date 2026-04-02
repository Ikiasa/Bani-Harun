"use client"

import React from "react"
import { Member } from "@/lib/mock-data"
import { BookOpen } from "lucide-react"

interface ProfileHeaderProps {
    member: Member
}

export function ProfileHeader({ member }: ProfileHeaderProps) {
    return (
        <section className="relative w-full py-20 px-4 flex flex-col items-center text-center space-y-8">
            <div className="relative group">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {/* Photo */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                    {member.avatar ? (
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-slate-300" />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-w-3xl">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
                    {member.role === 'Patriarch' || member.role === 'Matriarch' ? 'The Root Ancestor' : `Keturunan Generasi ${member.generation}`}
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    {member.name}
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 font-serif italic italic font-medium leading-relaxed">
                    "{member.role} Keluarga Bani Harun."
                </p>
            </div>
        </section>
    )
}
