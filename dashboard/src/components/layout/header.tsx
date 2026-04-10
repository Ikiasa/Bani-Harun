"use client"

import { Menu, Moon, Sun, Bell, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])

    return (
        <header className="sticky top-0 z-30 grid grid-cols-[auto_1fr_auto] items-center h-14 px-4 lg:px-6 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 gap-4">
            <div className="grid items-center min-w-[2rem]">
                <button
                    onClick={onMenuClick}
                    className="p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-md lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="grid justify-items-start w-full">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                        type="search"
                        placeholder="Cari data keluarga..."
                        className="w-full h-9 pl-9 pr-4 text-sm bg-muted/20 border-border hover:bg-muted/40 focus:bg-background border focus:border-primary/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                    />
                </div>
            </div>

            <div className="grid grid-flow-col items-center justify-end gap-1">
                <button
                    className="relative p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-md"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive border-2 border-background rounded-full" />
                </button>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-md"
                >
                    {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                    {!mounted && <div className="w-5 h-5" />}
                </button>

                {mounted && <UserNav />}
            </div>
        </header>
    )
}

function UserNav() {
    const [user, setUser] = useState<{ name: string } | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: sbUser } } = await supabase.auth.getUser()
            if (sbUser) {
                setUser({ name: sbUser.user_metadata?.name || "User" })
            }
        }
        fetchUser()
    }, [])

    return (
        <div className="hidden sm:grid grid-cols-[auto_auto] items-center gap-3 pl-3 ml-2 border-l animate-in fade-in duration-500">
            <div className="grid justify-items-end">
                <p className="text-sm font-bold tracking-tight leading-none">{user?.name || "Bani Harun"}</p>
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 grid place-items-center text-primary text-[10px] font-black border border-primary/20 shadow-sm">
                {user?.name?.[0].toUpperCase() || "BH"}
            </div>
        </div>
    )
}
