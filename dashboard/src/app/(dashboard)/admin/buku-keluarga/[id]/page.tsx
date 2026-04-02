"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, Loader2, Printer } from "lucide-react"
import Link from "next/link"

export default function EditBiographyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [member, setMember] = useState<any>(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        generation: 1,
        birth_place: "",
        birth_date: "",
        partner_name: "",
        head_of_family: "",
        bio: "",
        achievements: [] as string[],
        timeline: [] as { date: string, event: string }[],
    });

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        fetch(`${baseUrl}/api/buku-keluarga`)
            .then(res => res.json())
            .then(data => {
                const found = data.find((d: any) => String(d.id) === id);
                if (found) {
                    setMember(found);
                    setForm(prev => ({
                        ...prev,
                        name: found.name || "",
                        role: found.role || "",
                        generation: found.generation || 1,
                        ...(found.biography ? {
                            birth_place: found.biography.birth_place || "",
                            birth_date: found.biography.birth_date || "",
                            partner_name: found.biography.partner_name || "",
                            head_of_family: found.biography.head_of_family || "",
                            bio: found.biography.bio || "",
                            achievements: found.biography.achievements?.map((a: any) => typeof a === 'object' ? a.title : a) || [],
                            timeline: found.biography.timeline || [],
                        } : {})
                    }));
                }
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${baseUrl}/api/buku-keluarga/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    ...form,
                    // Format achievements string list back to associative arrays for Filament compatibility
                    achievements: form.achievements.filter(a => typeof a === "string" && a.trim() !== "").map(a => ({ title: a })),
                    timeline: form.timeline.filter(t => t.date?.trim() !== "" && t.event?.trim() !== "")
                })
            });
            if (res.ok) {
                router.push("/admin/buku-keluarga");
                router.refresh();
            } else {
                alert("Gagal menyimpan data.");
            }
        } catch (e) {
            console.error(e);
            alert("Terjadi kesalahan sistem saat menyimpan.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    if (!member) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/buku-keluarga" className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Biografi: {member.name}</h1>
                        <p className="text-muted-foreground text-sm">Gen {member.generation} • {member.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors no-print border shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Biografi</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground border rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Lengkap</label>
                        <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Peran / Silsilah</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="Pendiri / Sesepuh">Pendiri / Sesepuh (Gen 1)</option>
                            <option value="Anak">Anak (Gen 2)</option>
                            <option value="Putu (Cucu)">Putu (Cucu) (Gen 3)</option>
                            <option value="Buyut (Cicit)">Buyut (Cicit) (Gen 4)</option>
                            <option value="Canggah">Canggah (Gen 5)</option>
                            <option value="Wareng">Wareng (Gen 6)</option>
                            <option value="Udheg-udheg">Udheg-udheg (Gen 7)</option>
                            <option value="Gantung Siwur">Gantung Siwur (Gen 8)</option>
                            <option value="Gropak Senthe">Gropak Senthe (Gen 9)</option>
                            <option value="Debog Bosok">Debog Bosok (Gen 10)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Generasi (Angka)</label>
                        <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.generation} onChange={e => setForm({ ...form, generation: parseInt(e.target.value) || 1 })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tempat Lahir</label>
                        <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.birth_place} onChange={e => setForm({ ...form, birth_place: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tanggal Lahir</label>
                        <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Pasangan</label>
                        <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.partner_name} onChange={e => setForm({ ...form, partner_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Kepala Keluarga (Opsional, untuk melabeli kelompok keluarga)</label>
                        <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.head_of_family} onChange={e => setForm({ ...form, head_of_family: e.target.value })} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Biografi (Mendukung HTML dasar seperti &lt;p&gt;, &lt;b&gt;, &lt;i&gt;)</label>
                        <textarea className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="<p>Tuliskan perjalanan hidup beliau di sini...</p>"
                            value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 shadow-md">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? "Menyimpan Data..." : "Simpan Biografi"}
                    </button>
                </div>
            </form>
        </div>
    )
}
