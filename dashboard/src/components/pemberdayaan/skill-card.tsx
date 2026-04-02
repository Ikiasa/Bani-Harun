import { MemberSkill } from "@/lib/mock-data"
import { User, BadgeCheck } from "lucide-react"

export function SkillCard({ member }: { member: MemberSkill }) {
    return (
        <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all group grid justify-items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/5 grid place-items-center text-primary border-2 border-primary/10 group-hover:border-primary/30 transition-all">
                <User className="w-10 h-10" />
            </div>
            <div className="grid gap-1">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Anggota Keluarga</p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] justify-center gap-2 pt-2">
                {member.skills.map((skill, idx) => (
                    <span key={idx} className="grid grid-flow-col items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-lg border border-muted group-hover:bg-muted transition-colors">
                        <BadgeCheck className="w-3 h-3 text-primary" />
                        {skill}
                    </span>
                ))}
            </div>

            <button className="w-full py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors mt-auto opacity-0 group-hover:opacity-100 duration-300">Lihat Portofolio</button>
        </div>
    )
}
