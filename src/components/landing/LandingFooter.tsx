"use client"

import Link from "next/link"
import { ScrollReveal } from "./ScrollReveal"

export function LandingFooter() {
    return (
        <section className="px-6 pb-12 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal>
                    <footer className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm font-medium">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                    <path d="m3.3 7 8.7 5 8.7-5" />
                                    <path d="M12 22V12" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground/80 tracking-tight">© 2026 Silo. Built by Kh-Abdou</span>
                        </div>

                        <div className="flex gap-6 md:gap-8">
                            <Link href="/privacy" className="hover:text-foreground transition-all">Privacy</Link>
                            <Link href="/terms" className="hover:text-foreground transition-all">Terms</Link>
                        </div>
                    </footer>
                </ScrollReveal>
            </div>
        </section>
    )
}
