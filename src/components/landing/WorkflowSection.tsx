"use client"

import { ScrollReveal } from "./ScrollReveal"

interface StepProps {
    number: number
    title: string
    description: string
    icon: React.ReactNode
    visual: React.ReactNode
}

function StepBadge({ number }: { number: number }) {
    return (
        <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-[0_0_10px_rgba(59,130,246,0.1)] backdrop-blur-sm">
            {number}
        </div>
    )
}

function WorkflowStep({ number, title, description, icon, visual }: StepProps) {
    return (
        <div className="flex flex-col items-center text-center group relative">
            <div className="w-full aspect-square max-w-[280px] mb-8 relative flex items-center justify-center">
                {/* Background Card */}
                <div className="absolute inset-0 bg-white dark:bg-primary/5 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm group-hover:shadow-md dark:shadow-none dark:group-hover:border-primary/30 transition-all duration-500" />

                {/* Floating Icon Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-primary shadow-sm dark:shadow-xl z-20 backdrop-blur-md">
                    {icon}
                </div>

                {/* Main Visual Content */}
                {visual}
            </div>

            <div className="flex items-center gap-3 mb-2">
                <StepBadge number={number} />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-muted-foreground px-4 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

export function WorkflowSection() {
    return (
        <section id="workflow" className="px-6 py-24 relative overflow-hidden bg-zinc-50/50 dark:bg-transparent">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <ScrollReveal className="text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-900 dark:text-foreground tracking-tight">The Workflow</h2>
                    <p className="text-zinc-600 dark:text-muted-foreground max-w-lg mx-auto">
                        From raw chaos to structured insight in three seamless steps.
                    </p>
                </ScrollReveal>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">

                    {/* Step 1: Capture */}
                    <ScrollReveal delay={0}>
                        <WorkflowStep
                            number={1}
                            title="Capture"
                            description="Drop links, PDFs, and notes into one place. Your central inbox for digital chaos, available on any device."
                            icon={<span className="material-symbols-outlined notranslate" translate="no">add_circle</span>}
                            visual={
                                <div className="relative w-48 h-48 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center bg-zinc-50 dark:bg-white/[0.02] z-10">
                                    <span className="material-symbols-outlined text-zinc-200 dark:text-white/10 text-4xl mb-2 notranslate" translate="no">cloud_upload</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 dark:text-white/20">Drop anything</span>

                                    {/* Floating Social Icons */}
                                    <div className="absolute -top-6 -right-6 w-10 h-10 bg-white/[0.05] dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center animate-landing-float shadow-lg backdrop-blur-md" style={{ animationDelay: "0s" }}>
                                        <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-1/2 -left-8 w-10 h-10 bg-white/[0.05] dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center animate-landing-float shadow-lg backdrop-blur-md" style={{ animationDelay: "2s" }}>
                                        <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-4 -right-4 w-10 h-10 bg-white/[0.05] dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center animate-landing-float shadow-lg backdrop-blur-md" style={{ animationDelay: "4s" }}>
                                        <span className="material-symbols-outlined text-red-500 notranslate" translate="no">picture_as_pdf</span>
                                    </div>
                                </div>
                            }
                        />
                    </ScrollReveal>

                    {/* Step 2: Tag & Sync */}
                    <ScrollReveal delay={1}>
                        <WorkflowStep
                            number={2}
                            title="Tag & Sync"
                            description="Stop wrestling with folders. Assign flexible tags and watch your notes sync."
                            icon={<span className="material-symbols-outlined notranslate" translate="no">tag</span>}
                            visual={
                                <div className="relative w-full h-full p-8 flex flex-col items-center justify-center z-10">
                                    <div className="w-20 h-24 bg-card dark:bg-zinc-800 rounded-lg border border-border dark:border-white/10 flex flex-col items-center justify-center gap-2 overflow-hidden shadow-2xl relative z-10">
                                        <span className="material-symbols-outlined text-muted-foreground/20 dark:text-white/20 text-3xl notranslate" translate="no">description</span>
                                        <div className="w-10 h-1 bg-muted dark:bg-white/10 rounded-full" />
                                        <div className="w-12 h-1 bg-muted dark:bg-white/10 rounded-full" />
                                    </div>

                                    {/* Floating Tags */}
                                    <div className="absolute top-16 left-6 animate-landing-float z-20" style={{ animationDelay: "0.5s" }}>
                                        <span className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 shadow-lg backdrop-blur-sm notranslate" translate="no">#Dev</span>
                                    </div>
                                    <div className="absolute bottom-20 right-4 animate-landing-float z-20" style={{ animationDelay: "2.5s" }}>
                                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 shadow-lg backdrop-blur-sm notranslate" translate="no">#Ideas</span>
                                    </div>
                                    <div className="absolute bottom-12 left-10 animate-landing-float z-20" style={{ animationDelay: "4.5s" }}>
                                        <span className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 shadow-lg backdrop-blur-sm notranslate" translate="no">#React</span>
                                    </div>
                                </div>
                            }
                        />
                    </ScrollReveal>

                    {/* Step 3: Find or Export */}
                    <ScrollReveal delay={2}>
                        <WorkflowStep
                            number={3}
                            title="Find or Export"
                            description="Retrieve ideas with a simple filter. Or take them with you. No lock-in."
                            icon={<span className="material-symbols-outlined notranslate" translate="no">manage_search</span>}
                            visual={
                                <div className="w-[85%] space-y-4 relative z-10">
                                    {/* Search Bar Visual */}
                                    <div className="bg-card dark:bg-[#0A0C10] rounded-xl border border-border dark:border-white/10 shadow-2xl p-3 flex items-center gap-2 transition-transform duration-500 group-hover:-translate-y-1">
                                        <span className="material-symbols-outlined text-muted-foreground/40 dark:text-white/40 text-sm notranslate" translate="no">search</span>
                                        <div className="flex-1 text-[10px] text-muted-foreground/30 dark:text-white/30 font-sans text-left">Search anything...</div>
                                    </div>

                                    {/* Action Buttons Visual */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center gap-1.5 transition-all group-hover:bg-white/10 shadow-sm">
                                            <span className="material-symbols-outlined text-[14px] text-white/60 notranslate" translate="no">filter_list</span>
                                            <span className="text-[9px] font-bold text-white/60 uppercase tracking-tighter">Filter</span>
                                        </div>
                                        <div className="bg-primary/20 border border-primary/30 rounded-lg p-2 flex items-center justify-center gap-1.5 transition-all group-hover:bg-primary/30">
                                            <span className="material-symbols-outlined text-[14px] text-primary notranslate" translate="no">download</span>
                                            <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Export</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </ScrollReveal>

                </div>
            </div>
        </section>
    )
}
