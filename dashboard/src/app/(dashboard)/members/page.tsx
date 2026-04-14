"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Search,
    Edit2,
    UserPlus,
    X,
    Loader2,
    Trash2,
    Check
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function MemberManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [targetMember, setTargetMember] = useState<any>(null)

    const [formData, setFormData] = useState({
        name: "",
        role: "Member",
        generation: 1,
        status: "Active",
        parent_id: null as string | null,
        avatar: "",
        biography: "",
        birth_date: "",
        birth_place: "",
        partner_name: "",
        head_of_family: false,
        death_date: "",
        partner_birth_date: ""
    })
    const [uploadingImage, setUploadingImage] = useState(false)

    const fetchMembers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('family_members')
            .select('*, family_biographies(*)')
            .order('id', { ascending: true })

        if (data) setMembers(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const handleOpenAdd = () => {
        setModalMode('add')
        setFormData({ name: "", role: "Member", generation: 1, status: "Active", parent_id: null, avatar: "", biography: "", birth_date: "", birth_place: "", partner_name: "", partner_birth_date: "", head_of_family: false, death_date: "" })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (member: any) => {
        setModalMode('edit')
        setTargetMember(member)
        const bio = member.family_biographies?.[0] || {}
        setFormData({
            name: member.name,
            role: member.role,
            generation: member.generation,
            status: member.status,
            parent_id: member.parent_id,
            avatar: member.avatar || "",
            biography: bio.bio || "",
            birth_date: bio.birth_date || "",
            birth_place: bio.birth_place || "",
            partner_name: bio.partner_name || "",
            partner_birth_date: bio.partner_birth_date || "",
            head_of_family: bio.head_of_family || false,
            death_date: bio.death_date || ""
        })
        setIsModalOpen(true)
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingImage(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `avatars/${fileName}`

            const { data, error } = await supabase.storage.from('avatars').upload(filePath, file)
            if (error) throw error
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
            setFormData({ ...formData, avatar: publicUrl })
            alert('Foto berhasil diunggah')
        } catch (err: any) {
            console.error('Upload Error:', err)
            alert('Upload gagal: ' + (err.message || 'Error tidak diketahui'))
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const memberPayload: any = {
                name: formData.name,
                role: formData.role,
                generation: Number(formData.generation),
                status: formData.status,
                parent_id: formData.parent_id ? Number(formData.parent_id) : null,
                avatar: formData.avatar
            }

            let currentMemberId = targetMember?.id

            if (modalMode === 'add') {
                const { data, error } = await supabase.from('family_members').insert([memberPayload]).select('id').single()
                if (error) throw error
                currentMemberId = data.id
            } else {
                const { error } = await supabase
                    .from('family_members')
                    .update(memberPayload)
                    .eq('id', targetMember.id)
                if (error) throw error
            }

            // Always save biography data (even if fields are empty, to allow clearing)
            const bioPayload = {
                member_id: Number(currentMemberId),
                bio: formData.biography || "",
                birth_date: formData.birth_date || null,
                birth_place: formData.birth_place || "",
                partner_name: formData.partner_name || "",
                partner_birth_date: formData.partner_birth_date || null,
                head_of_family: formData.head_of_family || false,
                death_date: formData.death_date || null
            }

            // Check if biography already exists for this member
            const { data: existingBio } = await supabase
                .from('family_biographies')
                .select('id')
                .eq('member_id', Number(currentMemberId))
                .maybeSingle()

            if (existingBio) {
                // Update existing biography
                const { error: bioError } = await supabase
                    .from('family_biographies')
                    .update(bioPayload)
                    .eq('member_id', Number(currentMemberId))
                if (bioError) {
                    console.error('Bio Update Error:', bioError)
                    throw bioError
                }
            } else {
                // Insert new biography
                const { error: bioError } = await supabase
                    .from('family_biographies')
                    .insert([bioPayload])
                if (bioError) {
                    console.error('Bio Insert Error:', bioError)
                    throw bioError
                }
            }

            alert(modalMode === 'add' ? 'Anggota berhasil ditambahkan!' : 'Data anggota berhasil diperbarui!')
            setIsModalOpen(false)
            fetchMembers()
        } catch (error: any) {
            console.error('Submit Error:', error)
            alert('Gagal menyimpan data: ' + (error.message || 'Terjadi kesalahan sistem'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            const { error } = await supabase.from('family_members').delete().eq('id', targetMember.id)
            if (error) throw error

            alert('Anggota berhasil dihapus!')
            setIsDeleteModalOpen(false)
            fetchMembers()
        } catch (error: any) {
            console.error('Delete Error:', error)
            alert('Gagal menghapus anggota: ' + (error.message || 'Terjadi kesalahan'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary/40" /></div>

    return (
        <div className="grid gap-6 animate-in slide-in-from-bottom-2 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Anggota</h1>
                    <p className="text-muted-foreground italic text-sm">Kelola data keluarga Bani Harun.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-bold"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Tambah Anggota</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                <div className="relative group min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari nama atau peran..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner"
                    />
                </div>
            </div>

            <div className="overflow-hidden border rounded-3xl bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Anggota</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Peran</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{member.name[0]}</div>
                                            <span className="font-bold text-sm tracking-tight">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="grid text-xs">
                                            <span className="font-bold">{member.role}</span>
                                            <span className="text-muted-foreground font-bold italic tracking-tighter opacity-70">GEN {member.generation}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                            member.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {member.status === "Active" ? "Aktif" : "Wafat"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenEdit(member)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => { setTargetMember(member); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-md border rounded-3xl shadow-2xl p-8 grid gap-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Tambah Anggota' : 'Edit Anggota'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-5 text-sm">
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Nama Lengkap</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Peran</label>
                                    <input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Orang Tua (Parent)</label>
                                    <select
                                        value={formData.parent_id || ""}
                                        onChange={e => setFormData({ ...formData, parent_id: e.target.value || null })}
                                        className="h-11 px-4 bg-muted border rounded-xl font-bold"
                                    >
                                        <option value="">Tidak Ada / Akar</option>
                                        {members.filter(m => m.id !== targetMember?.id).map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Generasi</label>
                                    <input type="number" value={formData.generation} onChange={e => setFormData({ ...formData, generation: parseInt(e.target.value) })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl font-bold">
                                        <option value="Active">Aktif (Hidup)</option>
                                        <option value="Wafat">Wafat</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Tempat Lahir</label>
                                    <input placeholder="Contoh: Jakarta" value={formData.birth_place} onChange={e => setFormData({ ...formData, birth_place: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Tanggal Lahir</label>
                                    <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                            </div>
                            {formData.status === "Wafat" && (
                                <div className="grid gap-1.5 p-3 bg-destructive/5 border border-destructive/10 rounded-xl">
                                    <label className="font-bold text-destructive uppercase text-[10px]">Tanggal Wafat (Untuk Haul)</label>
                                    <input type="date" value={formData.death_date} onChange={e => setFormData({ ...formData, death_date: e.target.value })} className="h-11 px-4 bg-white border border-destructive/20 rounded-xl focus:ring-2 focus:ring-destructive/20 focus:outline-none text-destructive" />
                                </div>
                            )}
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Nama Pasangan & Tgl Lahir Pasangan</label>
                                <div className="flex gap-2">
                                    <input placeholder="Nama Suami/Istri..." value={formData.partner_name} onChange={e => setFormData({ ...formData, partner_name: e.target.value })} className="flex-1 h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                    <input type="date" value={formData.partner_birth_date} onChange={e => setFormData({ ...formData, partner_birth_date: e.target.value })} className="w-40 h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <input type="checkbox" id="head_of_family" checked={formData.head_of_family} onChange={e => setFormData({ ...formData, head_of_family: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label htmlFor="head_of_family" className="text-xs font-bold text-muted-foreground uppercase">Tandai Sebagai Kepala Keluarga</label>
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Foto Profil (Upload)</label>
                                <div className="flex items-center gap-3">
                                    {formData.avatar && <img src={formData.avatar} alt="Preview" className="w-10 h-10 rounded-full object-cover border" />}
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingImage} className="flex-1 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors" />
                                    {uploadingImage && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                </div>
                                <input placeholder="Atau Tempel URL Foto..." value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className="h-9 px-4 text-xs bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 mt-1" />
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Biografi Buku Keluarga</label>
                                <textarea placeholder="Tuliskan kisah singkat, pencapaian, atau biografi..." rows={3} value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} className="p-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" />
                            </div>
                            <button type="submit" disabled={isSubmitting || uploadingImage} className="h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Simpan Data</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-sm border rounded-3xl shadow-2xl p-8 text-center grid gap-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full grid place-items-center mx-auto"><Trash2 className="w-8 h-8" /></div>
                        <h2 className="text-xl font-extrabold">Hapus Anggota?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">Hapus <strong>{targetMember?.name}</strong> dari sistem? Aksi ini permanen.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 p-3.5 bg-secondary rounded-2xl font-bold text-sm hover:bg-secondary/80 transition-colors">Batal</button>
                            <button onClick={handleDelete} className="flex-1 p-3.5 bg-destructive text-white rounded-2xl font-bold text-sm shadow-lg shadow-destructive/20 hover:bg-destructive/90 transition-all">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
