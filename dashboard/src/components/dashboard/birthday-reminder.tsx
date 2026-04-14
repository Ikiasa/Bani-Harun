"use client"

import { Calendar, Cake, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BirthdayEvent {
    id: string
    name: string
    birthDate: string
    daysAway: number
    isToday: boolean
}

interface BirthdayReminderProps {
    members: any[]
}

export function BirthdayReminder({ members }: BirthdayReminderProps) {
    const calculateBirthdays = () => {
        const events: BirthdayEvent[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        members.forEach(member => {
            const bio = member.family_biographies?.[0]
            if (bio?.birth_date) {
                const bday = new Date(bio.birth_date)
                const nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())

                if (nextBday < today) {
                    nextBday.setFullYear(today.getFullYear() + 1)
                }

                const diffTime = Math.abs(nextBday.getTime() - today.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                // Adjust for leap years/today check
                const isToday = diffDays === 0 || diffDays === 365 || diffDays === 366

                events.push({
                    id: String(member.id),
                    name: member.name,
                    birthDate: bio.birth_date,
                    daysAway: diffDays,
                    isToday: isToday
                })
            }
        })

        return events
            .sort((a, b) => a.daysAway - b.daysAway)
            .slice(0, 5)
    }

    const upcomingBirthdays = calculateBirthdays()

    return (
        <div className="rounded-xl shadow-premium border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 overflow-hidden h-full">
            <div className="p-4 pb-3 border-b border-slate-100/50 flex items-center justify-between">
                <div className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Cake className="w-4 h-4" />
                    Ulang Tahun Mendatang
                </div>
                <Cake className="w-4 h-4 text-primary/40 animate-bounce" />
            </div>
            <div className="p-4 pt-4">
                <div className="space-y-4">
                    {upcomingBirthdays.length > 0 ? (
                        upcomingBirthdays.map((event) => (
                            <div key={event.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                                        event.isToday
                                            ? "bg-primary/10 text-primary border-primary/20 scale-110 shadow-lg"
                                            : "bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20"
                                    )}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="text-xs font-bold leading-none">{event.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                                            {new Date(event.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                    event.isToday
                                        ? "bg-primary text-white animate-pulse"
                                        : "bg-primary/10 text-primary"
                                )}>
                                    {event.isToday ? "HARI INI" : `${event.daysAway} Hari Lagi`}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <p className="text-xs italic">Belum ada data ulang tahun.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
