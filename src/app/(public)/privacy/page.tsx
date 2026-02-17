"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, ArrowLeft, Lock, Eye, Database, Globe, Mail, Info } from "lucide-react"

export default function PrivacyPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 bg-noise text-pretty">
            {/* Atmospheric Background components */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    href="/"
                    aria-label="Back to home page"
                    className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-all text-muted-foreground flex items-center justify-center group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-all text-muted-foreground"
                >
                    {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                </button>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 sm:py-32">
                {/* Header */}
                <div className="flex flex-col items-center mb-16">
                    <Link href="/" className="mb-8 flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-4">Privacy Policy</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-widest">
                        <span>Last Updated</span>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span>February 2026</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12 prose prose-invert max-w-none">
                    {/* TL;DR Section */}
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary font-bold tracking-tight uppercase text-xs">
                            <Info className="w-4 h-4" />
                            <span>In Brief (TL;DR)</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed m-0">
                            We value your privacy. We only collect essential data (email), use secure OAuth login methods,
                            isolate your data with Supabase RLS, and offer full data deletion. No marketing trackers or selling of data.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Eye className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">1. Privacy-First Philosophy</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            At Silo, your privacy is not an option; it is the core of the project.
                            We minimize data collection to the absolute strict necessity to make
                            your &quot;Second Brain&quot; work.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Lock className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">2. Information Collected & OAuth</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            We collect your email address for account creation.
                            When you use **Google or GitHub OAuth**, Silo **never** receives your third-party password.
                            We only receive a secure authentication token and your public profile information (name, email).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Database className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">3. Technical Security (RLS)</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is protected by a robust architecture. We use Supabase **Row Level Security (RLS)**,
                            ensuring that at the database's physical level, your information is completely isolated
                            and accessible only via your own identity.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Mail className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">4. Transactional Emails</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Silo may send you emails for **security reasons only**: password resets,
                            MFA configuration, or suspicious login alerts. These emails are not used for marketing purposes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Globe className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">5. Retention & Deletion</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is only kept as long as your account is active. You have the right to request
                            full and immediate deletion of your account and all associated data via the application settings.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-border/50 pt-12 text-center">
                        <p className="text-xs text-muted-foreground italic">
                            Your trust is the foundation of Silo. We never sell your data.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
