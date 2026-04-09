import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentMembers } from "@/components/dashboard/recent-members"
import { EventSummary } from "@/components/dashboard/event-summary"
import { Users, Calendar, Wallet, TrendingUp } from "lucide-react"

import { cookies } from 'next/headers'
import { API_BASE_URL } from "@/lib/api-config"

async function getDashboardData() {
  const baseUrl = API_BASE_URL;
  const cookieStore = await cookies()
  const token = cookieStore.get('bh-auth-token')?.value

  const headers = {
    'Cache-Control': 'no-store',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  const [statsRes, membersRes, eventsRes] = await Promise.all([
    fetch(`${baseUrl}/api/dashboard/stats`, { headers }),
    fetch(`${baseUrl}/api/dashboard/members`, { headers }),
    fetch(`${baseUrl}/api/dashboard/events`, { headers })
  ]);

  if (!statsRes.ok || !membersRes.ok || !eventsRes.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return {
    stats: await statsRes.json(),
    members: await membersRes.json(),
    events: await eventsRes.json()
  };
}

export default async function DashboardHome() {
  const { stats, members, events } = await getDashboardData();

  return (
    <div className="grid gap-6 animate-in fade-in duration-500">
      <div className="grid gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Ringkasan Keluarga</h1>
        <p className="text-muted-foreground italic">Selamat datang kembali! Berikut adalah ringkasan informasi keluarga Bani Harun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 lg:col-span-3">
          <StatsCard
            title="Total Anggota"
            value={stats.totalMembers}
            description="Anggota terdaftar"
            icon={Users}
            trend={{ value: 5, positive: true }}
          />
        </div>
        <div className="md:col-span-6 lg:col-span-3">
          <StatsCard
            title="Acara Mendatang"
            value={stats.upcomingEvents}
            description="Dalam 30 hari ke depan"
            icon={Calendar}
          />
        </div>
        <div className="md:col-span-6 lg:col-span-3">
          <StatsCard
            title="Total Dana"
            value={`Rp ${(stats.totalFunds / 1000000).toFixed(1)}M`}
            description="Kas warisan keluarga"
            icon={Wallet}
            trend={{ value: stats.growth, positive: stats.growth >= 0 }}
          />
        </div>
        <div className="md:col-span-6 lg:col-span-3">
          <StatsCard
            title="Rata-rata Kontribusi"
            value={`Rp ${(stats.monthlyContribution / 1000).toLocaleString()}k`}
            description="Per keluarga aktif"
            icon={TrendingUp}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 transition-all hover:translate-y-[-2px] duration-300">
          <RecentMembers members={members} />
        </div>
        <div className="lg:col-span-5 transition-all hover:translate-y-[-2px] duration-300">
          <EventSummary events={events} />
        </div>
      </div>
    </div>
  )
}
