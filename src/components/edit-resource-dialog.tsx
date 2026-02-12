"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Resource } from "@/types/resource"
import { updateResource } from "@/app/actions"
import { toast } from "sonner"
import { X, FileText, UploadCloud, Trash2, Link as LinkIcon, MessageSquare, Tag as TagIcon, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
interface EditResourceDialogProps {
    resource: Resource
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate?: (() => void) | undefined
}
export function EditResourceDialog({ resource, open, onOpenChange, onUpdate }: EditResourceDialogProps): React.JSX.Element {
    const isLegacyLink = resource.type === "LINK" && !resource.url && resource.content?.startsWith("http")
    const [title, setTitle] = React.useState(resource.title)
    const [url, setUrl] = React.useState(resource.url || (isLegacyLink ? resource.content : "") || "")
    const [fileUrl, setFileUrl] = React.useState(resource.fileUrl || "")
    const [content, setContent] = React.useState(resource.content || "")
    const [userNote, setUserNote] = React.useState(resource.userNote || "")
    const [tags, setTags] = React.useState<string[]>(resource.tags.map(t => t.name))
    const [newTag, setNewTag] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [fileName, setFileName] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (open) {
            const isLegacyLinkOpen = resource.type === "LINK" && !resource.url && resource.content?.startsWith("http")
            setTitle(resource.title)
            setUrl(resource.url || (isLegacyLinkOpen ? resource.content : "") || "")
            setFileUrl(resource.fileUrl || "")
            setContent(resource.content || "")
            setUserNote(resource.userNote || "")
            setTags(resource.tags.map(t => t.name))
        }
    }, [open, resource])

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            try {
                const base64 = await readFileAsBase64(file)
                setFileUrl(base64)
                toast.success("File replaced locally")
            } catch (err) {
                toast.error("Failed to read file")
            }
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const result = await updateResource(resource.id, {
                title,
                url,
                fileUrl,
                content,
                userNote,
                tags
            })
            if (result.success) {
                toast.success("Resource updated")
                onOpenChange(false)
                onUpdate?.()
            } else {
                toast.error("Failed to update resource")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newTag.trim()) {
            if (!tags.includes(newTag.trim())) {
                setTags([...tags, newTag.trim()])
            }
            setNewTag("")
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "max-w-3xl bg-background/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl p-0 overflow-hidden transition-all duration-300",
                    isDragging && "ring-2 ring-primary ring-offset-4 ring-offset-background"
                )}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(false)
                    const file = e.dataTransfer.files?.[0]
                    if (file) {
                        setFileName(file.name)
                        readFileAsBase64(file).then(base64 => {
                            setFileUrl(base64)
                            toast.success("File replaced")
                        })
                    }
                }}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-primary/5 backdrop-blur-[2px] border-2 border-dashed border-primary/40 m-4 rounded-xl flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                            <UploadCloud className="w-8 h-8 text-primary-foreground animate-bounce" />
                        </div>
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Drop to Replace Attachment</p>
                    </div>
                )}

                <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-lg font-bold tracking-tight text-foreground uppercase">Edit Resource</DialogTitle>
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-1 opacity-50">Memory Configuration</p>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-primary/70" /> Title
                            </label>
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="bg-muted/30 border-border focus-visible:ring-primary/50 font-bold text-sm p-5 rounded-xl transition-all"
                                placeholder="Memory title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5 text-blue-500/70" /> Source URL
                            </label>
                            <Input
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-muted/30 border-border focus-visible:ring-primary/50 p-5 rounded-xl text-sm transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                <TagIcon className="w-3.5 h-3.5 text-orange-500/70" /> Categorization
                            </label>
                            <div className="flex flex-wrap gap-2 px-1">
                                {tags.map(tag => (
                                    <Badge key={tag} className="bg-secondary/50 text-secondary-foreground border-border px-3 py-1.5 rounded-lg gap-2 text-[10px] font-bold hover:bg-secondary transition-colors">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                                onKeyDown={addTag}
                                placeholder="Add tag..."
                                className="bg-transparent border-border focus-visible:ring-primary/20 h-10 px-4 rounded-xl font-bold placeholder:font-normal text-xs"
                            />
                        </div>
                    </div>

                    {/* Right Column: Content & Note */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                <UploadCloud className="w-3.5 h-3.5 text-primary/70" /> Attachment
                            </label>

                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                            {fileUrl ? (
                                <div className="group relative bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-primary/10">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold truncate text-foreground">
                                                {fileName || (fileUrl.startsWith('data:') ? 'New Upload' : fileUrl.split('/').pop())}
                                            </p>
                                            <p className="text-[9px] font-bold text-primary uppercase tracking-tighter opacity-70">Secured Storage</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setFileUrl(""); setFileName(null); }}
                                        className="p-2 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-muted/10 hover:bg-muted/20 hover:border-primary/50 transition-all cursor-pointer group"
                                >
                                    <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Click to upload replacement</p>
                                </div>
                            )}
                        </div>

                        {(resource.type === "TEXT" || resource.type === "CODE" || content) && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                    Content Data
                                </label>
                                <Textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="font-mono text-[11px] min-h-[100px] bg-muted/30 border-border focus-visible:ring-primary/50 p-4 rounded-xl shadow-inner resize-none text-foreground"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-primary/70" /> Personal Note
                            </label>
                            <Textarea
                                value={userNote}
                                onChange={e => setUserNote(e.target.value)}
                                placeholder="Add context to this memory..."
                                className="bg-muted/30 border-border focus-visible:ring-primary/50 min-h-[80px] p-4 rounded-xl resize-none text-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-muted/40 border-t border-border flex justify-end items-center gap-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-5 rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center gap-2 uppercase tracking-tight text-sm"
                    >
                        {loading ? "Syncing..." : (
                            <>Save Changes <Save className="w-4 h-4 opacity-70" /></>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
