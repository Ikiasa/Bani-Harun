import React from "react"
import { DigitalBook } from "@/components/buku-keluarga/DigitalBook"
import { BookPageData } from "@/lib/family-book-data"
import { API_BASE_URL } from "@/lib/api-config"

async function fetchPages(): Promise<BookPageData[]> {
    try {
        const baseUrl = API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/buku-keluarga`, { cache: "no-store", next: { revalidate: 0 } });
        if (!res.ok) return [];
        const data = await res.json();

        return data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            role: item.role,
            generation: item.generation,
            status: item.status,
            avatar: item.photo ? `${baseUrl}/storage/${item.photo}` : undefined,
            lastActive: item.last_active,
            bioDetails: item.biography ? {
                memberId: String(item.id),
                birthDate: item.biography.birth_date,
                birthPlace: item.biography.birth_place,
                partner: item.biography.partner_name,
                headOfFamily: item.biography.head_of_family,
                children: [],
                bio: item.biography.bio,
                achievements: item.biography.achievements?.map((a: any) => a.title) || [],
                gallery: item.biography.gallery?.map((g: string) => `${baseUrl}/storage/${g}`) || [],
                timeline: item.biography.timeline || []
            } : null
        }));
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
