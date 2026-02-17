import Link from "next/link"
import { ScrollReveal } from "./ScrollReveal"

export function HeroSection() {
    return (
        <section className="relative pt-40 pb-20 px-6 min-h-[85vh] flex flex-col items-center justify-center text-center">
            {/* Radial Glow Background */}
            <div className="absolute inset-0 glow-bg pointer-events-none" />

            <ScrollReveal className="max-w-4xl mx-auto relative z-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        Open Source & Free
                    </div>

                    <a
                        href="https://github.com/Kh-Abdou/Silo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Star on GitHub
                    </a>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground">
                    Your Digital
                    <br />
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Second Brain.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Capture, organize, and retrieve everything instantly. Silo turns your scattered
                    digital breadcrumbs into a structured universe of thought. <span className="text-foreground font-medium">Frictionless.</span>
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-7 py-3.5 bg-primary rounded-xl font-bold text-base text-primary-foreground hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                    >
                        Get Started for Free
                    </Link>
                    <a
                        href="#showcase"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base border border-border hover:bg-accent transition-all flex items-center justify-center gap-2 text-foreground"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                        Watch Demo
                    </a>
                </div>
            </ScrollReveal>
        </section>
    )
}
