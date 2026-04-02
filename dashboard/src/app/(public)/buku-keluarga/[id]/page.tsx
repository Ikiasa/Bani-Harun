"use client"

import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { mockMembers } from "@/lib/mock-data"
import { familyBiographies } from "@/lib/family-book-data"
import { ProfileHeader } from "@/components/buku-keluarga/ProfileHeader"
import { BioSection } from "@/components/buku-keluarga/BioSection"
import { GalleryGrid } from "@/components/buku-keluarga/GalleryGrid"
import { Timeline } from "@/components/buku-keluarga/Timeline"
import { ChevronLeft, ArrowLeftCircle } from "lucide-react"

export default function MemberProfilePage() {
    const { id } = useParams()
    const router = useRouter()

    const member = mockMembers.find(m => m.id === id)
    const biography = familyBiographies[id as string]

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <p className="text-slate-400 font-serif italic text-2xl">Maaf, halaman tidak ditemukan...</p>
                <button onClick={() => router.back()} className="text-primary font-bold flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-slate-950 pb-32 animate-in fade-in duration-1000">
            {/* Top Navigation */}
            <nav className="fixed top-6 left-6 z-50">
                <Link
                    href="/buku-keluarga"
                    className="flex items-center gap-3 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all text-slate-500 hover:text-primary"
                >
                    <ArrowLeftCircle className="w-8 h-8" />
                    <span className="text-sm font-black tracking-widest hidden md:inline">KEMBALI KE KATALOG</span>
                </Link>
            </nav>

            <article>
                <ProfileHeader member={member} />

                {biography ? (
                    <>
                        <BioSection biography={biography} />
                        <GalleryGrid biography={biography} />
                        <Timeline biography={biography} />
                    </>
                ) : (
                    <section className="max-w-4xl mx-auto py-20 px-6 text-center space-y-6">
                        <div className="h-px w-20 bg-slate-200 mx-auto"></div>
                        <p className="text-slate-400 font-serif italic text-xl">
                            Narasi biografi untuk {member.name} sedang dalam proses penyusunan...
                        </p>
                    </section>
                )}
            </article>

            {/* Footer Book Note */}
            <footer className="mt-20 flex flex-col items-center justify-center space-y-4 opacity-30">
                <div className="w-16 h-px bg-slate-400"></div>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">
                    Buku Silsilah Bani Harun
                </p>
                <div className="text-[10px] font-serif italic">Halaman Akhir Biografi</div>
            </footer>
        </main>
    )
}
