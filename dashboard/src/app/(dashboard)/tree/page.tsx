"use client"

import { useState, useEffect, useMemo, memo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { TreePine, Edit2, Trash2, Loader2, Printer, ChevronDown, UserPlus, X, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Member {
    id: string
    name: string
    role: string
    generation: number
    status: string
    parentId?: string
}

// Memoize components to prevent re-renders when parent's state changes unrelatedly
const MemoizedTreeNode = memo(TreeNode);
const MemoizedFamilyBranch = memo(FamilyBranch);

export default function FamilyTreePage() {
    const [members, setMembers] = useState<Member[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
    const [memberToDelete, setMemberToDelete] = useState<{ id: string, name: string } | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Edit/Add states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [targetMember, setTargetMember] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        role: "Member",
        generation: 1,
        status: "Active",
        parent_id: null as string | null,
        biography: "",
        birth_date: "",
        birth_place: "",
        partner_name: "",
        head_of_family: false,
        death_date: ""
    })


    useEffect(() => {
        setIsMounted(true)

        const fetchTree = async () => {
            const { data, error } = await supabase
                .from('family_members')
                .select('*, family_biographies(bio)')
                .order('id', { ascending: true });

            if (data) {
                const formatted = data.map((item: any) => ({
                    id: String(item.id),
                    name: item.name,
                    role: item.role,
                    generation: item.generation,
                    status: item.status,
                    lastActive: item.last_active,
                    parentId: item.parent_id ? String(item.parent_id) : undefined,
                    biography: item.family_biographies?.[0]?.bio || ""
                }));

                // Auto-expand first 2 levels
                const roots = formatted.filter((m: any) => !m.parentId);
                const toExpand = new Set<string>(roots.map((r: any) => r.id));
                formatted.forEach((m: any) => {
                    if (m.parentId && roots.some((r: any) => r.id === m.parentId)) {
                        toExpand.add(m.id);
                    }
                });

                setMembers(formatted)
                setExpandedNodes(toExpand)
            }
            setLoading(false)
        }

        fetchTree()
    }, [])

    const toggleNode = useCallback((id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, []);

    const deleteMember = useCallback((id: string, name: string) => {
        setMemberToDelete({ id, name })
    }, []);

    const fetchTreeData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('family_members')
            .select('*, family_biographies(*)')
            .order('id', { ascending: true });
        if (data) {
            const formatted = data.map((item: any) => ({
                id: String(item.id),
                name: item.name,
                role: item.role,
                generation: item.generation,
                status: item.status,
                parentId: item.parent_id ? String(item.parent_id) : undefined,
                biography: item.family_biographies?.[0]?.bio || "",
                birthDate: item.family_biographies?.[0]?.birth_date || "",
                birthPlace: item.family_biographies?.[0]?.birth_place || "",
                partnerName: item.family_biographies?.[0]?.partner_name || "",
                headOfFamily: item.family_biographies?.[0]?.head_of_family || false,
                deathDate: item.family_biographies?.[0]?.death_date || ""
            }));
            setMembers(formatted)
        }
        setLoading(false)
    }

    const handleOpenEdit = useCallback((member: any) => {
        setModalMode('edit')
        setTargetMember(member)
        setFormData({
            name: member.name,
            role: member.role,
            generation: member.generation,
            status: member.status,
            parent_id: member.parentId || null,
            biography: member.biography || "",
            birth_date: member.birthDate || "",
            birth_place: member.birthPlace || "",
            partner_name: member.partnerName || "",
            head_of_family: member.headOfFamily || false,
            death_date: member.deathDate || ""
        })
        setIsModalOpen(true)
    }, [])

    const handleOpenAddChild = useCallback((parent: any) => {
        setModalMode('add')
        setTargetMember(parent)
        setFormData({
            name: "",
            role: "Member",
            generation: (parent.generation || 1) + 1,
            status: "Active",
            parent_id: parent.id,
            biography: "",
            birth_date: "",
            birth_place: "",
            partner_name: "",
            head_of_family: false,
            death_date: ""
        })
        setIsModalOpen(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload = {
                name: formData.name,
                role: formData.role,
                generation: formData.generation,
                status: formData.status,
                parent_id: formData.parent_id
            }

            let memberId = targetMember?.id

            if (modalMode === 'add') {
                const { data, error } = await supabase.from('family_members').insert([payload]).select('id').single()
                if (error) throw error
                memberId = data.id
            } else {
                const { error } = await supabase.from('family_members').update(payload).eq('id', targetMember.id)
                if (error) throw error
            }

            if (formData.biography || formData.birth_date || formData.birth_place || formData.partner_name || formData.death_date) {
                await supabase.from('family_biographies').upsert({
                    member_id: memberId,
                    bio: formData.biography,
                    birth_date: formData.birth_date || null,
                    birth_place: formData.birth_place,
                    partner_name: formData.partner_name,
                    head_of_family: formData.head_of_family,
                    death_date: formData.death_date || null
                }, { onConflict: 'member_id' })
            }

            setIsModalOpen(false)
            fetchTreeData()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!memberToDelete || isDeleting) return
        setIsDeleting(true)
        try {
            const { error } = await supabase.from('family_members').delete().eq('id', memberToDelete.id);
            if (!error) {
                setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
                setMemberToDelete(null)
            } else {
                alert(error.message || "Gagal menghapus anggota.");
            }
        } catch (err) {
            console.error("Error deleting member", err);
            alert("Terjadi koneksi gagal ke server.");
        } finally {
            setIsDeleting(false)
        }
    }

    const roots = useMemo(() => members.filter(m => !m.parentId), [members]);

    if (!isMounted || loading) return (
        <div className="p-20 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary/40" />
            <p className="text-muted-foreground animate-pulse font-medium italic">Menghubungkan ke arsip keluarga...</p>
        </div>
    );

    return (
        <div className="w-full h-full overflow-x-auto overflow-y-auto pb-40 no-print scroll-smooth">
            <div className="min-w-max flex flex-col items-center gap-16 animate-in zoom-in-95 duration-500 p-12 lg:p-20">
                {/* Header / Info */}
                <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md border border-primary/10 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between text-sm gap-6 shadow-xl shadow-primary/5">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
                            <TreePine className="w-6 h-6" />
                            Pohon Keluarga Bani Harun
                        </h1>
                        <p className="text-muted-foreground italic text-xs mt-1">Gunakan mouse untuk menggeser dan klik untuk melihat keturunan</p>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" title="Hidup" />
                                <span className="text-xs font-medium">Hidup</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" title="Wafat" />
                                <span className="text-xs font-medium">Wafat</span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 no-print font-medium text-xs"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Cetak Silsilah</span>
                        </button>
                    </div>
                </div>

                {/* Tree Root Container */}
                <div className="flex flex-col items-center gap-24 pt-8 min-w-max">
                    {roots.map(root => (
                        <MemoizedFamilyBranch
                            key={root.id}
                            member={root}
                            allMembers={members}
                            expandedNodes={expandedNodes}
                            onToggle={toggleNode}
                            onDelete={deleteMember}
                            onEdit={handleOpenEdit}
                            onAddChild={handleOpenAddChild}
                        />
                    ))}
                </div>
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 grid gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{modalMode === 'add' ? `Tambah Anak ${targetMember?.name}` : 'Edit Anggota'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Nama Lengkap</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Peran</label>
                                    <input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                                </div>
                                <div className="grid gap-1.5">
                                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Generasi</label>
                                    <input type="number" value={formData.generation} onChange={e => setFormData({ ...formData, generation: parseInt(e.target.value) })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
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

                            {(formData.status === "Deceased" || formData.status === "Wafat") && (
                                <div className="grid gap-1.5 p-3 bg-destructive/5 border border-destructive/10 rounded-xl">
                                    <label className="font-bold text-destructive uppercase text-[10px]">Tanggal Wafat (Untuk Haul)</label>
                                    <input type="date" value={formData.death_date} onChange={e => setFormData({ ...formData, death_date: e.target.value })} className="h-11 px-4 bg-white border border-destructive/20 rounded-xl focus:ring-2 focus:ring-destructive/20 focus:outline-none text-destructive" />
                                </div>
                            )}
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Nama Pasangan (Suami/Istri)</label>
                                <input placeholder="Tulis nama pasangan..." value={formData.partner_name} onChange={e => setFormData({ ...formData, partner_name: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <input type="checkbox" id="head_of_family_tree" checked={formData.head_of_family} onChange={e => setFormData({ ...formData, head_of_family: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label htmlFor="head_of_family_tree" className="text-xs font-bold text-muted-foreground uppercase">Tandai Sebagai Kepala Keluarga</label>
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl font-bold">
                                    <option value="Active">Aktif</option>
                                    <option value="Inactive">Wafat</option>
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Biografi Tokoh</label>
                                <textarea rows={3} value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} className="p-4 bg-muted border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Simpan Perubahan</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Modal */}
            {memberToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-primary/5">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Konfirmasi Hapus</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Apakah Anda yakin ingin menghapus <strong className="text-foreground">{memberToDelete.name}</strong> dari silsilah keluarga?
                                <br />
                                <span className="text-[10px] text-destructive italic mt-2 block opacity-80 uppercase tracking-wider font-semibold underline underline-offset-4 decoration-2">Tindakan ini tidak dapat dibatalkan.</span>
                            </p>

                            <div className="flex gap-3 w-full mt-6">
                                <button
                                    onClick={() => setMemberToDelete(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-2xl hover:bg-secondary/80 transition-colors font-bold text-sm"
                                >
                                    Batalkan
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-destructive text-white rounded-2xl hover:bg-destructive/90 transition-all font-bold text-sm shadow-lg shadow-destructive/20 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Menghapus...</span>
                                        </>
                                    ) : (
                                        <span>Ya, Hapus</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function FamilyBranch({ member, allMembers, expandedNodes, onToggle, onDelete, onEdit, onAddChild }: {
    member: Member,
    allMembers: Member[],
    expandedNodes: Set<string>,
    onToggle: (id: string) => void,
    onDelete: (id: string, name: string) => void,
    onEdit: (member: Member) => void,
    onAddChild: (member: Member) => void
}) {
    const children = useMemo(() => allMembers.filter(m => m.parentId === member.id), [allMembers, member.id]);
    const isExpanded = expandedNodes.has(member.id);
    const handleToggle = useCallback(() => {
        onToggle(member.id);
    }, [onToggle, member.id]);
    const hasChildren = children.length > 0;

    return (
        <div className="flex flex-col items-center relative transition-all duration-500">
            {/* Parent Node Wrapper with Fixed Height to Normalize Sibling Vertical Levels */}
            <div className="h-[140px] flex flex-col items-center justify-start relative z-10 hover:z-50 w-full">
                <MemoizedTreeNode
                    member={member}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                    hasChildren={hasChildren}
                    isExpanded={isExpanded}
                    onToggle={handleToggle}
                />
            </div>

            {hasChildren && isExpanded && (
                <div className="flex flex-col items-center animate-in slide-in-from-top-4 duration-500 w-full relative">
                    {/* Vertical line down from parent */}
                    <div className="w-1 h-8 bg-primary opacity-40 pointer-events-none z-0 rounded-full" />

                    <div className="flex w-full justify-center">
                        {children.map((child, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === children.length - 1;
                            const isOnly = children.length === 1;

                            return (
                                <div key={child.id} className="relative flex flex-col items-center px-4 md:px-8">
                                    {/* Horizontal Connection Line */}
                                    {!isOnly && (
                                        <div className={cn(
                                            "absolute top-0 h-1 bg-primary opacity-40 pointer-events-none z-0 rounded-full",
                                            isFirst ? "left-1/2 right-0" : isLast ? "left-0 right-1/2" : "left-0 right-0"
                                        )} />
                                    )}
                                    {/* Vertical stub down to this child */}
                                    <div className="w-1 h-8 bg-primary opacity-40 absolute top-0 pointer-events-none z-0 rounded-full" />

                                    <div className="pt-8 relative z-10">
                                        <MemoizedFamilyBranch
                                            member={child}
                                            allMembers={allMembers}
                                            expandedNodes={expandedNodes}
                                            onToggle={onToggle}
                                            onDelete={onDelete}
                                            onEdit={onEdit}
                                            onAddChild={onAddChild}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function TreeNode({ member, onDelete, onEdit, onAddChild, hasChildren, isExpanded, onToggle }: {
    member: Member,
    onDelete: (id: string, name: string) => void,
    onEdit: (member: Member) => void,
    onAddChild: (member: Member) => void,
    hasChildren: boolean,
    isExpanded: boolean,
    onToggle: () => void
}) {
    const initials = useMemo(() => {
        const parts = member.name.replace(/[–-].*/, '').trim().split(' ');
        return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    }, [member.name]);

    const isDead = member.status === "Inactive"

    return (
        <div
            onClick={hasChildren ? onToggle : undefined}
            className={cn(
                "relative flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 bg-white shadow-md transition-all duration-300 group ring-4 ring-transparent min-w-[130px] max-w-[180px]",
                hasChildren && "cursor-pointer hover:ring-primary/10 hover:shadow-lg hover:border-primary/30",
                isExpanded && hasChildren && "border-primary/50 shadow-xl scale-105",
                isDead && "opacity-70 grayscale-[0.3] bg-muted/30"
            )}
        >
            {/* Avatar / Initials */}
            <div className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center font-serif text-lg border-2 transition-transform group-hover:scale-110 shadow-inner",
                isDead ? "bg-muted text-muted-foreground border-muted-foreground/20" : "bg-primary/10 text-primary border-primary/20"
            )}>
                {initials}
            </div>

            <div className="text-center overflow-hidden w-full px-1">
                <h3 className="font-bold text-[13px] leading-tight text-foreground truncate" title={member.name}>{member.name}</h3>
                <p className="text-[9px] font-semibold text-muted-foreground/80 tracking-widest uppercase mt-0.5 mt-1">{member.role}</p>
                {member.generation && (
                    <span className="text-[8px] bg-primary/5 text-primary/60 px-1.5 py-0.5 rounded-full mt-1.5 inline-block font-mono">
                        GEN {member.generation}
                    </span>
                )}
            </div>

            {/* Toggle Badge */}
            <div
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-lg transition-all z-30 cursor-pointer",
                    isExpanded ? "rotate-180 bg-primary text-white border-primary" : "hover:scale-125 bg-white text-muted-foreground border-primary/20"
                )}
            >
                <ChevronDown className="w-4 h-4" />
            </div>

            {/* Admin Actions - Improved Visibility and Hit Area */}
            <div
                className="absolute -top-4 -right-2 flex items-center gap-1.5 opacity-100 z-50 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => onAddChild(member)}
                    className="w-8 h-8 bg-white shadow-lg border border-primary/20 hover:bg-primary hover:text-white text-primary rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                    title="Tambah Anak"
                >
                    <UserPlus className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(member)}
                    className="w-8 h-8 bg-white shadow-lg border border-primary/20 hover:bg-primary hover:text-white text-primary rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                    title="Edit"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(member.id, member.name); }}
                    className="w-8 h-8 bg-white shadow-lg border border-destructive/20 hover:bg-destructive hover:text-white text-destructive rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                    title="Hapus"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
