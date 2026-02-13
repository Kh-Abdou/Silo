"use client"

import dynamic from "next/dynamic"
import { ScrollReveal } from "./ScrollReveal"
import { SiloVideo } from "@/remotion/SiloVideo"

// Dynamic import for Remotion Player to avoid SSR issues
const Player = dynamic(() => import("@remotion/player").then((mod) => mod.Player), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-black/20 flex items-center justify-center animate-pulse">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <span className="text-xs font-bold tracking-widest text-primary/40 uppercase">Loading Narrative...</span>
            </div>
        </div>
    )
})

export function DemoSection() {
    // 6 scenes, 5 fade transitions of 15 frames each
    // Total: 975 frames ≈ 32.5s (Matches Root.tsx)
    const TOTAL_FRAMES = 975;

    return (
        <section id="showcase" className="px-6 py-24">
            <ScrollReveal className="max-w-4xl mx-auto">
                <div className="relative p-1 rounded-2xl border border-border dark:border-border bg-background shadow-2xl shadow-primary/10 dark:shadow-primary/10 transition-all duration-700 hover:shadow-primary/20 group flex flex-col items-center">
                    {/* Shadow Enhancement for Light Mode */}
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.25)] dark:hidden pointer-events-none" />

                    {/* Floating Glow Behind */}
                    <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-[5rem] -z-10 opacity-30 dark:opacity-50 group-hover:opacity-60 dark:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="aspect-video w-full bg-black/5 dark:bg-black rounded-xl overflow-hidden relative group cursor-pointer border border-border">
                        {/* High-End Remotion Player */}
                        <Player
                            component={SiloVideo as any}
                            inputProps={{}}
                            durationInFrames={TOTAL_FRAMES}
                            fps={30}
                            compositionWidth={1920}
                            compositionHeight={1080}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            controls
                            autoPlay
                            loop
                            initiallyMuted
                        />

                        {/* Top reflection effect */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent pointer-events-none" />

                        {/* Internal Gradient overlay (subtle) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] dark:from-white/[0.01] via-transparent to-primary/[0.01] group-hover:opacity-60 transition-opacity pointer-events-none" />

                        {/* Label */}
                        <div className="absolute bottom-5 left-5">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-20 pointer-events-none text-white">Feature Narrative v1.0</span>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    )
}
