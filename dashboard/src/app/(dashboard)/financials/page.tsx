"use client"

import { useEffect, useState, useMemo } from "react"
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    DollarSign,
    Download,
    Plus,
    X,
    Loader2,
    Trash2,
    Edit2,
    Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export default function FinancialsPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [transactionToAction, setTransactionToAction] = useState<any>(null)

    const [formData, setFormData] = useState({
        amount: "",
        type: "Contribution",
        description: "",
        date: new Date().toISOString().split('T')[0]
    })

    const fetchFinancialData = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('financial_transactions')
                .select('*')
                .order('date', { ascending: false });

            if (!error && data) {
                setTransactions(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFinancialData()
    }, [])

    const summary = useMemo(() => {
        const totalFunds = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
        const now = new Date()
        const monthlyStats = transactions.filter(t => {
            const d = new Date(t.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        const monthlyContribution = monthlyStats
            .filter(t => t.type === 'Contribution' || Number(t.amount) > 0)
            .reduce((sum, t) => sum + Number(t.amount || 0), 0)
        const recentExpenses = Math.abs(monthlyStats
            .filter(t => t.type === 'Expense' || Number(t.amount) < 0)
            .reduce((sum, t) => sum + Number(t.amount || 0), 0))

        return { totalFunds, monthlyContribution, recentExpenses }
    }, [transactions])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const actualAmount = formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
        const { error } = await supabase.from('financial_transactions').insert([
            { ...formData, amount: actualAmount }
        ])
        if (!error) {
            setIsAddModalOpen(false)
            fetchFinancialData()
        } else {
            alert(error.message)
        }
        setIsSubmitting(false)
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const actualAmount = formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
        const { error } = await supabase.from('financial_transactions')
            .update({ ...formData, amount: actualAmount })
            .eq('id', transactionToAction.id)
        if (!error) {
            setIsEditModalOpen(false)
            fetchFinancialData()
        } else {
            alert(error.message)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        const { error } = await supabase.from('financial_transactions')
            .delete()
            .eq('id', transactionToAction.id)
        if (!error) {
            setIsDeleteModalOpen(false)
            fetchFinancialData()
        } else {
            alert(error.message)
        }
        setIsSubmitting(false)
    }

    const openEdit = (tx: any) => {
        setTransactionToAction(tx)
        setFormData({
            amount: Math.abs(tx.amount).toString(),
            type: tx.type,
            description: tx.description,
            date: tx.date
        })
        setIsEditModalOpen(true)
    }

    if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary/40" /></div>

    return (
        <div className="grid gap-6 animate-in slide-in-from-right-4 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-primary" />
                        Dasbor Keuangan
                    </h1>
                    <p className="text-muted-foreground italic text-sm">Monitor kas dan kontribusi keluarga.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-bold"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Transaksi</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Kas" value={`Rp ${(summary.totalFunds / 1000000).toFixed(1)}M`} icon={DollarSign} color="green" />
                <StatCard title="Kontribusi Bulan Ini" value={`Rp ${(summary.monthlyContribution / 1000).toLocaleString()}k`} icon={TrendingUp} color="blue" />
                <StatCard title="Pengeluaran Bulan Ini" value={`Rp ${(summary.recentExpenses / 1000).toLocaleString()}k`} icon={ArrowDownRight} color="red" />
            </div>

            <div className="p-6 bg-card border rounded-3xl shadow-sm">
                <h3 className="font-bold text-lg mb-6">Riwayat Transaksi</h3>
                <div className="grid gap-4">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-[1fr_auto] items-center p-4 hover:bg-muted/50 rounded-2xl transition-all group border border-transparent hover:border-border">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl grid place-items-center transition-colors",
                                    tx.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm tracking-tight">{tx.description}</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={cn("text-sm font-black", tx.amount > 0 ? "text-green-600" : "text-red-600")}>
                                    {tx.amount > 0 ? "+" : "-"}Rp {Math.abs(tx.amount / 1000).toLocaleString()}k
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(tx)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => { setTransactionToAction(tx); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <p className="p-12 text-center text-muted-foreground italic font-medium">Belum ada data transaksi.</p>}
                </div>
            </div>

            {/* Modals */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-md border rounded-3xl shadow-2xl p-8 grid gap-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{isAddModalOpen ? 'Tambah Transaksi' : 'Edit Transaksi'}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={isAddModalOpen ? handleAdd : handleEdit} className="grid gap-5 text-sm">
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Tipe</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl font-bold">
                                    <option value="Contribution">Kontribusi (+)</option>
                                    <option value="Expense">Pengeluaran (-)</option>
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Jumlah (Rp)</label>
                                <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl text-lg font-black" placeholder="Contoh: 100000" />
                            </div>
                            <div className="grid gap-1.5">
                                <label className="font-bold text-muted-foreground uppercase text-[10px]">Keterangan</label>
                                <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="h-11 px-4 bg-muted border rounded-xl font-medium" placeholder="Uang kas bulanan" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Simpan Transaksi</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-sm border rounded-3xl shadow-2xl p-8 text-center grid gap-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full grid place-items-center mx-auto"><Trash2 className="w-8 h-8" /></div>
                        <h2 className="text-xl font-extrabold">Hapus Transaksi?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">Aksi ini permanen dan akan mempengaruhi saldo kas.</p>
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

function StatCard({ title, value, icon: Icon, color }: any) {
    const colors = {
        green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    }
    return (
        <div className="p-6 bg-card border rounded-3xl shadow-sm grid gap-4">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{title}</span>
                <div className={cn("p-2 rounded-xl", (colors as any)[color])}><Icon className="w-4 h-4" /></div>
            </div>
            <span className="text-2xl font-black tracking-tighter">{value}</span>
        </div>
    )
}
