"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search as SearchIcon, X } from "lucide-react"

interface SearchBarProps {
    value: string
    onChange: (val: string) => void
    onClose: () => void
}

export function SearchBar({ value, onChange, onClose }: SearchBarProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[100] pointer-events-none">
            <motion.div
                initial={{ y: -20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto w-full bg-background/80 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="relative flex items-center p-4">
                    <SearchIcon className="absolute left-6 text-muted-foreground w-6 h-6" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search your memory..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && onClose()}
                        className="w-full bg-transparent pl-14 pr-12 py-2 text-xl text-foreground focus:outline-none placeholder:text-muted-foreground"
                    />
                    <button
                        onClick={onClose}
                        className="absolute right-6 p-1 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors group"
                    >
                        <X className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </button>
                </div>

                {/* Subtle bottom gradient/line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </motion.div>
        </div>
    )
}
