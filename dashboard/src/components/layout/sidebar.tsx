"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    TreePine,
    CalendarDays,
    Wallet,
    Settings,
    Rocket,
    BookOpen,
    ExternalLink,
    X,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { API_BASE_URL, getAuthToken } from "@/lib/api-config"

const groups = [
    {
        name: "Utama",
        items: [
            { name: "Beranda", href: "/", icon: LayoutDashboard },
            { name: "Silsilah Keluarga", href: "/tree", icon: TreePine },
            { name: "Anggota Keluarga", href: "/members", icon: Users },
        ]
    },
    {
        name: "Koleksi",
        items: [
            { name: "Buku Keluarga", href: "/admin/buku-keluarga", icon: BookOpen },
            { name: "Acara Keluarga", href: "/events", icon: CalendarDays },
        ]
    },
    {
        name: "Sistem",
        items: [
            { name: "Keuangan", href: "/financials", icon: Wallet },
            { name: "Pemberdayaan", href: "/pemberdayaan", icon: Rocket },
            { name: "Pengaturan", href: "/settings", icon: Settings },
        ]
    },
    {
        name: "Umum",
        items: [
            { name: "Situs Publik", href: "/buku-keluarga", icon: ExternalLink },
        ]
    }
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("bh-user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user", e)
            }
        }
    }, [])

    const handleLogout = async () => {
        // Clear cookie
        document.cookie = "bh-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        // Clear localStorage
        localStorage.removeItem("bh-user")

        // Call backend logout (optional, fire and forget)
        const token = getAuthToken()
        if (token) {
            fetch(`${API_BASE_URL}/api/logout`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            }).catch(() => { })
        }

        router.push("/login")
        router.refresh()
    }

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-xl border-r transition-transform lg:static lg:translate-x-0 shadow-xl lg:shadow-none",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                    <div className="grid grid-cols-[auto_auto] items-center justify-between h-14 px-6 border-b bg-background/50 backdrop-blur-md">
                        <Link href="/" className="grid grid-flow-col items-center gap-2 font-black text-foreground hover:opacity-80 transition-opacity">
                            <div className="w-6 h-6 bg-primary rounded bg-gradient-to-br from-primary to-primary/80 grid place-items-center shadow-lg shadow-primary/20">
                                <span className="text-primary-foreground text-[10px] leading-none font-black">BH</span>
                            </div>
                            <span className="tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Bani Harun</span>
                        </Link>
                        <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="grid gap-6 px-4 py-8 overflow-y-auto content-start">
                        {groups.map((group) => (
                            <div key={group.name} className="grid gap-2">
                                <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{group.name}</h3>
                                <div className="grid gap-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "grid grid-cols-[auto_1fr] items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-sm group/item",
                                                    isActive
                                                        ? item.name === "Pemberdayaan"
                                                            ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30"
                                                            : "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                                        : item.name === "Pemberdayaan"
                                                            ? "text-muted-foreground hover:bg-orange-500/10 hover:text-orange-600"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                                onClick={() => {
                                                    if (window.innerWidth < 1024) onClose()
                                                }}
                                            >
                                                <item.icon className={cn(
                                                    "w-4 h-4 transition-transform group-hover/item:scale-110 duration-300",
                                                    isActive
                                                        ? (item.name === "Pemberdayaan" ? "text-white" : "text-primary-foreground")
                                                        : (item.name === "Pemberdayaan" ? "text-orange-500/70 group-hover/item:text-orange-600" : "text-primary/80 group-hover/item:text-primary")
                                                )} />
                                                <span className="tracking-wide">{item.name}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-primary/10 grid gap-3">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="w-9 h-9 rounded-full bg-primary/20 grid place-items-center font-bold text-primary text-sm shadow-sm">
                                {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                            </div>
                            <div className="grid grid-rows-2">
                                <span className="text-sm font-bold text-foreground/90 truncate">{user?.name || "Admin Pengguna"}</span>
                                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">Kepala Keluarga</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all group/logout"
                        >
                            <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-1" />
                            <span>Keluar Sistem</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
