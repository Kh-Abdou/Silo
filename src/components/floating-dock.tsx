
"use client"
import { motion } from "framer-motion"
import { Search, Home, Plus, SlidersHorizontal, Network, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { UserDropdownMenu, SettingsTab } from "@/components/user-dropdown-menu"
import type { User } from "@supabase/supabase-js"

export type DockView = "home" | "search" | "filter"

interface FloatingDockProps {
    onCapture: () => void
    activeView: DockView
    onViewChange: (view: DockView) => void
    user?: User | null
    onOpenSettings?: (tab: SettingsTab) => void
}

export function FloatingDock({ onCapture, activeView, onViewChange, user, onOpenSettings }: FloatingDockProps) {
    const handleViewChange = (view: DockView) => {
        if (activeView === view) {
            onViewChange("home")
        } else {
            onViewChange(view)
        }
    }

    const getAvatarSrc = () => {
        if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'DefaultUser'}`
    }

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "flex items-center p-2 rounded-[2rem] gap-1 shadow-floating transition-all duration-500",
                    "bg-background/80 backdrop-blur-2xl border border-border",
                    "before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-b before:from-background/10 before:to-transparent before:pointer-events-none"
                )}
            >
                <DockItem
                    icon={Home}
                    label="Home"
                    active={activeView === "home"}
                    onClick={() => onViewChange("home")}
                />
                <DockItem
                    icon={Search}
                    label="Search"
                    active={activeView === "search"}
                    onClick={() => handleViewChange("search")}
                />

                <div className="mx-2 w-px h-6 bg-zinc-200/50 dark:bg-zinc-700/50" />

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCapture}
                    className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-primary/90 relative overflow-hidden group"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Capture</span>
                </motion.button>

                <div className="mx-2 w-px h-6 bg-zinc-200/50 dark:bg-zinc-700/50" />

                <DockItem
                    icon={SlidersHorizontal}
                    label="Filter"
                    active={activeView === "filter"}
                    onClick={() => handleViewChange("filter")}
                />

                {/* 5th Slot: Responsive */}
                {/* Mobile: Avatar with Drop-up Menu */}
                <div className="block md:hidden">
                    <UserDropdownMenu
                        user={user || null}
                        direction="up"
                        onOpenSettings={onOpenSettings || (() => { })}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-full flex items-center justify-center"
                        >
                            <div className="w-9 h-9 rounded-full bg-muted border border-border overflow-hidden hover:border-primary/50 transition-all">
                                <img
                                    src={getAvatarSrc()}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.button>
                    </UserDropdownMenu>
                </div>

                {/* Desktop: Graph View Icon */}
                <div className="hidden md:block">
                    <DockItem
                        icon={Network}
                        label="Graph View"
                        onClick={() => toast.info("Graph View - Coming Soon", { description: "Visualisez vos connexions bientôt" })}
                    />
                </div>
            </motion.nav>
        </div>
    )
}

function DockItem({
    icon: Icon,
    label,
    active = false,
    onClick
}: {
    icon: LucideIcon,
    label: string,
    active?: boolean,
    onClick: () => void
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn(
                "p-3 rounded-2xl flex items-center justify-center transition-all relative overflow-hidden",
                active
                    ? "text-primary-foreground bg-primary shadow-inner"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
            )}
            title={label}
        >
            <Icon className="w-5 h-5" />
        </motion.button>
    )
}
