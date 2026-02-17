"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, ArrowLeft, Shield, Scale, Info, CheckCircle, Database } from "lucide-react"

export default function TermsPage() {
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
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
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
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-4">Terms of Service</h1>
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
                            Your data belongs to you. We secure it with modern technologies (MFA, RLS),
                            and you can export it yourself at any time. As a user, you are responsible
                            for keeping your security codes safe.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Scale className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing and using Silo (the &quot;Service&quot;), you agree to be bound by these Terms.
                            If you do not agree, please do not use the Service. This project is currently in a **Beta/Student** phase.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">2. Beta Clause & Availability</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Silo is a work in progress. While we do our best to ensure stability,
                            we do not guarantee that the Service will be uninterrupted or error-free. Structural changes
                            may occur; we encourage regular use of the **Smart Export** feature.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">3. Security & 2FA Responsibility</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Protecting your &quot;Second Brain&quot; is a priority. We offer multi-factor authentication (2FA).
                            **It is your sole responsibility to keep your recovery codes in a safe place.**
                            If you lose both your 2FA device and your recovery codes, access to your data may
                            be permanently compromised as a security measure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground font-semibold">
                            <Database className="w-5 h-5 text-primary" />
                            <h2 className="text-xl m-0">4. Data Ownership & Export</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Silo is committed to total data portability. You retain full ownership of everything
                            you upload. We guarantee no &quot;Vendor Lock-in&quot;: you can export your knowledge
                            in open formats (JSON/ZIP) at any time.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-border/50 pt-12 text-center">
                        <p className="text-xs text-muted-foreground italic">
                            Silo strives to provide a clean, minimalist, and distraction-free environment for your productivity.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
