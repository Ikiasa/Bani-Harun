"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Lightbulb,
    Rocket,
    GraduationCap,
    Users,
    Search,
    Plus
} from "lucide-react"

import { OpportunityCard } from "@/components/pemberdayaan/opportunity-card"
import { ProgramCard } from "@/components/pemberdayaan/program-card"
import { SkillCard } from "@/components/pemberdayaan/skill-card"
import { IdeaCard } from "@/components/pemberdayaan/idea-card"
import { mockMemberSkills } from "@/lib/mock-data"

const tabs = [
    { id: "peluang", label: "Peluang", icon: Rocket },
    { id: "pelatihan", label: "Pelatihan", icon: GraduationCap },
    { id: "skill", label: "Skill Anggota", icon: Users },
    { id: "ide", label: "Ide & Inisiatif", icon: Lightbulb },
]

interface EmpowermentClientProps {
    opportunities: any[]
    programs: any[]
    ideas: any[]
}

export function EmpowermentClient({ opportunities, programs, ideas }: EmpowermentClientProps) {
    const [activeTab, setActiveTab] = useState("peluang")
    const [skillSearch, setSkillSearch] = useState("")

    const filteredSkills = mockMemberSkills.filter(m =>
        m.skills.some(s => s.toLowerCase().includes(skillSearch.toLowerCase())) ||
        m.name.toLowerCase().includes(skillSearch.toLowerCase())
    )

    return (
        <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-black tracking-tight grid grid-flow-col justify-start items-center gap-3">
                        <Rocket className="w-8 h-8 text-primary" />
                        Pemberdayaan
                    </h1>
                    <p className="text-muted-foreground italic font-medium">Memberdayakan warisan Bani Harun melalui peluang dan keahlian.</p>
                </div>

                {activeTab === "peluang" && (
                    <button className="grid grid-flow-col items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 whitespace-nowrap">
                        <Plus className="w-5 h-5" />
                        <span>Tambah Peluang</span>
                    </button>
                )}
            </div>

            <div className="grid grid-flow-col justify-start items-center gap-2 p-1.5 bg-muted/50 border rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "grid grid-flow-col items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeTab === tab.id
                                ? "bg-background text-primary shadow-sm border border-muted"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 transition-all duration-300">
                {activeTab === "peluang" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95">
                        {opportunities.map(opp => (
                            <OpportunityCard key={opp.id} opportunity={opp} />
                        ))}
                    </div>
                )}

                {activeTab === "pelatihan" && (
                    <div className="max-w-4xl grid gap-6 animate-in slide-in-from-right-4">
                        {programs.map(program => (
                            <ProgramCard key={program.id} program={program} />
                        ))}
                    </div>
                )}

                {activeTab === "skill" && (
                    <div className="grid gap-6 animate-in fade-in">
                        <div className="relative max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan skill (misal: React, Batik)..."
                                value={skillSearch}
                                onChange={(e) => setSkillSearch(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredSkills.map(member => (
                                <SkillCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "ide" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                        {ideas.map(idea => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                        <button className="p-6 border-2 border-dashed rounded-2xl grid place-content-center justify-items-center gap-3 text-muted-foreground hover:border-primary/20 hover:text-primary transition-all bg-muted/10 group">
                            <div className="w-12 h-12 rounded-full bg-muted grid place-items-center group-hover:bg-primary/10">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold italic tracking-wide">Ajukan Ide Baru</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
