"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    FileText, Trash2, ExternalLink, Download as DownloadIcon,
    Copy, Edit2, Share2, FileArchive, Globe, MessageSquare, FileCode,
    FileVideo, FileAudio, FileImage, CheckCircle2, MoreHorizontal
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { deleteResource } from "@/app/actions"
import { toast } from "sonner"
import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditResourceDialog } from "@/components/edit-resource-dialog"
import { Resource } from "@/types/resource"
import { useSmartShare } from "@/hooks/use-smart-share"
import { useDevice } from "@/hooks/use-device"

const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
)

export function ResourceCard({ resource, onDelete, onUpdate, isSelected, onSelect, selectionMode }: {
    resource: Resource,
    onDelete?: () => void,
    onUpdate?: () => void,
    isSelected?: boolean,
    onSelect?: (id: string) => void,
    selectionMode?: boolean
}) {
    const [isDeleted, setIsDeleted] = React.useState(false)
    const isLink = resource.type === "LINK"
    const isCode = resource.type === "CODE"
    const isPdf = resource.type === "PDF"
    const isTweet = resource.type === "TWEET"
    const isFile = resource.type === "FILE"
    const isText = resource.type === "TEXT"
    const { handleShare: smartShare } = useSmartShare()
    const { isTouch } = useDevice()

    const longPressTimer = React.useRef<NodeJS.Timeout | null>(null)
    const [isLongPressing, setIsLongPressing] = React.useState(false)

    const handleTouchStart = () => {
        if (!isTouch) return
        longPressTimer.current = setTimeout(() => {
            setIsLongPressing(true)
            onSelect?.(resource.id)
            if (window.navigator?.vibrate) {
                window.navigator.vibrate(50) // Haptic feedback
            }
        }, 500) // 500ms for long press
    }

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current)
            longPressTimer.current = null
        }
        setIsLongPressing(false)
    }

    const iconColor = isLink ? "text-blue-600 dark:text-blue-400" : isCode ? "text-amber-600 dark:text-amber-400" : isPdf ? "text-red-600 dark:text-red-400" : (isTweet || isText) ? "text-foreground" : isFile ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
    const iconBg = isLink ? "bg-blue-500/10" : isCode ? "bg-amber-500/10" : isPdf ? "bg-red-500/10" : (isTweet || isText) ? "bg-muted" : isFile ? "bg-purple-500/10" : "bg-muted"

    const getFileIcon = () => {
        const titleAndUrl = (resource.title + " " + (resource.fileUrl || "") + " " + (resource.content || "")).toLowerCase()
        const getExt = () => {
            const parts = titleAndUrl.split('.')
            return parts.length > 1 ? parts.pop()?.split(/[?# ]/)[0] : ""
        }
        const ext = getExt()

        if (isLink) return <Globe className="w-3.5 h-3.5" />
        if (isCode) return <FileCode className="w-3.5 h-3.5" />
        if (isPdf || ext === "pdf") return <FileText className="w-3.5 h-3.5 text-red-500" />
        if (isTweet) return <XLogo className="w-3.5 h-3.5" />
        if (isText) return <MessageSquare className="w-3.5 h-3.5" />

        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return <FileArchive className="w-3.5 h-3.5" />
        if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')) return <FileVideo className="w-3.5 h-3.5" />
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return <FileAudio className="w-3.5 h-3.5" />
        if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) return <FileImage className="w-3.5 h-3.5" />

        return <FileText className="w-3.5 h-3.5" />
    }

    const handleInteraction = (e: React.MouseEvent) => {
        if (isTouch) {
            // Touch handled by handleTouchStart/End for Long Press
            // But we might want single tap to do something else (like open link)
            // if NOT in selection mode. The user said selection by long press on touch.
            if (!selectionMode) {
                handleOpenLink(e)
            } else {
                onSelect?.(resource.id)
            }
            return
        }

        // Handle Power User shortcuts first
        if (e.altKey) {
            if (resource.fileUrl) {
                handleDownload();
                toast.success("Téléchargement forcé");
            } else {
                toast.info("Aucun fichier attaché à cette ressource");
            }
            return
        }

        if (e.ctrlKey || e.metaKey) {
            const url = resource.url || (resource.content?.startsWith("http") ? resource.content : null)
            if (url && url.startsWith("http")) {
                handleOpenLink();
                toast.success("Ouverture du lien forcée");
            } else {
                toast.info("Aucun lien disponible pour cette ressource");
            }
            return
        }

        // Default behavior: Toggle selection
        onSelect?.(resource.id)
    }

    const handleDelete = async (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setIsDeleted(true)

        const promise = new Promise(async (resolve, reject) => {
            // Wait a bit to simulate optimistic UI before real deletion/undo window closes
            // In a real app, you'd use a soft-delete or a timer here.
            // For now, we commit immediately but visually it looks instantaneous.
            try {
                const result = await deleteResource(resource.id)
                if (result.success) {
                    resolve("Deleted")
                    onDelete?.() // Refresh parent list
                } else {
                    reject("Failed")
                    setIsDeleted(false) // Revert on failure
                }
            } catch {
                reject("Network error")
                setIsDeleted(false)
            }
        })

        toast.promise(promise, {
            loading: 'Refactoring reality...',
            success: 'Resource obliterated.',
            error: 'Failed to delete.',
            action: {
                label: 'Undo',
                onClick: () => setIsDeleted(false) // This is fake undo for now unless backend supports soft delete
            }
        })
    }

    const [editOpen, setEditOpen] = React.useState(false)

    const handleEdit = () => {
        setEditOpen(true)
    }

    const handleShare = async (e?: React.MouseEvent) => {
        e?.stopPropagation()
        const shareUrl = resource.url || resource.fileUrl || (resource.content?.startsWith("http") ? resource.content : "")

        await smartShare({
            title: resource.title,
            url: shareUrl
        })
    }

    const handleCopyLink = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        const url = resource.url || (resource.content?.startsWith("http") ? resource.content : null)
        if (url) {
            navigator.clipboard.writeText(url)
            toast.success("Lien copié dans le presse-papier !", {
                description: resource.title
            })
        }
    }

    const handleDownload = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (resource.fileUrl) {
            const link = document.createElement('a')
            link.href = resource.fileUrl
            link.download = resource.title
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handleOpenLink = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        const url = resource.url || (resource.content?.startsWith("http") ? resource.content : null)
        if (url) {
            window.open(url, '_blank')
        }
    }

    if (isDeleted) return null

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: selectionMode ? 1 : 1.02, y: selectionMode ? 0 : -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-3 break-inside-avoid"
            >
                <Card
                    onClick={handleInteraction}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={(e) => isTouch && e.preventDefault()} // Block system menu on touch for long press
                    className={cn(
                        "group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-xl rounded-xl cursor-pointer flex flex-col h-full relative",
                        isSelected && "ring-2 ring-primary border-primary shadow-lg",
                        isLongPressing && "scale-95 transition-transform duration-200"
                    )}
                >
                    <div
                        className={cn(
                            "absolute top-3 left-3 z-[10] ring-offset-background transition-all duration-300",
                            selectionMode ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                        )}
                        onClick={(e) => { e.stopPropagation(); onSelect?.(resource.id); }}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected
                                ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
                                : "bg-background/50 border-border hover:border-primary shadow-sm"
                        )}>
                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary/20 transition-colors" />}
                        </div>
                    </div>
                    {/* Image Preview */}
                    {resource.imageUrl && (
                        <div className="w-full h-32 overflow-hidden relative border-b border-border">
                            <img
                                src={resource.imageUrl}
                                alt={resource.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}

                    <CardHeader className="p-3.5 pb-1 space-y-2.5 grow">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-1.5 rounded-lg transition-transform group-hover:scale-110 shrink-0 overflow-hidden flex items-center justify-center", !resource.imageUrl && cn(iconBg, iconColor))}>
                                {resource.imageUrl ? (
                                    <img src={resource.imageUrl} alt="" className="w-4 h-4 object-contain" />
                                ) : (
                                    getFileIcon()
                                )}
                            </div>

                            {/* Actions Menu */}
                            <div className={cn(
                                "transition-opacity",
                                isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all outline-none">
                                            <MoreHorizontal className="w-3.5 h-3.5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 p-1.5 bg-popover border-border shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-100">
                                        {!isTouch && (
                                            <DropdownMenuItem onClick={() => onSelect?.(resource.id)} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                                <CheckCircle2 className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Select</span>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem onClick={handleEdit} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                            <Edit2 className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Edit</span>
                                        </DropdownMenuItem>

                                        {resource.fileUrl && (
                                            <DropdownMenuItem onClick={handleDownload} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                                <DownloadIcon className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Download</span>
                                            </DropdownMenuItem>
                                        )}

                                        {(resource.url || (resource.content?.startsWith("http"))) && (
                                            <>
                                                <DropdownMenuItem onClick={handleOpenLink} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                                    <ExternalLink className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Open Link</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleCopyLink} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                                    <Copy className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Copy Link</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}


                                        {isTouch && (
                                            <DropdownMenuItem onClick={handleShare} className="focus:bg-accent focus:text-accent-foreground rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                                <Share2 className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">Share</span>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="bg-border my-1" />

                                        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg py-2 px-3 cursor-pointer transition-colors group">
                                            <Trash2 className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100" />
                                            <span className="font-semibold text-xs group-hover:text-destructive transition-colors">Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-bold tracking-tight text-foreground transition-colors line-clamp-2 leading-tight flex items-center gap-1.5">
                                {resource.title}
                                {resource.fileUrl && <DownloadIcon className="w-3 h-3 text-primary/40 group-hover:text-primary/70 transition-colors" />}
                                {(resource.url || (resource.content?.startsWith("http"))) && <ExternalLink className="w-3 h-3 text-blue-500/40 group-hover:text-blue-500/70 transition-colors" />}
                            </CardTitle>
                            {resource.description && (
                                <CardDescription className="line-clamp-2 text-[11px] text-muted-foreground font-medium leading-relaxed">
                                    {resource.description}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>

                    {resource.userNote && (
                        <CardContent className="px-3.5 py-1">
                            <div className="bg-muted text-muted-foreground p-2 rounded-lg text-[10px] font-medium border border-border italic line-clamp-3">
                                "{resource.userNote}"
                            </div>
                        </CardContent>
                    )}

                    <CardFooter className="p-3.5 pt-2 flex items-center justify-between border-t border-border mt-auto">
                        <div className="flex gap-1 overflow-hidden mask-linear-fade">
                            {resource.tags.slice(0, 3).map(tag => (
                                <Badge key={tag.name} variant="secondary" className="bg-secondary text-secondary-foreground border border-border text-[9px] px-1.5 h-4 font-bold rounded-md whitespace-nowrap">
                                    #{tag.name}
                                </Badge>
                            ))}
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest shrink-0 ml-2">{resource.date}</span>
                    </CardFooter>
                </Card>
            </motion.div>

            <EditResourceDialog
                resource={resource}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdate={onUpdate || undefined}
            />
        </>
    )
}
