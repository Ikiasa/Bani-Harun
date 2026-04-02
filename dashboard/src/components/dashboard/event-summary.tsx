import { Calendar, MapPin, Users as UsersIcon } from "lucide-react"

interface Event {
    id: string | number
    title: string
    type: string
    date: string
    location: string
    attendees: number
}

export function EventSummary({ events = [] }: { events?: Event[] }) {
    const upcomingEvents = events.slice(0, 3)

    return (
        <div className="p-6 bg-card border rounded-xl shadow-sm grid gap-6">
            <div className="grid grid-cols-[1fr_auto] items-center">
                <h3 className="font-semibold text-lg">Acara Mendatang</h3>
                <button className="text-xs font-medium text-primary hover:underline underline-offset-4 tracking-tight">Lihat Kalender</button>
            </div>

            <div className="grid gap-4">
                {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg hover:border-primary/20 hover:bg-muted/50 transition-all group">
                        <div className="grid gap-3">
                            <div className="grid grid-cols-[1fr_auto] items-center">
                                <span className="text-sm font-semibold group-hover:text-primary transition-colors">{event.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">{event.type === "Gathering" ? "Kumpul" : event.type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 text-xs text-muted-foreground">
                                    <UsersIcon className="w-3.5 h-3.5" />
                                    <span>{event.attendees} Hadir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
