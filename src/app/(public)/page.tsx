"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { DemoSection } from "@/components/landing/DemoSection"
import { BentoGrid } from "@/components/landing/BentoGrid"
import { WorkflowSection } from "@/components/landing/WorkflowSection"
import { GithubStarSection } from "@/components/landing/GithubStarSection"
import { TrustSection } from "@/components/landing/TrustSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            {/* Global Background Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-soft-light" />
            </div>

            {/* Noise Texture */}
            <div className="fixed inset-0 bg-noise pointer-events-none z-[1]" />

            {/* Navigation */}
            <LandingNavbar />

            {/* Page Content */}
            <main className="relative z-10">
                <HeroSection />
                <DemoSection />
                <BentoGrid />
                <WorkflowSection />
                <TrustSection />
                <GithubStarSection />
            </main>

            <LandingFooter />
        </div>
    )
}
