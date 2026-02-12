import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createResource, getLinkMetadata } from "@/app/actions"
import { toast } from "sonner"
import {
    Link as LinkIcon,
    FileText,
    MessageSquare,
    Tag as TagIcon,
    UploadCloud,
    CornerDownLeft,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MagicPasteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    initialFile?: File | null
}

export function MagicPaste({ open, onOpenChange, onSuccess, initialFile }: MagicPasteProps) {
    const [content, setContent] = React.useState("")
    const [title, setTitle] = React.useState("")
    const [note, setNote] = React.useState("")
    const [tags, setTags] = React.useState<string[]>(["resource"])
    const [newTag, setNewTag] = React.useState("")
    const [analyzing, setAnalyzing] = React.useState(false)
    const [type, setType] = React.useState<"LINK" | "CODE" | "TEXT" | "PDF" | "TWEET" | "FILE" | null>(null)
    const [fileUrl, setFileUrl] = React.useState<string | null>(null)
    const [fileName, setFileName] = React.useState<string | null>(null)
    const [scrapedTitle, setScrapedTitle] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (initialFile) {
            handleFileProcess(initialFile)
        }
    }, [initialFile])

    React.useEffect(() => {
        // Only auto-detect type if we don't have a specific file type set already
        // or if we are dealing with text content
        if (content.startsWith("http")) {
            if (content.includes("twitter.com") || content.includes("x.com")) setType("TWEET")
            else setType("LINK")
        }
        else if (content.includes("function") || content.includes("class ") || content.includes("const ") || content.includes("import ")) setType("CODE")
        else if (content.length > 0 && !fileUrl) setType("TEXT")
        else if (fileUrl && !type) setType("FILE")
        // If type is already set (e.g. to PDF by handleFileProcess), don't overwrite it
    }, [content, fileUrl, type])

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    const handleFileProcess = async (file: File) => {
        setFileName(file.name)
        const ext = file.name.split('.').pop()?.toLowerCase() || ''

        try {
            const base64 = await readFileAsBase64(file)
            setFileUrl(base64)

            if (ext === 'pdf') setType("PDF")
            else if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) setType("FILE")
            else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) setType("FILE")
            else setType("FILE")

        } catch (e) {
            toast.error("Failed to read file")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileProcess(file)
    }

    const handleSave = async () => {
        if (!content && !fileUrl) return

        setAnalyzing(true)
        const result = await createResource({
            content: content || fileName || "Attached File",
            title: title || content.slice(0, 50) || fileName || "New Resource",
            type: type || "TEXT",
            userNote: note,
            tags,
            ...(fileUrl ? { fileUrl } : {})
        })
        setAnalyzing(false)

        if (result.success) {
            toast.success("Captured successfully")
            onOpenChange(false)
            resetForm()
            onSuccess?.()
        } else {
            toast.error("Failed to capture")
        }
    }

    const resetForm = () => {
        setContent("")
        setTitle("")
        setNote("")
        setTags(["resource"])
        setNewTag("")
        setFileUrl(null)
        setFileName(null)
        setType(null)
        setScrapedTitle(null)
    }

    const addTag = () => {
        const val = newTag.trim()
        if (val && !tags.includes(val)) {
            setTags([...tags, val])
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => onOpenChange(false)}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-background border border-border rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
                {/* Simple Header */}
                <div className="p-4 flex items-center justify-between border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                            <UploadCloud className="text-primary-foreground w-4 h-4" />
                        </div>
                        <span className="text-sm font-extrabold text-foreground uppercase tracking-tighter">Capture Memory</span>
                    </div>

                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors text-muted-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                        {/* Left: Attachment */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest px-1">
                                <FileText className="w-3 h-3" /> File or Attachment
                            </label>

                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                                onDrop={(e) => {
                                    e.preventDefault(); e.stopPropagation()
                                    const file = e.dataTransfer.files?.[0]
                                    if (file) handleFileProcess(file)
                                }}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative min-h-[140px]",
                                    fileUrl
                                        ? "bg-primary border-primary text-primary-foreground shadow-xl"
                                        : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                                    fileUrl ? "bg-primary-foreground/20 rotate-6" : "bg-background border border-border text-muted-foreground"
                                )}>
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <div className="text-center px-2">
                                    <p className={cn("text-xs font-bold truncate max-w-[150px]", fileUrl ? "text-primary-foreground" : "text-foreground")}>
                                        {fileName || "Click to browse"}
                                    </p>
                                    <p className={cn("text-[9px] font-medium uppercase tracking-widest mt-0.5 opacity-60", fileUrl ? "text-primary-foreground" : "text-muted-foreground")}>
                                        {fileUrl ? "Ready" : "PDF, RAR, IMG"}
                                    </p>
                                </div>
                                {fileUrl && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFileUrl(null); setFileName(null); }}
                                        className="absolute -top-1.5 -right-1.5 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-all hover:scale-110 z-10"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest px-1">
                                    <FileText className="w-3 h-3" /> Title
                                </label>
                                <input
                                    className="w-full bg-muted/50 border border-border focus:ring-1 focus:ring-ring rounded-xl py-2.5 px-3.5 text-foreground placeholder:text-muted-foreground transition-all text-xs font-bold"
                                    placeholder="Optional memory title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest px-1">
                                    <LinkIcon className="w-3 h-3" /> Source URL
                                </label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-muted/50 border border-border focus:ring-1 focus:ring-ring rounded-xl py-2.5 px-3.5 text-foreground placeholder:text-muted-foreground transition-all text-xs pr-10"
                                        placeholder="https://..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            if (content.startsWith("http") && !analyzing) {
                                                setAnalyzing(true)
                                                toast.info("Scraping metadata...")
                                                try {
                                                    const meta = await getLinkMetadata(content)
                                                    if (meta) {
                                                        setScrapedTitle(meta.title)
                                                        toast.success("Captured: " + meta.title)
                                                    }
                                                } catch (err) { } finally { setAnalyzing(false) }
                                            }
                                        }}
                                        className={cn(
                                            "absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                                            content.startsWith("http") && !analyzing ? "text-primary hover:bg-accent" : "text-muted-foreground opacity-50"
                                        )}
                                    >
                                        <LinkIcon className={cn("w-3.5 h-3.5", analyzing && "animate-spin")} />
                                    </button>
                                    {scrapedTitle && (
                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-[10px] text-primary font-bold px-2 flex items-center gap-1.5"
                                        >
                                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                            Detected: {scrapedTitle}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest px-1">
                                    <MessageSquare className="w-3 h-3" /> Note
                                </label>
                                <textarea
                                    className="w-full bg-muted/50 border border-border focus:ring-1 focus:ring-ring rounded-xl py-2.5 px-3.5 text-foreground placeholder:text-muted-foreground transition-all text-xs min-h-[60px] resize-none"
                                    placeholder="Quick description..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Tags & Actions */}
                <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <TagIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex flex-wrap gap-2 flex-1">
                            <AnimatePresence>
                                {tags.map(tag => (
                                    <motion.span
                                        key={tag}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="bg-secondary text-secondary-foreground text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1 border border-border shadow-sm"
                                    >
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            <input
                                className="bg-transparent text-xs font-bold outline-none placeholder:font-normal placeholder:text-zinc-400 min-w-[80px]"
                                placeholder="Add tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={addTag}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={analyzing || (!content && !fileUrl)}
                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                    >
                        {analyzing ? "Saving..." : (
                            <>Save to Vault <CornerDownLeft className="w-4 h-4 opacity-50" /></>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
