import { Opportunity } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Briefcase } from "lucide-react"

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    return (
        <div className={cn(
            "p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 overflow-hidden relative grid gap-4",
            opportunity.status === "Open" ? "border-l-primary" : "border-l-muted"
        )}>
            <div className="grid grid-cols-[auto_1fr] items-start justify-between">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Briefcase className="w-5 h-5" />
                </div>
                <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest justify-self-end",
                    opportunity.status === "Open" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                )}>
                    {opportunity.status === "Open" ? "Terbuka" : "Ditutup"}
                </span>
            </div>
            <div className="grid gap-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{opportunity.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{opportunity.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-[1fr_auto] items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{opportunity.category}</span>
                <button className="text-xs font-bold text-primary hover:underline underline-offset-4 tracking-tight">Pelajari Lebih Lanjut</button>
            </div>
        </div >
    )
}
