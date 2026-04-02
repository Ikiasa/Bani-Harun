"use client"

import React from "react"
import Link from "next/link"
import { Member } from "@/lib/mock-data"
import { Book, ChevronRight } from "lucide-react"

interface FamilyBookCardProps {
    member: Member
}

export function FamilyBookCard({ member }: FamilyBookCardProps) {
    return (
        <Link
            href={`/buku-keluarga/${member.id}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-primary/50"
        >
            {/* Background Image / Placeholder */}
            {member.avatar ? (
                <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                />
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <Book className="w-12 h-12 text-slate-700 mb-4" />
                </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-20">
                <span className="inline-block px-2 py-0.5 rounded bg-primary/20 backdrop-blur-md text-[10px] font-bold tracking-widest text-primary uppercase mb-2">
                    {member.role === 'Patriarch' || member.role === 'Matriarch' ? 'Generasi 1' : `Generasi ${member.generation}`}
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                </h3>
                <p className="text-xs text-white/60 font-medium">
                    {member.role}
                </p>

                <div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    BACA BIOGRAFI <ChevronRight className="w-3 h-3 ml-1" />
                </div>
            </div>

            {/* Book Spine Detail */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 backdrop-blur-sm"></div>
        </Link>
    )
}
