"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterBarProps {
    types: string[]
    tags: string[]
    activeTypes: string[]
    activeTags: string[]
    onTypeSelect: (type: string) => void
    onTagSelect: (tag: string) => void
    onClearAll: () => void
}

export function FilterBar({
    types,
    tags,
    activeTypes,
    activeTags,
    onTypeSelect,
    onTagSelect,
    onClearAll
}: FilterBarProps) {
    const hasActiveFilters = activeTypes.length > 0 || activeTags.length > 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2"
        >
            <div className="flex items-center gap-2">
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeSelect(type)}
                        className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold transition-all border shrink-0 uppercase tracking-tight",
                            activeTypes.includes(type)
                                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
                        )}
                    >
                        {type.charAt(0) + type.slice(1).toLowerCase()}s
                    </button>
                ))}
            </div>

            <div className="w-[1px] h-3 bg-border shrink-0" />

            <div className="flex items-center gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => onTagSelect(tag)}
                        className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold transition-all border shrink-0 lowercase tracking-tight",
                            activeTags.includes(tag)
                                ? "bg-foreground text-background border-foreground shadow-sm"
                                : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
                        )}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {hasActiveFilters && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-destructive hover:text-destructive/80 transition-colors uppercase tracking-widest shrink-0 ml-2"
                >
                    <X className="w-2.5 h-2.5" />
                    Reset
                </button>
            )}
        </motion.div>
    )
}
