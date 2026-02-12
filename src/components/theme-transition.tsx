"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef, createContext, useContext } from "react"

const ThemeTransitionContext = createContext<{
    toggleTheme: (e: React.MouseEvent) => void
}>({ toggleTheme: () => { } })

export const useThemeTransition = () => useContext(ThemeTransitionContext)

export function ThemeTransition({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    // Default to center if no click
    const [coords, setCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const lastTheme = useRef(theme)

    useEffect(() => {
        setMounted(true)
        // Initial center fallback
        if (typeof window !== 'undefined') {
            setCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
        }
    }, [])

    useEffect(() => {
        if (!mounted || theme === lastTheme.current) return

        setIsAnimating(true)
        lastTheme.current = theme
        const timer = setTimeout(() => setIsAnimating(false), 1000)
        return () => clearTimeout(timer)
    }, [theme, mounted])

    const toggleTheme = (e: React.MouseEvent) => {
        setCoords({ x: e.clientX, y: e.clientY })
        setTheme(theme === "dark" ? "light" : "dark")
    }

    if (!mounted) return <>{children}</>

    return (
        <ThemeTransitionContext.Provider value={{ toggleTheme }}>
            <div className="relative isolate min-h-screen">
                {children}
                <AnimatePresence>
                    {isAnimating && (
                        <motion.div
                            key="transition-overlay"
                            initial={{ clipPath: `circle(0% at ${coords.x}px ${coords.y}px)`, opacity: 1 }}
                            animate={{ clipPath: `circle(150% at ${coords.x}px ${coords.y}px)`, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.22, 1, 0.36, 1], // Custom slow-out easing
                            }}
                            className="fixed inset-0 z-[9999] pointer-events-none bg-background"
                        />
                    )}
                </AnimatePresence>
            </div>
        </ThemeTransitionContext.Provider>
    )
}
