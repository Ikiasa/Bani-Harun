import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface Member {
    id: string
    name: string
    role: string
    status: string
    lastActive?: string
}

export function RecentMembers({ members = [] }: { members?: Member[] }) {
    const recentMembers = members.slice(0, 5)

    return (
        <div className="p-6 bg-card border rounded-xl shadow-sm grid gap-6">
            <div className="grid grid-cols-[1fr_auto] items-center">
                <h3 className="font-semibold text-lg">Anggota Terbaru</h3>
                <button className="text-xs font-medium text-primary hover:underline underline-offset-4 tracking-tight">Lihat Semua</button>
            </div>

            <div className="grid gap-4">
                {recentMembers.map((member) => (
                    <div key={member.id} className="grid grid-cols-[1fr_auto] items-center group">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted grid place-items-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="grid min-w-0">
                                <span className="text-sm font-medium truncate">{member.name}</span>
                                <span className="text-xs text-muted-foreground">{member.role === "Member" ? "Anggota" : member.role}</span>
                            </div>
                        </div>
                        <div className="grid justify-items-end gap-1">
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                member.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                                {member.status === "Active" ? "Aktif" : "Tidak Aktif"}
                            </span>
                            <span className="text-[10px] text-muted-foreground italic">Terakhir aktif {member.lastActive}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
