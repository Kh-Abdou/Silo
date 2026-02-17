"use client"

import Link from "next/link"
import { useThemeTransition } from "@/components/theme-transition"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function LandingNavbar() {
    const { toggleTheme } = useThemeTransition()
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between bg-card/70 dark:bg-card/80 backdrop-blur-xl border border-border/50 dark:border-border px-6 py-2.5 rounded-full shadow-lg shadow-black/5 dark:shadow-black/20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-foreground">Silo</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                    <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {mounted && theme === "dark" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* CTA */}
                    <Link
                        href="/login"
                        className="bg-primary hover:brightness-110 text-primary-foreground px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-primary/10"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}
