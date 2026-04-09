"use client"

import { useState, useEffect, useMemo, memo, useCallback } from "react"
import { mockMembers, Member } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { TreePine, Edit2, Trash2, Loader2, Printer, ChevronDown } from "lucide-react"
import { API_BASE_URL, getAuthToken, getAdminUrl } from "@/lib/api-config"

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


    useEffect(() => {
        setIsMounted(true)
        const baseUrl = API_BASE_URL;
        const token = getAuthToken()

        fetch(`${baseUrl}/api/buku-keluarga`, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        })
            .then(res => res.json())
            .then(data => {
                const formatted = data.map((item: any) => ({
                    id: String(item.id),
                    name: item.name,
                    role: item.role,
                    generation: item.generation,
                    status: item.status,
                    lastActive: item.last_active,
                    parentId: item.parent_id ? String(item.parent_id) : undefined
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
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch tree data", err)
                setMembers(mockMembers)
                setLoading(false)
            })
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

    const confirmDelete = async () => {
        if (!memberToDelete || isDeleting) return

        setIsDeleting(true)
        try {
            const baseUrl = API_BASE_URL;
            const token = getAuthToken()

            const res = await fetch(`${baseUrl}/api/members/${memberToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (res.ok) {
                setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
                setMemberToDelete(null)
            } else {
                const error = await res.json();
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
                        />
                    ))}
                </div>
            </div>

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

function FamilyBranch({ member, allMembers, expandedNodes, onToggle, onDelete }: {
    member: Member,
    allMembers: Member[],
    expandedNodes: Set<string>,
    onToggle: (id: string) => void,
    onDelete: (id: string, name: string) => void
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

function TreeNode({ member, onDelete, hasChildren, isExpanded, onToggle }: {
    member: Member,
    onDelete: (id: string, name: string) => void,
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

            {/* Admin Actions - Hover Based for Cleanliness */}
            <div
                className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-75 group-hover:scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <a
                    href={getAdminUrl(`/admin/family-members/${member.id}/edit`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white shadow-xl border border-primary/20 hover:bg-primary/10 text-primary rounded-lg transition-colors flex items-center justify-center"
                    title="Edit di CMS"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </a>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(member.id, member.name); }}
                    className="p-1.5 bg-white shadow-xl border border-destructive/20 hover:bg-destructive hover:text-white text-destructive rounded-lg transition-colors flex items-center justify-center"
                    title="Hapus"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
