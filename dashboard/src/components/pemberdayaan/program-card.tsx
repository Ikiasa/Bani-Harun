import { Program } from "@/lib/mock-data"
import { Calendar, User, Clock } from "lucide-react"

export function ProgramCard({ program }: { program: Program }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:border-primary/20 transition-all group">
            <div className="w-full md:w-32 h-32 bg-muted rounded-xl grid place-content-center justify-items-center text-center p-2 group-hover:bg-primary/5 transition-colors">
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-black tracking-tighter leading-none">{program.date.split('-')[2]}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{new Date(program.date).toLocaleString('id-ID', { month: 'short' })}</span>
            </div>

            <div className="grid gap-3">
                <div className="grid gap-1">
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors leading-tight">{program.title}</h3>
                    <div className="grid grid-flow-col justify-start items-center gap-4 text-xs font-semibold text-muted-foreground italic">
                        <div className="grid grid-flow-col items-center gap-1.5"><User className="w-3.5 h-3.5" /> <span>{program.instructor}</span></div>
                        <div className="grid grid-flow-col items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> <span>10:00 AM - 12:00 PM</span></div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
                <div className="pt-2">
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-lg hover:bg-muted transition-colors border">Ikuti Program</button>
                </div>
            </div>
        </div>
    )
}
