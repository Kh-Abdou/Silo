"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"

interface GlobalDropZoneProps {
    onDrop: (file: File) => void
}

export function GlobalDropZone({ onDrop }: GlobalDropZoneProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const dragCounter = React.useRef(0)

    React.useEffect(() => {
        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            dragCounter.current += 1
            if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true)
            }
        }

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            dragCounter.current -= 1
            if (dragCounter.current === 0) {
                setIsDragging(false)
            }
        }

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }

        const handleDrop = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)
            dragCounter.current = 0

            const file = e.dataTransfer?.files?.[0]
            if (file) {
                onDrop(file)
            }
        }

        // Add a safety listener to prevent sticking if dragging leaves the window entirely or fails
        const handleDragEnd = () => {
            setIsDragging(false)
            dragCounter.current = 0
        }

        window.addEventListener('dragenter', handleDragEnter)
        window.addEventListener('dragleave', handleDragLeave)
        window.addEventListener('dragover', handleDragOver)
        window.addEventListener('drop', handleDrop)
        window.addEventListener('dragend', handleDragEnd)
        window.addEventListener('mouseup', handleDragEnd)

        return () => {
            window.removeEventListener('dragenter', handleDragEnter)
            window.removeEventListener('dragleave', handleDragLeave)
            window.removeEventListener('dragover', handleDragOver)
            window.removeEventListener('drop', handleDrop)
            window.removeEventListener('dragend', handleDragEnd)
            window.removeEventListener('mouseup', handleDragEnd)
        }
    }, [onDrop])

    if (!isDragging) return null

    return (
        <div
            onClick={() => setIsDragging(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-background/60 backdrop-blur-sm cursor-pointer animate-in fade-in duration-300"
        >
            <div className="w-full max-w-sm bg-background border-2 border-dashed border-primary rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl mb-6 relative">
                    <UploadCloud className="w-8 h-8 text-primary-foreground animate-bounce" />
                </div>
                <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">Drop to Capture</h2>
                <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-widest opacity-80">Release to add to vault</p>
            </div>
        </div>
    )
}
