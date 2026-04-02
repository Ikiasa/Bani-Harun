import React from "react"
import Link from "next/link"
import { BookOpen, Edit, CheckCircle2, Circle } from "lucide-react"

async function fetchMembers() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/buku-keluarga`, { cache: "no-store", next: { revalidate: 0 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Failed to fetch API", e);
        return [];
    }
}

export default async function AdminBukuKeluargaPage() {
    const members = await fetchMembers();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-20">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }} />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-primary" />
                        Posting Buku Keluarga
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Kelola narasi, riwayat, dan biografi anggota keluarga untuk ditampilkan di buku digital publik.
                    </p>
                </div>
                <Link
                    href="/buku-keluarga"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 h-10 px-6 active:scale-95"
                >
                    Lihat Buku Publik
                </Link>
            </div>

            <div className="relative z-10">
                <div className="grid grid-cols-1 gap-4 overflow-hidden">
                    <div className="overflow-x-auto rounded-2xl border bg-card/60 backdrop-blur-md shadow-xl shadow-foreground/5">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-muted/30 border-b">
                                <tr>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Identitas Anggota</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Silsilah / Peran</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 text-center">Status Narasi</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            Tidak ada data anggota keluarga.
                                        </td>
                                    </tr>
                                ) : members.map((member: any) => {
                                    const hasBio = member.biography && member.biography.bio && member.biography.bio.length > 0;

                                    return (
                                        <tr key={member.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border">
                                                        {member.photo ? (
                                                            <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/storage/${member.photo}`} alt={member.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="font-semibold text-primary">{member.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div className="font-medium text-card-foreground">
                                                        {member.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                Gen {member.generation} • {member.role}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {hasBio ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Ditulis
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                        <Circle className="w-3.5 h-3.5" /> Kosong
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/admin/family-biographies/${member.id}/edit`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-x-1 active:scale-95"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit Konten
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
