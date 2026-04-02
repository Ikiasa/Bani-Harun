import { Idea } from "@/lib/mock-data"
import { MessageSquare, ThumbsUp, User } from "lucide-react"

export function IdeaCard({ idea }: { idea: Idea }) {
    return (
        <div className="p-6 bg-card border rounded-2xl shadow-sm hover:border-primary/20 transition-all group grid gap-4">
            <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted grid place-items-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <User className="w-4 h-4" />
                </div>
                <div className="grid">
                    <span className="text-xs font-bold">{idea.author}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold italic">Kontributor Ide</span>
                </div>
            </div>

            <div className="grid gap-2">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{idea.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-3">{idea.description}</p>
            </div>

            <div className="mt-2 pt-4 border-t grid grid-cols-[1fr_auto] items-center">
                <div className="grid grid-flow-col justify-start items-center gap-4">
                    <div className="grid grid-flow-col items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-y-[-1px] transition-transform cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5 fill-primary/10" />
                        <span>{idea.votes}</span>
                    </div>
                    <div className="grid grid-flow-col items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>8 Komentar</span>
                    </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Beri Suara</button>
            </div>
        </div>
    )
}
