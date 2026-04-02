"use client"

import { useState, useEffect } from "react"
import { Save, User as UserIcon, Lock, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    useEffect(() => {
        // Load existing user info from localStorage (saved during login)
        const user = localStorage.getItem("bh-user")
        if (user) {
            const parsed = JSON.parse(user)
            setName(parsed.name || "")
            setEmail(parsed.email || "")
        }
    }, [])

    const getAuthToken = () => {
        const match = document.cookie.match(new RegExp('(^| )bh-auth-token=([^;]+)'))
        return match ? match[2] : null
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: "", text: "" })

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok!" })
            return
        }

        setLoading(true)
        const token = getAuthToken()

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/settings/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                let errorText = data.message || "Gagal menyimpan pengaturan."
                if (data.errors) {
                    const firstErrorKey = Object.keys(data.errors)[0]
                    errorText = data.errors[firstErrorKey][0]
                }
                throw new Error(errorText)
            }

            setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" })
            localStorage.setItem("bh-user", JSON.stringify(data.user))

            // Clear password fields
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err: any) {
            setMessage({ type: "error", text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 max-w-4xl animate-in fade-in duration-500">
            <div className="grid gap-3">
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
                <p className="text-muted-foreground italic">
                    Kelola profil, email, dan kunci sandi untuk mengakses dashboard admin.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Profil Section */}
                <div className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Identitas Admin</h2>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Nama Pengguna</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Alamat Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Keamanan Section */}
                <div className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Keamanan (Password)</h2>
                    </div>

                    <p className="text-xs text-muted-foreground -mt-3">
                        Kosongkan bagian ini jika Anda tidak ingin mengubah password saat ini.
                    </p>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold opacity-70">Password Saat Ini</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-background border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                placeholder="Diperlukan jika mengubah password"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Password Baru</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-background border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                placeholder="Minimal 8 karakter"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-background border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                placeholder="Ketik ulang password baru"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-6 justify-between border-t pt-8 mt-4">
                    <div className="w-full">
                        {message.text && (
                            <div className={`px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : null}
                                <span className="text-sm font-bold">{message.text}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    )
}
