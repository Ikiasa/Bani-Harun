"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
    Search,
    Plus,
    Filter,
    Edit2,
    UserPlus,
    Mail,
    Phone,
    ShieldCheck,
    Loader2
} from "lucide-react"

export default function MemberManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const getAuthToken = () => {
        const match = document.cookie.match(new RegExp('(^| )bh-auth-token=([^;]+)'))
        return match ? match[2] : null
    }

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const token = getAuthToken()

        fetch(`${baseUrl}/api/buku-keluarga`, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        })
            .then(res => res.json())
            .then(data => {
                setMembers(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="grid gap-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Anggota</h1>
                    <p className="text-muted-foreground italic">Tambah, edit, atau kelola anggota keluarga Bani Harun.</p>
                </div>
                <button className="grid grid-flow-col items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                    <UserPlus className="w-5 h-5" />
                    <span>Tambah Anggota</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                <div className="relative group min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari anggota berdasarkan nama atau peran..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
                <button className="grid grid-flow-col items-center justify-center gap-2 px-4 h-11 border rounded-xl hover:bg-muted transition-colors font-medium">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Members Table/Grid */}
            <div className="overflow-hidden border rounded-2xl bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Anggota</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Peran/Generasi</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Aktivitas Terakhir</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y relative">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/40" />
                                    </td>
                                </tr>
                            )}
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="grid min-w-0">
                                                <span className="text-sm font-semibold">{member.name}</span>
                                                <span className="text-xs text-muted-foreground">member-{member.id}@baniharun.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="grid gap-1">
                                            <div className="grid grid-flow-col justify-start items-center gap-1.5 ">
                                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-sm font-medium">{member.role === "Member" ? "Anggota" : member.role}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground italic">Gen {member.generation}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                            member.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        )}>
                                            {member.status === "Active" ? "Aktif" : "Tidak Aktif"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                        {member.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={`http://127.0.0.1:8000/admin/family-members/${member.id}/edit`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 p-2 px-3 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredMembers.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground font-medium italic">
                        Tidak ada anggota keluarga yang cocok dengan pencarian Anda.
                    </div>
                )}
            </div>
        </div>
    )
}
