import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    DollarSign,
    Download,
    Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { cookies } from 'next/headers'
import { API_BASE_URL } from "@/lib/api-config"

import { supabase } from "@/lib/supabase"

async function getFinancialData() {
    const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('date', { ascending: false });

    const totalFunds = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Simple logic for monthly stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyStats = transactions?.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }) || [];

    const monthlyContribution = monthlyStats
        .filter(t => t.type === 'Contribution' || Number(t.amount) > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const recentExpenses = Math.abs(monthlyStats
        .filter(t => t.type === 'Expense' || Number(t.amount) < 0)
        .reduce((sum, t) => sum + Number(t.amount), 0));

    return {
        summary: {
            original: {
                totalFunds,
                growth: 5.2,
                monthlyContribution,
                recentExpenses
            }
        },
        transactions: transactions?.slice(0, 10) || []
    };
}

export default async function FinancialsPage() {
    const { summary, transactions } = await getFinancialData();

    // Mock chart data for visualization (still mock for now as backend doesn't provide historical series yet)
    const chartData = [
        { name: 'Jan', amount: 120 },
        { name: 'Feb', amount: 135 },
        { name: 'Mar', amount: 150 },
        { name: 'Apr', amount: 145 },
        { name: 'May', amount: 160 },
        { name: 'Jun', amount: 185 },
    ];

    return (
        <div className="grid gap-6 animate-in slide-in-from-right-4 duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight grid grid-flow-col justify-start items-center gap-3">
                        <Wallet className="w-8 h-8 text-primary" />
                        Dasbor Keuangan
                    </h1>
                    <p className="text-muted-foreground italic">Pantau kas warisan keluarga, kontribusi, dan pengeluaran.</p>
                </div>
                <div className="grid grid-flow-col items-center gap-2">
                    <button className="grid grid-flow-col items-center gap-2 px-4 py-2 border rounded-lg font-semibold hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Laporan</span>
                    </button>
                    <button className="grid grid-flow-col items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <PlusIcon />
                        <span>Tambah Transaksi</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border rounded-2xl shadow-sm grid gap-4">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Kas</span>
                        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="grid">
                        <span className="text-3xl font-black tracking-tight leading-none">Rp {(summary.original.totalFunds / 1000000).toFixed(1)}M</span>
                        <div className="grid grid-flow-col justify-start items-center gap-1 mt-2 text-xs font-bold text-green-600 dark:text-green-400">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>+{summary.original.growth}% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-2xl shadow-sm grid gap-4">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pendapatan Bulanan</span>
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="grid">
                        <span className="text-3xl font-black tracking-tight leading-none">Rp {(summary.original.monthlyContribution / 1000).toLocaleString()}k</span>
                        <p className="text-xs text-muted-foreground font-medium mt-2">Kontribusi keluarga bulan ini</p>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-2xl shadow-sm grid gap-4">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pengeluaran Terbaru</span>
                        <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
                            <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <div className="grid">
                        <span className="text-3xl font-black tracking-tight leading-none">Rp {(summary.original.recentExpenses / 1000).toLocaleString()}k</span>
                        <p className="text-xs text-muted-foreground font-medium mt-2">Pemeliharaan dan acara terbaru</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 p-6 bg-card border rounded-2xl shadow-sm">
                    <div className="grid grid-cols-[1fr_auto] items-center mb-8">
                        <h3 className="font-bold text-lg">Pertumbuhan Kontribusi</h3>
                        <div className="grid grid-flow-col items-center gap-2">
                            <span className="text-xs font-bold px-2 py-1 bg-muted rounded-md uppercase tracking-widest">Tahunan</span>
                        </div>
                    </div>
                    <div className="h-[250px] w-full grid grid-flow-col justify-between items-end px-4 pb-4">
                        {chartData.map((d, i) => (
                            <div key={i} className="grid justify-items-center gap-2 w-full h-full">
                                <div
                                    className="w-[70%] self-end bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group"
                                    style={{ height: `${(d.amount / 200) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 shadow-lg border pointer-events-none transition-opacity whitespace-nowrap font-bold">
                                        Rp {d.amount}k
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-6 p-6 bg-card border rounded-2xl shadow-sm">
                    <div className="grid grid-cols-[1fr_auto] items-center mb-6">
                        <h3 className="font-bold text-lg">Transaksi Terbaru</h3>
                        <button className="text-xs font-bold text-primary italic hover:underline">Lihat Buku Besar</button>
                    </div>
                    <div className="grid gap-4">
                        {transactions.map((tx: any) => (
                            <div key={tx.id} className="grid grid-cols-[1fr_auto] items-center p-3 hover:bg-muted/50 rounded-xl transition-all group">
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl grid place-items-center transition-colors",
                                        tx.amount > 0 ? "bg-green-100 text-green-600 group-hover:bg-green-200" : "bg-red-100 text-red-600 group-hover:bg-red-200"
                                    )}>
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="grid min-w-0">
                                        <span className="text-sm font-bold tracking-tight truncate">{tx.description}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-sm font-black",
                                    tx.amount > 0 ? "text-green-600" : "text-red-600"
                                )}>
                                    {tx.amount > 0 ? "+" : ""}Rp {(tx.amount / 1000).toLocaleString()}k
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlusIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
