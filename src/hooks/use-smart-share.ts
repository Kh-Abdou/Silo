"use client"

import { toast } from "sonner"

interface ShareResource {
    title: string
    url: string
    fileUrl?: string | null | undefined
    type?: string | null | undefined
}

/**
 * useSmartShare Hook
 * 
 * Provides a robust sharing mechanism:
 * 1. Native Web Share (Files Support -> Mobile + modern browsers)
 * 2. Native Web Share (URL Fallback)
 * 3. Clipboard Fallback (Desktop or failed Native Share)
 */
export function useSmartShare() {
    const handleShare = async (resource: ShareResource) => {
        // Validation: Ensure we have something to share
        if (!resource.url && !resource.fileUrl) {
            toast.info("No content to share")
            return
        }

        // Attempt 1: Native Web Share (with Files support for Multimedia)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                // If it's a file and browser supports sharing files
                if (resource.fileUrl && resource.type !== 'LINK' && navigator.canShare) {
                    try {
                        const response = await fetch(resource.fileUrl)
                        const blob = await response.blob()
                        const filename = resource.title ? `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg` : 'shared_image.jpg'
                        const file = new File([blob], filename, { type: blob.type })

                        if (navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                files: [file],
                                title: resource.title,
                            })
                            return
                        }
                    } catch (fileError) {
                        console.error("Error preparing file for share:", fileError)
                        // Fallback to URL sharing if file prep fails
                    }
                }

                // Standard URL sharing (Fallback for files or when preferred)
                const shareData = {
                    title: resource.title,
                    url: resource.url || resource.fileUrl || ""
                }

                await navigator.share(shareData)
                return
            } catch (error) {
                // Handle user cancellation silently
                if (error instanceof Error && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
                    console.log("Share cancelled or not allowed by user")
                    return
                }
                console.error("Native share error:", error)
            }
        }

        // Attempt 2: Clipboard Fallback
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                const textToCopy = resource.url || resource.fileUrl || ""
                await navigator.clipboard.writeText(textToCopy)

                toast.success("Link copied to clipboard!", {
                    description: resource.title,
                    duration: 4000
                })
            } catch (error) {
                console.error("Clipboard error:", error)
                toast.error("Unable to copy link")
            }
        } else {
            toast.error("Sharing is not supported by your browser")
        }
    }

    return { handleShare }
}
