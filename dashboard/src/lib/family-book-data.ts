import { Member, mockMembers } from "./mock-data";

export interface Biography {
    memberId: string;
    birthDate: string;
    birthPlace: string;
    partner?: string;
    headOfFamily?: string;
    children: string[];
    bio: string;
    achievements: string[];
    gallery: string[];
    timeline: { date: string; event: string }[];
}

export const familyBiographies: Record<string, Biography> = {
    "1": {
        memberId: "1",
        birthDate: "15 Agustus 1945",
        birthPlace: "Bangkalan, Madura",
        partner: "Siti Aminah",
        children: ["Ahmad Harun", "Fathima Harun"],
        bio: "Harun Al-Rashid adalah pilar utama keluarga Bani Harun. Lahir di era kemerdekaan, beliau mendedikasikan hidupnya untuk membangun fondasi nilai kekeluargaan yang kuat. Sebagai seorang pendidik dan tokoh masyarakat, beliau dikenal karena kebijakan dan kearifannya dalam menyelesaikan setiap persoalan keluarga.",
        achievements: [
            "Pendiri Yayasan Pendidikan Bani Harun",
            "Penulis Buku 'Silsilah dan Nilai Luhur Keluarga'",
            "Tokoh Masyarakat Teladan Bangkalan 1998"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
        ],
        timeline: [
            { date: "1945", event: "Lahir di Bangkalan" },
            { date: "1968", event: "Menikah dengan Siti Aminah" },
            { date: "1970", event: "Kelar pendidikan sarjana keguruan" },
            { date: "1990", event: "Mendirikan pusat belajar keluarga" }
        ]
    },
    "3": {
        memberId: "3",
        birthDate: "10 Mei 1972",
        birthPlace: "Surabaya",
        partner: "Rina Septiana",
        children: ["Yusuf Ahmad", "Zainab Ahmad"],
        bio: "Ahmad Harun meneruskan tongkat estafet kepemimpinan sebagai kepala cabang keluarga di Surabaya. Dikenal dengan visi modernnya, beliau mengintegrasikan teknologi dalam pengelolaan aset dan komunikasi keluarga, namun tetap menjaga tradisi luhur yang diwariskan ayahnya.",
        achievements: [
            "Ketua Arisan Besar Bani Harun (2015-2025)",
            "Pengembang Sistem Digital Keuangan Keluarga",
            "Inisiator Program Beasiswa Internal"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800"
        ],
        timeline: [
            { date: "1972", event: "Lahir di Surabaya" },
            { date: "1995", event: "Memulai karir di bidang Manajemen Keuangan" },
            { date: "2010", event: "Dipercaya menjadi Ketua Cabang Surabaya" }
        ]
    }
};

export interface BookPageData extends Member {
    bioDetails: Biography | null;
}

export function getBookPages(): BookPageData[] {
    return mockMembers.map(member => {
        const details = familyBiographies[member.id] || null;
        return {
            ...member,
            bioDetails: details
        };
    });
}
