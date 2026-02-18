import { ScrollReveal } from "./ScrollReveal"

export function BentoGrid() {
    return (
        <section id="features" className="px-6 py-24">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <ScrollReveal className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground tracking-tight">Engineered for Clarity</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to stop searching and start finding.</p>
                </ScrollReveal>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Universal Capture */}
                    <ScrollReveal>
                        <div className="rounded-2xl border border-border bg-card p-7 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 flex flex-col group relative overflow-hidden">
                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-2xl">bolt</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Universal Capture</h3>
                            <p className="text-[15px] leading-relaxed text-muted-foreground mb-6 flex-1">
                                Never lose a link again. Pull images, threads, PDFs, and random thoughts into one unified stream.
                            </p>

                            {/* Mini mockup */}
                            <div className="rounded-xl border border-border bg-background p-4 space-y-2.5 group-hover:border-primary/20 transition-colors shadow-sm">
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                    <div className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center">
                                        <span className="text-blue-500 text-[8px]">🔗</span>
                                    </div>
                                    <span className="truncate">twitter.com/elonmusk/...</span>
                                </div>
                                <div className="flex gap-1.5 pt-1">
                                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-blue-500/10 text-blue-500">Link</span>
                                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-purple-500/10 text-purple-500">Social</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 2: Contextual Tags */}
                    <ScrollReveal delay={1}>
                        <div className="rounded-2xl border border-border bg-card p-7 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 flex flex-col group relative overflow-hidden">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-2xl">sell</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Contextual Tags</h3>
                            <p className="text-[15px] leading-relaxed text-muted-foreground mb-6 flex-1">
                                Organize by the context of your work, not the rigidness of nested folders.
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-tight border border-blue-500/20 shadow-sm transition-all group-hover:bg-blue-500/20">#Research</span>
                                <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-tight border border-amber-500/20 shadow-sm transition-all group-hover:bg-amber-500/20">#Code</span>
                                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-tight border border-emerald-500/20 shadow-sm transition-all group-hover:bg-emerald-500/20">#Design</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 3: Total Freedom */}
                    <ScrollReveal delay={2}>
                        <div className="rounded-2xl border border-border bg-card p-7 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 flex flex-col group relative overflow-hidden">
                            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-2xl">file_download</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Total Freedom</h3>
                            <p className="text-[15px] leading-relaxed text-muted-foreground mb-6 flex-1">
                                Your data is yours forever. Export to JSON, Markdown, or ZIP at any time. No lock-in.
                            </p>

                            <div className="bg-background border border-border p-4 rounded-xl font-mono text-[10px] text-amber-600 dark:text-amber-400/70 group-hover:border-primary/20 transition-colors shadow-sm overflow-hidden">
                                {`{ "id": "0x8a2", "type": "brain_node", "data": [...] }`}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
