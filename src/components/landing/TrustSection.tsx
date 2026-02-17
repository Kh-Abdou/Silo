"use client"

import Link from "next/link"
import { ScrollReveal } from "./ScrollReveal"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useTheme } from "next-themes"

function NextjsIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="28" height="28">
            <mask id="mask0_next" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                <circle cx="90" cy="90" r="90" fill="black" />
            </mask>
            <g mask="url(#mask0_next)">
                {/* Theme-aware background circle */}
                <circle cx="90" cy="90" r="90" className="fill-foreground dark:fill-white" />
                {/* The "N" path - high contrast against the circle */}
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" className="fill-background dark:fill-black" />
                <rect x="115" y="54" width="12" height="72" className="fill-background dark:fill-black" />
            </g>
        </svg>
    )
}

function SupabaseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
            <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supabase_a)" />
            <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supabase_b)" fillOpacity="0.2" />
            <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="currentColor" />
            <defs>
                <linearGradient id="supabase_a" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0.6" />
                    <stop offset="1" stopColor="currentColor" />
                </linearGradient>
                <linearGradient id="supabase_b" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

function TailwindIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 54 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="32" height="19">
            <path fillRule="evenodd" clipRule="evenodd" d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.02 7.26 26.46 8.73 28.06 10.36C30.66 13.01 33.69 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.48 8.94 41.04 7.47 39.44 5.84C36.84 3.19 33.81 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.52 23.46 12.96 24.93 14.56 26.56C17.16 29.21 20.19 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.98 25.14 27.54 23.67 25.94 22.04C23.34 19.39 20.31 16.2 13.5 16.2Z" fill="currentColor" />
        </svg>
    )
}

function TypeScriptIcon({ className }: { className?: string }) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && resolvedTheme === "dark"

    return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
            <rect width="400" height="400" rx="50" fill="currentColor" opacity={isDark ? 0.3 : 1} />
            <path d="M91.5 200V217.5H133V346H168V217.5H210V200.5C210 191.3 209.9 183.2 209.6 183.1C209.4 182.9 183.1 182.9 151 183L91.5 183.2V200Z" fill={isDark ? "currentColor" : "white"} />
            <path d="M287.8 183.2C296.2 185.4 303 189.8 308 196C310.6 199.4 314.8 205.8 315 207.2C315 207.7 304.2 214.8 297.8 218.6C297.5 218.8 296.2 217.3 294.7 215.2C290.4 209.3 286 206.8 279 206.4C269 205.8 262.5 211 262.5 219.6C262.5 222.3 262.9 224 264 226.3C266.2 231 270.4 233.8 282 238.8C303.3 248 312.3 254 318.5 263C325.5 273 327 289 322 301C316.5 314.2 305 322.4 289.4 325.4C284.5 326.4 272 326.6 266.8 325.8C255.3 324 244.4 319 237.2 311.8C234.2 308.6 228.4 300.6 228.8 300C229 299.8 229.8 299.2 230.6 298.6L239 293.2L245.6 289.1L248.2 292.6C251.8 297.6 258.8 303.4 262.8 305.2C274 310.2 288.8 309.2 295 303.2C297.8 300.2 298.8 297.6 298.8 293.4C298.8 289.6 298.4 288 296.6 285.2C294.2 281.6 289.2 278.4 276 272.6C260.8 265.8 254.4 261.8 248.4 255.4C244.8 251.4 241.8 245.6 240.4 240.2C239.2 235.6 239 223.6 240 218.8C243.4 203.4 255.8 192.2 272.6 188.8C277.6 187.8 283.2 182 287.8 183.2Z" fill={isDark ? "currentColor" : "white"} />
        </svg>
    )
}

interface TechItem {
    name: string
    Icon: React.FC<{ className?: string }>
    hoverColor: string
}

const techStack: TechItem[] = [
    { name: "Next.js", Icon: NextjsIcon, hoverColor: "var(--foreground)" },
    { name: "Supabase", Icon: SupabaseIcon, hoverColor: "#3ecf8e" },
    { name: "Tailwind", Icon: TailwindIcon, hoverColor: "#06b6d4" },
    { name: "TypeScript", Icon: TypeScriptIcon, hoverColor: "#3178c6" },
]

function TechBadge({ name, Icon, hoverColor }: TechItem) {
    const [hovered, setHovered] = useState(false)

    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
                scale: hovered ? 1.05 : 1,
                y: hovered ? -2 : 0
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-2.5 cursor-default group"
            style={{ color: hovered ? (hoverColor === "var(--foreground)" ? "hsl(var(--foreground))" : hoverColor) : undefined }}
        >
            <div className={`${hovered ? "opacity-100" : "opacity-40 dark:opacity-60"} text-inherit`}>
                <Icon className={hovered ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.2)]" : ""} />
            </div>
            <span className={`font-bold text-base ${hovered ? "opacity-100" : "opacity-40 dark:opacity-60"}`}>
                {name}
            </span>
        </motion.div>
    )
}

function MagnifyingCharacter({ char, mouseX, mouseY, parentRef, isHovering }: { char: string, mouseX: any, mouseY: any, parentRef: React.RefObject<HTMLElement>, isHovering: boolean }) {
    const charRef = useRef<HTMLSpanElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Spring physics for the character behavior
    const scale = useSpring(1, { stiffness: 450, damping: 30 })
    const y = useSpring(0, { stiffness: 450, damping: 30 })
    const strength = useSpring(0, { stiffness: 450, damping: 30 })

    const { resolvedTheme } = useTheme()

    // Reactive values for color and opacity
    const color = useTransform(
        strength,
        [0, 0.2, 1],
        mounted && resolvedTheme === "dark"
            ? ["rgb(113, 113, 122)", "rgb(161, 161, 170)", "rgb(161, 161, 170)"]
            : ["rgb(82, 82, 91)", "hsla(222, 30%, 40%, 0.85)", "hsla(222, 30%, 40%, 0.85)"]
    )

    const opacityTransform = useTransform(strength, [0, 0.1, 1], [0.6, 1, 1])

    useEffect(() => {
        const updateChar = () => {
            if (!charRef.current || !parentRef.current || !isHovering) {
                scale.set(1)
                y.set(0)
                strength.set(0)
                return
            }

            const rect = charRef.current.getBoundingClientRect()
            const parentRect = parentRef.current.getBoundingClientRect()

            const charCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            }

            const currentMouse = {
                x: mouseX.get() + parentRect.left,
                y: mouseY.get() + parentRect.top
            }

            const dist = Math.sqrt(
                Math.pow(currentMouse.x - charCenter.x, 2) +
                Math.pow(currentMouse.y - charCenter.y, 2)
            )

            // Interaction range
            const radius = 50

            if (dist < radius) {
                const s = 1 - dist / radius
                scale.set(1 + s * 0.25)
                y.set(-s * 8)
                strength.set(s)
            } else {
                scale.set(1)
                y.set(0)
                strength.set(0)
            }
        }

        const unsubscribeX = mouseX.on("change", updateChar)
        const unsubscribeY = mouseY.on("change", updateChar)

        if (!isHovering) updateChar()

        return () => {
            unsubscribeX()
            unsubscribeY()
        }
    }, [mouseX, mouseY, parentRef, scale, y, strength, isHovering])

    return (
        <motion.span
            ref={charRef}
            style={{
                scale: mounted ? scale : 1,
                y: mounted ? y : 0,
                display: "inline-block",
                padding: char === " " ? "0 0.15em" : "0",
            }}
            className="transition-colors duration-300"
        >
            <motion.span
                style={{
                    color: mounted ? color : "rgb(82, 82, 91)",
                    opacity: mounted ? opacityTransform : 0.6
                }}
            >
                {char}
            </motion.span>
        </motion.span>
    )
}

export function TrustSection() {
    const titleRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(-1000)
    const mouseY = useMotionValue(-1000)
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = titleRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
        if (!isHovering) setIsHovering(true)
    }, [mouseX, mouseY, isHovering])

    const titleText = "Built for developers, by developers"
    const characters = titleText.split("")

    return (
        <section className="px-6 py-24 border-t border-border overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal>
                    <div className="py-12 flex flex-col items-center">
                        {/* Title with Magnifying Glass Effect */}
                        <div
                            ref={titleRef}
                            className="relative mb-16 cursor-default group h-12 flex items-center justify-center pt-2"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => {
                                setIsHovering(false)
                                mouseX.set(-1000)
                                mouseY.set(-1000)
                            }}
                        >
                            <h2 className="relative z-10 text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.4em] text-foreground whitespace-nowrap flex select-none">
                                {characters.map((char, i) => (
                                    <MagnifyingCharacter
                                        key={i}
                                        char={char}
                                        mouseX={mouseX}
                                        mouseY={mouseY}
                                        parentRef={titleRef}
                                        isHovering={isHovering}
                                    />
                                ))}
                            </h2>
                        </div>

                        {/* Tech Stack Icons */}
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
                            {techStack.map((tech) => (
                                <TechBadge key={tech.name} {...tech} />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Footer */}
                <ScrollReveal className="mt-16">
                    <footer className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                    <path d="m3.3 7 8.7 5 8.7-5" />
                                    <path d="M12 22V12" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground/80 tracking-tight">SILO LABS © 2026</span>
                        </div>

                        <div className="flex gap-8">
                            <Link href="/privacy" className="hover:text-foreground transition-all">Privacy</Link>
                            <Link href="/terms" className="hover:text-foreground transition-all">Terms</Link>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href="https://github.com/Kh-Abdou/Silo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/60 hover:text-primary hover:bg-muted transition-all"
                                aria-label="GitHub"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </footer>
                </ScrollReveal>
            </div>
        </section>
    )
}
