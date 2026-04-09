"use client"

import { Calendar, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface HaulEvent {
    id: string
    name: string
    deathDate: string
    daysAway: number
    isToday: boolean
}

interface HaulCalendarProps {
    members: any[]
}

export function HaulCalendar({ members }: HaulCalendarProps) {
    const calculateHaul = () => {
        const events: HaulEvent[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        members.forEach(member => {
            const bio = member.family_biographies?.[0]
            if (bio?.death_date) {
                const death = new Date(bio.death_date)
                const nextHaul = new Date(today.getFullYear(), death.getMonth(), death.getDate())

                if (nextHaul < today) {
                    nextHaul.setFullYear(today.getFullYear() + 1)
                }

                const diffTime = Math.abs(nextHaul.getTime() - today.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                events.push({
                    id: String(member.id),
                    name: member.name,
                    deathDate: bio.death_date,
                    daysAway: diffDays,
                    isToday: diffDays === 0 || diffDays === 365 || diffDays === 366
                })
            }
        })

        return events
            .sort((a, b) => a.daysAway - b.daysAway)
            .slice(0, 5)
    }

    const upcomingHauls = calculateHaul()

    return (
        <div className="rounded-xl shadow-premium border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 overflow-hidden">
            <div className="p-4 pb-3 border-b border-slate-100/50 flex items-center justify-between">
                <div className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    Peringatan Haul Keluarga
                </div>
                <Heart className="w-4 h-4 text-destructive/40 animate-pulse" />
            </div>
            <div className="p-4 pt-4">
                <div className="space-y-4">
                    {upcomingHauls.length > 0 ? (
                        upcomingHauls.map((event) => (
                            <div key={event.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                                        event.isToday
                                            ? "bg-destructive/10 text-destructive border-destructive/20 scale-110 shadow-lg"
                                            : "bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20"
                                    )}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="text-xs font-bold leading-none">{event.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                                            {new Date(event.deathDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                    event.isToday
                                        ? "bg-destructive text-white animate-bounce"
                                        : "bg-primary/10 text-primary"
                                )}>
                                    {event.isToday ? "HARI INI" : `${event.daysAway} Hari Lagi`}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <p className="text-xs italic">Belum ada data haul mendatang.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

