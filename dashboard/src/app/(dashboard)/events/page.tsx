"use client"

import { useState } from "react"
import { mockEvents } from "@/lib/mock-data"
import { Calendar as CalendarIcon, MapPin, Users, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EventsPage() {
    const [view, setView] = useState<"list" | "calendar">("list")

    return (
        <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight grid grid-flow-col justify-start items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-primary" />
                        Manajemen Acara
                    </h1>
                    <p className="text-muted-foreground italic">Koordinasikan kumpul keluarga, pertemuan, dan acara untuk keluarga Bani Harun.</p>
                </div>
                <button className="grid grid-flow-col items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                    <Plus className="w-5 h-5" />
                    <span>Rencanakan Acara Baru</span>
                </button>
            </div>

            <div className="grid grid-flow-col items-center justify-between p-1 bg-muted rounded-xl w-fit">
                <button
                    onClick={() => setView("list")}
                    className={cn(
                        "px-6 py-2 text-sm font-bold rounded-lg transition-all",
                        view === "list" ? "bg-background shadow-sm" : "hover:text-foreground/80 text-muted-foreground"
                    )}
                >
                    Tampilan Daftar
                </button>
                <button
                    onClick={() => setView("calendar")}
                    className={cn(
                        "px-6 py-2 text-sm font-bold rounded-lg transition-all",
                        view === "calendar" ? "bg-background shadow-sm" : "hover:text-foreground/80 text-muted-foreground"
                    )}
                >
                    Kalender
                </button>
            </div>

            {view === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.map((event) => (
                        <div key={event.id} className="group p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all grid gap-4">
                            <div className="grid grid-cols-[auto_1fr] items-start justify-between">
                                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
                                    <CalendarIcon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                                </div>
                                <span className="justify-self-end px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mt-1">
                                    {event.type === "Gathering" ? "Kumpul" : event.type}
                                </span>
                            </div>

                            <div className="grid gap-1">
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{event.title}</h3>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t grid grid-cols-[1fr_auto] items-center text-muted-foreground">
                                <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 ">
                                    <Users className="w-4 h-4" />
                                    <span className="text-xs font-semibold">{event.attendees} Terdaftar</span>
                                </div>
                                <span className="text-xs font-bold text-foreground justify-self-end">{event.date}</span>
                            </div>

                            <button className="w-full py-2.5 border rounded-xl text-sm font-bold hover:bg-muted transition-colors">Kelola Acara</button>
                        </div>
                    ))}
                    <button className="group p-6 border-2 border-dashed rounded-2xl grid place-content-center justify-items-center gap-3 text-muted-foreground hover:border-primary/20 hover:text-primary transition-all">
                        <div className="w-12 h-12 rounded-full bg-muted/50 grid place-items-center group-hover:bg-primary/10">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold italic tracking-wide">Buat Postingan Acara</span>
                    </button>
                </div>
            ) : (
                <div className="p-8 bg-card border rounded-2xl shadow-sm grid justify-items-center text-center">
                    <div className="grid gap-6 w-full max-w-md">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center mb-8">
                            <button className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                            <h2 className="text-2xl font-bold justify-self-center">April 2024</h2>
                            <button className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronRight className="w-6 h-6" /></button>
                        </div>
                        {/* Simple Grid Placeholder for Calendar */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (
                                <div key={i} className="text-xs font-bold text-muted-foreground h-8 grid place-items-center uppercase tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const day = i + 1
                                const hasEvent = day === 5 || day === 15 || day === 20
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "aspect-square rounded-xl border grid place-items-center text-sm font-bold transition-all cursor-pointer relative",
                                            hasEvent ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" : "hover:bg-muted border-transparent"
                                        )}
                                    >
                                        {day}
                                        {hasEvent && <div className="absolute bottom-1.5 w-1 h-1 bg-current rounded-full justify-self-center" />}
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-sm text-muted-foreground italic justify-self-center">Pilih tanggal untuk melihat jadwal aktivitas keluarga.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
