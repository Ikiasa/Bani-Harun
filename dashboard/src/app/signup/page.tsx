"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api-config"

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== passwordConfirmation) {
            setError("Konfirmasi password tidak cocok")
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                })
            })

            const data = await res.json()

            if (!res.ok) {
                // Formatting specific validation errors
                let errorText = data.message || "Pendaftaran gagal"
                if (data.errors) {
                    const firstErrorKey = Object.keys(data.errors)[0]
                    errorText = data.errors[firstErrorKey][0]
                }
                throw new Error(errorText)
            }

            // Save token securely in cookie
            document.cookie = `bh-auth-token=${data.token}; path=/; max-age=604800; samesite=strict`
            localStorage.setItem("bh-user", JSON.stringify(data.user))

            router.push("/")
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid items-center justify-center p-4 bg-background/50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

            <div className="w-full max-w-[450px]">
                <div className="bg-card/60 backdrop-blur-2xl border shadow-2xl rounded-3xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl grid place-items-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <span className="text-primary-foreground font-black text-xl">BH</span>
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Daftar Akun Keluarga</h1>
                            <p className="text-sm font-semibold text-muted-foreground mt-1">Bergabung dengan sistem informasi Bani Harun</p>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="grid gap-5">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold p-3 rounded-xl text-center animate-in shake-in">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                placeholder="Masukkan nama lengkap Anda"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Katasandi</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Konfirmasi</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full bg-background border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? "Memproses..." : "Daftar Akun Baru"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-primary/10 text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <p className="text-xs font-bold text-muted-foreground tracking-wide opacity-50">Sistem Registrasi • Bani Harun</p>
                </div>
            </div>
        </div>
    )
}
