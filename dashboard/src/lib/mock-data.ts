export interface Member {
    id: string
    name: string
    role: string
    generation: number
    status: "Active" | "Inactive"
    avatar?: string
    lastActive: string
    parentId?: string
}

export interface FamilyEvent {
    id: string
    title: string
    date: string
    type: "Gathering" | "Meeting" | "Ceremony"
    location: string
    attendees: number
}

export interface FinancialStats {
    totalFunds: number
    monthlyContribution: number
    recentExpenses: number
    growth: number
}

export interface Opportunity {
    id: string
    title: string
    description: string
    status: "Open" | "Closed"
    category: string
}

export interface Program {
    id: string
    title: string
    date: string
    description: string
    instructor: string
}

export interface MemberSkill {
    id: string
    name: string
    avatar?: string
    skills: string[]
}

export interface Idea {
    id: string
    title: string
    description: string
    votes: number
    author: string
}

export let mockMembers: Member[] = [
    { id: "1", name: "Harun Al-Rashid", role: "Patriarch", generation: 1, status: "Active", lastActive: "2024-03-25" },
    { id: "2", name: "Siti Aminah", role: "Matriarch", generation: 1, status: "Active", lastActive: "2024-03-24" },
    { id: "3", name: "Ahmad Harun", role: "Branch Head", generation: 2, status: "Active", lastActive: "2024-03-26" },
    { id: "4", name: "Fathima Harun", role: "Secretary", generation: 2, status: "Active", lastActive: "2024-03-27" },
    { id: "5", name: "Yusuf Ahmad", role: "Member", generation: 3, status: "Active", lastActive: "2024-03-28" },
    { id: "6", name: "Zainab Ahmad", role: "Member", generation: 3, status: "Inactive", lastActive: "2023-12-15" },
]

export const mockEvents: FamilyEvent[] = [
    { id: "1", title: "Annual Family Gathering", date: "2024-04-15", type: "Gathering", location: "Surabaya", attendees: 120 },
    { id: "2", title: "Monthly Coordination Meeting", date: "2024-04-05", type: "Meeting", location: "Zoom", attendees: 15 },
    { id: "3", title: "Heritage Day Ceremony", date: "2024-05-20", type: "Ceremony", location: "Bangkalan", attendees: 200 },
]

export const mockFinancials: FinancialStats = {
    totalFunds: 150000000,
    monthlyContribution: 5000000,
    recentExpenses: 1200000,
    growth: 12.5
}

export const mockOpportunities: Opportunity[] = [
    { id: "1", title: "Business Partnership: Organic Farm", description: "Seeking family investment and management for a 2-hectare organic farm project in Bangkalan.", status: "Open", category: "Agriculture" },
    { id: "2", title: "Tech Startup: Family Archive App", description: "Looking for developers and historians to build a digital lineage tracking system.", status: "Open", category: "Technology" },
    { id: "3", title: "Handicraft Export", description: "Exporting local Bangkalan batik to international markets. Logistics partner needed.", status: "Closed", category: "Trade" },
]

export const mockPrograms: Program[] = [
    { id: "1", title: "Financial Literacy for Youth", date: "2024-04-10", description: "Basic investment and saving strategies for the 3rd and 4th generation.", instructor: "Ahmad Harun" },
    { id: "2", title: "Ancestral History Workshop", date: "2024-04-20", description: "Deep dive into the Bani Harun lineage and historical artifacts.", instructor: "Harun Al-Rashid" },
    { id: "3", title: "Public Speaking & Leadership", date: "2024-05-05", description: "Enhancing communication skills for potential family branch heads.", instructor: "Fathima Harun" },
]

export const mockMemberSkills: MemberSkill[] = [
    { id: "1", name: "Ahmad Harun", skills: ["Management", "Finance", "Public Speaking"] },
    { id: "2", name: "Fathima Harun", skills: ["Strategy", "Archive", "Education"] },
    { id: "3", name: "Yusuf Ahmad", skills: ["React", "TypeScript", "UI Design"] },
    { id: "4", name: "Zainab Ahmad", skills: ["Batik Art", "Curating", "Marketing"] },
]

export const mockIdeas: Idea[] = [
    { id: "1", title: "Family Scholarship Fund", description: "Establishing a fund specifically for higher education of younger members.", votes: 42, author: "Yusuf Ahmad" },
    { id: "2", title: "Annual Heritage Tour", description: "Organizing a tour to ancestral sites in Central Asia.", votes: 15, author: "Ahmad Harun" },
    { id: "3", title: "Bani Harun Digital Library", description: "Digitizing all physical records and letters into a member-only portal.", votes: 28, author: "Fathima Harun" },
]
