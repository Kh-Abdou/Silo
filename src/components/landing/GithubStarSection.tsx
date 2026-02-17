"use client"

import { Github, Star } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollReveal } from "./ScrollReveal"

export function GithubStarSection() {
    return (
        <section className="relative py-16 px-6 overflow-hidden">
            {/* Background Effects - Subtle for consistency */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <ScrollReveal className="text-center flex flex-col items-center">
                    {/* Floating GitHub Icon - Resized */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl relative group"
                    >
                        <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Github className="w-12 h-12 text-zinc-900 dark:text-white relative z-10" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight text-foreground">
                        Support the craft.
                    </h2>

                    <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                        Silo is a passion project built in public. If you dig the concept or the stack, drop a star on the repo. It keeps the momentum going.
                    </p>

                    {/* Standardized Button Design */}
                    <motion.a
                        href="https://github.com/Kh-Abdou/Silo"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Star Silo on GitHub"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:brightness-110"
                    >
                        <Star className="w-5 h-5 fill-primary-foreground/20 text-primary-foreground animate-pulse" />
                        Star us on GitHub
                        <div className="ml-2 px-2 py-0.5 bg-primary-foreground/10 rounded-md text-xs font-bold opacity-60 group-hover:opacity-100 transition-all">
                            v1.0.0
                        </div>
                    </motion.a>

                    <div className="mt-10 flex items-center gap-5 text-sm font-medium text-muted-foreground/60">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active Development
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex items-center gap-2">
                            <span>MIT Licensed</span>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
