"use client"

import { Github, Star } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollReveal } from "./ScrollReveal"

export function GithubStarSection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <ScrollReveal className="text-center flex flex-col items-center">
                    {/* Floating GitHub Icon */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Github className="w-16 h-16 text-zinc-900 dark:text-white relative z-10" />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground">
                        Loved by developers.
                        <br />
                        <span className="text-primary italic">Open for everyone.</span>
                    </h2>

                    <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                        Silo is built in the open. Join our community of developers and help us build the ultimate digital second brain.
                    </p>

                    {/* Massive Star Button */}
                    <motion.a
                        href="https://github.com/Kh-Abdou/Silo"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Star Silo on GitHub"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center gap-4 px-10 py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:shadow-primary/20"
                    >
                        <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 animate-pulse" />
                        Star us on GitHub
                        <div className="ml-2 px-3 py-1 bg-white/10 dark:bg-black/10 rounded-lg text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
                            v1.0.0
                        </div>

                        {/* Button Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </motion.a>

                    <div className="mt-12 flex items-center gap-6 text-sm font-medium text-muted-foreground/60">
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
