"use client"

import { motion } from "framer-motion"
import { type ReactNode } from "react"

interface ScrollRevealProps {
    children: ReactNode
    delay?: number
    className?: string
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
                once: false, // Ensures it re-animates when scrolling back and forth
                margin: "-50px" // Slight buffer to ensure it starts when clearly visible
            }}
            transition={{
                duration: 0.8,
                delay: delay * 0.1,
                ease: [0.2, 0.8, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
