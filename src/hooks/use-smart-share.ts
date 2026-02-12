"use client"

import { toast } from "sonner"

interface ShareResource {
    title: string
    url: string
}

/**
 * useSmartShare Hook
 * 
 * Provides a robust sharing mechanism:
 * 1. Native Web Share (Universal: Mobile + Modern Desktop)
 * 2. Clipboard Fallback (Desktop or failed Native Share)
 */
export function useSmartShare() {
    const handleShare = async (resource: ShareResource) => {
        // Validation: Ensure we have a URL to share
        if (!resource.url) {
            toast.info("Aucun lien à partager")
            return
        }

        const shareData = {
            title: resource.title,
            url: resource.url
        }

        // Attempt 1: Native Web Share (Universal: Mobile + Modern Desktop)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData)
                // Success or silent cancellation by the OS/User (iOS/Android/Windows 11)
                return
            } catch (error) {
                // Handle user cancellation silently
                if (error instanceof Error && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
                    console.log("Share cancelled or not allowed by user")
                    return
                }

                // Log other sharing errors and proceed to fallback
                console.error("Native share error:", error)
            }
        }

        // Attempt 2: Clipboard Fallback (Desktop or failed/unsupported Native Share)
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(resource.url)

                // Specific UX requirement: Inform that native share was unavailable but link is copied
                toast.success("Menu partage indisponible : Lien copié dans le presse-papier !", {
                    description: resource.title,
                    duration: 4000
                })
            } catch (error) {
                console.error("Clipboard error:", error)
                toast.error("Impossible de copier le lien")
            }
        } else {
            toast.error("Le partage n'est pas supporté par votre navigateur")
        }
    }

    return { handleShare }
}
