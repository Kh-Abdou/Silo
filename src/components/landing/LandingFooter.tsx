"use client"

import Link from "next/link"
import { ScrollReveal } from "./ScrollReveal"
import { Hourglass } from "lucide-react"

export function LandingFooter() {
    return (
        <section className="px-6 pb-12 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal>
                    <footer className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm font-medium">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                                <Hourglass className="w-4 h-4 text-muted-foreground" />
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
