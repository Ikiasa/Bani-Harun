import React from "react"
import { DigitalBook } from "@/components/buku-keluarga/DigitalBook"
import { BookPageData } from "@/lib/family-book-data"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-dynamic';

async function fetchPages(): Promise<BookPageData[]> {
    try {
        const { data, error } = await supabase
            .from('family_members')
            .select('*, family_biographies(*)');

        if (error) throw error;

        // 1. Map data into a usable format
        const membersMap = data.map((item: any) => {
            const bio = item.family_biographies && item.family_biographies[0];
            return {
                id: String(item.id),
                parentId: item.parent_id ? String(item.parent_id) : undefined,
                name: item.name,
                role: item.role,
                generation: item.generation,
                status: item.status,
                avatar: item.avatar,
                lastActive: item.last_active,
                bioDetails: bio ? {
                    memberId: String(item.id),
                    birthDate: bio.birth_date,
                    birthPlace: bio.birth_place,
                    deathDate: bio.death_date,
                    partner: bio.partner_name,
                    headOfFamily: bio.head_of_family,
                    children: [],
                    bio: bio.bio,
                    achievements: bio.achievements?.map((a: any) => a.title || a) || [],
                    gallery: bio.gallery || [],
                    timeline: bio.timeline || []
                } : null
            };
        });

        // 2. Build Hierarchy and Sort (DFS)
        const sortedList: BookPageData[] = [];
        const childrenMap: Record<string, any[]> = {};

        membersMap.forEach(m => {
            const pId = m.parentId || "root";
            if (!childrenMap[pId]) childrenMap[pId] = [];
            childrenMap[pId].push(m);
        });

        // Sort children by ID (assuming ID reflects birth order or insertion order)
        Object.values(childrenMap).forEach(list => {
            list.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        });

        const traverse = (parentId: string) => {
            const children = childrenMap[parentId] || [];
            children.forEach(child => {
                sortedList.push(child);
                traverse(child.id);
            });
        };

        traverse("root");

        // If for some reason traverse didn't catch everyone (unlikely), add orphans
        if (sortedList.length < membersMap.length) {
            const addedIds = new Set(sortedList.map(s => s.id));
            membersMap.forEach(m => {
                if (!addedIds.has(m.id)) sortedList.push(m);
            });
        }

        return sortedList;
    } catch (e) {
        console.error("Failed to fetch family book data", e);
        return [];
    }
}

export default async function BukuKeluargaPage() {
    const pages = await fetchPages();

    return (
        <div className="min-h-screen bg-[#fcfbfa]/50 dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative z-10 h-full flex items-center pt-8">
                <DigitalBook pages={pages} />
            </div>
        </div>
    )
}
