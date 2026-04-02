"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface DashboardShellProps {
    children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="grid h-screen bg-background text-foreground overflow-hidden lg:grid-cols-[auto_1fr] selection:bg-primary/20">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="grid grid-rows-[auto_1fr] min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
                    <div className="grid gap-8 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div >
    )
}
