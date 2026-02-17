"use client"

import * as React from "react"
import { getResources, getFilterData, deleteResources } from "@/app/actions"
import { DockView, FloatingDock } from "@/components/floating-dock"
import { MasonryGrid } from "@/components/masonry-grid"
import { useDevice } from "@/hooks/use-device"
import { MagicPaste } from "@/components/magic-paste"
import { GlobalDropZone } from "@/components/global-drop-zone"
import { ResourceCard } from "@/components/resource-card"
import { Resource } from "@/types/resource"
import { FilterBar } from "@/components/filter-bar"
import { Toaster } from "@/components/ui/sonner"
import { SettingsModal, SettingsTab } from "@/components/settings-modal"
import { UserDropdownMenu } from "@/components/user-dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Hourglass, Moon, Sun, Ghost, Search as SearchIcon, X, Trash2, Download, ArrowLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useDebounce } from "use-debounce"
import { useThemeTransition } from "@/components/theme-transition"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function HomeContent() {
    const { theme } = useTheme()
    const { toggleTheme } = useThemeTransition()
    const [authUser, setAuthUser] = React.useState<User | null>(null)
    const [mounted, setMounted] = React.useState(false)
    const [captureOpen, setCaptureOpen] = React.useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    React.useEffect(() => {
        setMounted(true)
        // Check for email change message
        if (searchParams.get("message") === "email_change_verify_next") {
            toast.success("Profile updated", {
                description: "Please check your new email to confirm the change.",
                duration: 10000,
            })
            // Remove the param
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("message")
            router.replace(`/dashboard?${newParams.toString()}`)
        }

        // Fetch Supabase user
        const fetchUser = async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()
            setAuthUser(data?.user || null)
        }
        fetchUser()
    }, [searchParams, router])

    const [activeView, setActiveView] = React.useState<DockView>("home")
    const [settingsModalOpen, setSettingsModalOpen] = React.useState(false)
    const [settingsModalTab, setSettingsModalTab] = React.useState<SettingsTab>("general")
    const [resources, setResources] = React.useState<Resource[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [debouncedSearch] = useDebounce(searchQuery, 300)

    const [activeTags, setActiveTags] = React.useState<string[]>([])
    const [activeTypes, setActiveTypes] = React.useState<string[]>([])
    const [availableFilters, setAvailableFilters] = React.useState<{ tags: string[], types: string[] }>({ tags: [], types: [] })

    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [isSelectionMode, setIsSelectionMode] = React.useState(false)

    const toggleSelect = (id: string) => {
        // Haptic feedback for "physical" click feel
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(15)
        }

        const isPresent = selectedIds.includes(id)
        const newSelection = isPresent
            ? selectedIds.filter(i => i !== id)
            : [...selectedIds, id]

        setSelectedIds(newSelection)
        setIsSelectionMode(newSelection.length > 0)
    }

    const handleSelectAll = () => {
        if (selectedIds.length === resources.length) {
            setSelectedIds([])
            setIsSelectionMode(false)
        } else {
            setSelectedIds(resources.map(r => r.id))
            setIsSelectionMode(true)
        }
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        handleBulkDeleteConfirm()
    }

    const handleBulkDeleteConfirm = async () => {
        const res = await deleteResources(selectedIds)
        if (res.success) {
            toast.success(`${selectedIds.length} resources deleted`)
            setSelectedIds([])
            setIsSelectionMode(false)
            fetchResources()
        }
    }

    const handleExportZip = async (selectedOnly: boolean) => {
        const exportList = selectedOnly
            ? resources.filter(r => selectedIds.includes(r.id))
            : resources;

        if (exportList.length === 0) {
            toast.error("No resources to export");
            return;
        }

        const exportToast = toast.loading("Generating ZIP archive...", {
            description: "Downloading files may take a moment.",
        });

        try {
            const { generateResourceZip } = await import("@/lib/export-utils");
            await generateResourceZip(exportList);
            toast.success("Export complete", {
                id: exportToast,
            });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Error generating ZIP archive", {
                id: exportToast,
            });
        }
    };

    const fetchResources = React.useCallback(async () => {
        setLoading(true)
        try {
            const [data, filters] = await Promise.all([
                getResources({
                    search: debouncedSearch,
                    types: activeTypes,
                    tags: activeTags
                }),
                getFilterData()
            ])
            const sanitized: Resource[] = data.map(res => ({
                id: res.id,
                title: res.title,
                type: res.type as any,
                url: res.url,
                fileUrl: res.fileUrl,
                content: res.content,
                userNote: res.userNote,
                description: res.description,
                imageUrl: res.imageUrl,
                tags: (res.tags || []).map(t => ({ name: t.name })),
                date: res.createdAt ? new Date(res.createdAt).toLocaleDateString() : "Recently",
                createdAt: res.createdAt,
                updatedAt: res.updatedAt
            }))
            setResources(sanitized)
            setAvailableFilters(filters)
        } catch (error) {
            console.error("Failed to fetch resources:", error)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, activeTypes, activeTags])

    React.useEffect(() => {
        fetchResources()
    }, [fetchResources])

    // Keydown for global search & escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (activeView !== "home") setActiveView("home")
                // Search escape handled in input onKeyDown
            }
            if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsSearchOpen(true)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeView])

    const [droppedFile, setDroppedFile] = React.useState<File | null>(null)
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const { isMobile } = useDevice()

    const handleGlobalDrop = (file: File) => {
        setDroppedFile(file)
        setCaptureOpen(true)
    }

    // Unified synchronization for Search & View states
    React.useEffect(() => {
        // 1. Sync activeView -> isSearchOpen
        if (activeView === "search") {
            if (!isSearchOpen) setIsSearchOpen(true)
        } else {
            if (isSearchOpen) setIsSearchOpen(false)
        }

        // 2. Focus search when open
        if (isSearchOpen) {
            // Small timeout to ensure DOM is ready
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [activeView, isSearchOpen])

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-500 bg-noise">
            <GlobalDropZone onDrop={handleGlobalDrop} />
            {/* Background Glows & Discrete Blobs */}
            <div className="fixed top-1/3 -left-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/3 -right-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />

            {/* Stellar Cluster: Dense, Small, Randomized Atmospheric Blobs */}
            {/* Light mode: white/gray blobs. Dark mode: lighter blue/purple blobs */}
            <div className="blob w-[180px] h-[180px] bg-slate-300/40 dark:bg-blue-400/25 top-[5%] left-[10%]" />
            <div className="blob w-[150px] h-[150px] bg-gray-200/50 dark:bg-indigo-400/20 top-[15%] right-[20%]" />
            <div className="blob w-[200px] h-[200px] bg-slate-200/45 dark:bg-purple-400/25 top-[40%] left-[30%]" />
            <div className="blob w-[160px] h-[160px] bg-gray-300/40 dark:bg-sky-400/20 top-[60%] right-[35%]" />
            <div className="blob w-[220px] h-[220px] bg-slate-100/50 dark:bg-blue-300/25 bottom-[10%] left-[15%]" />
            <div className="blob w-[140px] h-[140px] bg-white/60 dark:bg-indigo-300/20 bottom-[30%] right-[10%]" />
            <div className="blob w-[190px] h-[190px] bg-gray-100/50 dark:bg-violet-400/20 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
            <div className="blob w-[130px] h-[130px] bg-slate-200/40 dark:bg-cyan-400/20 top-[25%] left-[60%]" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[50] bg-background/80 backdrop-blur-xl border-b border-border transition-all">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-1.5 rounded-lg border border-border hover:bg-accent transition-all text-muted-foreground group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-2 group cursor-pointer shrink-0" onClick={() => setActiveView("home")}>
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                                <Hourglass className="text-primary-foreground w-4 h-4" />
                            </div>
                            <span className="hidden md:block text-lg font-bold tracking-tight text-foreground uppercase">SILO</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">

                        <div className="w-px h-6 bg-border mx-1" />

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all text-muted-foreground"
                        >
                            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                        </button>
                        {/* Avatar: Hidden on mobile, visible on desktop */}
                        <div className="hidden md:flex">
                            <UserDropdownMenu
                                user={authUser}
                                direction="down"
                                onOpenSettings={(tab) => {
                                    setSettingsModalTab(tab)
                                    setSettingsModalOpen(true)
                                }}
                            >
                                <button className="w-9 h-9 rounded-full bg-muted border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
                                    <img
                                        src={authUser?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.email || 'DefaultUser'}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            </UserDropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subtle Collapsible Filter Bar - Now only visible when "Filter" is selected in Dock */}
            <AnimatePresence>
                {activeView === "filter" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-20 left-0 right-0 z-[110] transition-all w-full pointer-events-none"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center">
                            <div className="pointer-events-auto bg-background/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-2 shadow-2xl group">
                                <FilterBar
                                    types={availableFilters.types}
                                    tags={availableFilters.tags}
                                    activeTypes={activeTypes}
                                    activeTags={activeTags}
                                    onTypeSelect={(type) => {
                                        setActiveTypes(prev =>
                                            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                                        )
                                    }}
                                    onTagSelect={(tag) => {
                                        setActiveTags(prev =>
                                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                        )
                                    }}
                                    onClearAll={() => { setActiveTypes([]); setActiveTags([]); }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spotlight Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center pb-32 px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="w-full max-w-lg bg-background/90 backdrop-blur-2xl rounded-xl border border-border shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    className="bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground w-full"
                                    placeholder="Jump to memory..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setIsSearchOpen(false)
                                            setSearchQuery("")
                                            e.currentTarget.blur()
                                        }
                                    }}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-accent rounded-full transition-colors">
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                            <div className="px-4 py-2 bg-muted/50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted/50 rounded-lg border border-border animate-pulse">
                                    Search everywhere
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-muted-foreground font-mono opacity-50">
                                        <kbd className="font-sans px-1 text-[9px]">ESC</kbd> to close
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="fixed inset-0 z-[-1] bg-black/5 dark:bg-black/20 pointer-events-auto backdrop-blur-[2px]"
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className={cn(
                "pt-32 pb-32 px-4 max-w-6xl mx-auto w-full min-h-screen transition-all duration-500 relative z-[10]"
            )}>
                <AnimatePresence mode="wait">
                    {(mounted &&
                        <motion.div
                            key="grid-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {(resources.length > 0 || loading) ? (
                                <MasonryGrid>
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {resources.map(res => (
                                            <motion.div
                                                key={res.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, pointerEvents: "none" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ResourceCard
                                                    resource={res}
                                                    onDelete={() => fetchResources()}
                                                    onUpdate={() => fetchResources()}
                                                    selectionMode={isSelectionMode}
                                                    isSelected={selectedIds.includes(res.id)}
                                                    onSelect={toggleSelect}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </MasonryGrid>
                            ) : !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-32 text-center"
                                >
                                    <div className="w-20 h-20 bg-card rounded-xl flex items-center justify-center mb-6 border border-border shadow-inner">
                                        <Ghost className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground uppercase">
                                        {searchQuery || activeTypes.length > 0 || activeTags.length > 0 ? "Result not found" : "Your vault is empty"}
                                    </h2>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8 font-medium">
                                        {searchQuery || activeTypes.length > 0 || activeTags.length > 0
                                            ? "Try adjusting your search or filters to find what you're looking for."
                                            : "Capture your first memory to see it here."}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selection Floating Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 50, opacity: 0, x: "-50%" }}
                        animate={{ y: 0, opacity: 1, x: "-50%" }}
                        exit={{ y: 50, opacity: 0, x: "-50%" }}
                        className={cn(
                            "fixed bottom-28 left-1/2 z-[60] bg-background/60 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl flex items-center text-foreground transition-all duration-300",
                            isMobile ? "px-3 py-2 gap-3 min-w-[90vw] max-w-[95vw] flex-wrap justify-center overflow-hidden" : "px-6 py-4 gap-6 min-w-[320px]"
                        )}
                    >
                        <div className="flex flex-col shrink-0">
                            <span className="text-xs font-bold">{selectedIds.length} Selected</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none">Resources</span>
                        </div>

                        <div className="h-8 w-px bg-border mx-1 shrink-0" />

                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            <button
                                onClick={handleSelectAll}
                                className="text-[10px] md:text-xs font-bold hover:text-primary transition-colors whitespace-nowrap"
                            >
                                {selectedIds.length === resources.length ? "Deselect All" : "Select All"}
                            </button>
                            <button
                                onClick={() => { setSelectedIds([]); setIsSelectionMode(false); }}
                                className="text-[10px] md:text-xs font-bold hover:text-destructive transition-colors whitespace-nowrap"
                            >
                                Cancel
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleExportZip(true)}
                                    className="bg-primary hover:bg-primary/90 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold flex items-center gap-2 transition-all shadow-lg text-primary-foreground whitespace-nowrap"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span className={isMobile ? "hidden sm:inline" : "inline"}>Export</span>
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-destructive hover:bg-destructive/90 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold flex items-center gap-2 transition-all shadow-lg text-white whitespace-nowrap"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className={isMobile ? "hidden sm:inline" : "inline"}>Delete</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FloatingDock
                onCapture={() => setCaptureOpen(true)}
                activeView={activeView}
                onViewChange={setActiveView}
                user={authUser}
                onOpenSettings={(tab) => {
                    setSettingsModalTab(tab)
                    setSettingsModalOpen(true)
                }}
            />

            <SettingsModal
                open={settingsModalOpen}
                onOpenChange={setSettingsModalOpen}
                initialTab={settingsModalTab}
                user={authUser}
                onExportZip={() => handleExportZip(false)}
            />


            <AnimatePresence>
                {captureOpen && (
                    <MagicPaste
                        open={captureOpen}
                        onOpenChange={(open) => {
                            setCaptureOpen(open)
                            if (!open) setDroppedFile(null)
                        }}
                        onSuccess={() => fetchResources()}
                        initialFile={droppedFile}
                    />
                )}
            </AnimatePresence>

            <Toaster />
        </main>
    )
}

export default function Home() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Hourglass className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse text-sm font-medium uppercase tracking-widest">Initializing Vault...</p>
            </div>
        }>
            <HomeContent />
        </React.Suspense>
    )
}


