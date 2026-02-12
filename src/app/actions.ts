"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
}

function cleanTitle(title: string): string {
    let clean = title.trim()

    // Remove site suffixes like "| Site Name", "- Site Name", etc.
    const siteSeparators = [' | ', ' - ', ' — ', ' : ']
    for (const sep of siteSeparators) {
        if (clean.includes(sep)) {
            const parts = clean.split(sep)
            const sorted = parts.sort((a, b) => b.length - a.length)
            const longest = sorted[0];
            if (longest) {
                clean = longest.trim() || clean
            }
            break
        }
    }

    // Remove file extensions
    clean = clean.replace(/\.(pdf|zip|rar|tar|gz|exe|docx|pptx|xlsx|md|txt)$/i, '')

    return clean
}

export async function getLinkMetadata(url: string) {
    if (!url) return null

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        })
        const contentType = response.headers.get("content-type")

        // Pre-calculate domain/favicon for both HTML and non-HTML cases
        const hostname = new URL(url).hostname
        const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`

        if (!contentType || !contentType.includes("text/html")) {
            return {
                title: url.split('/').pop() || "File",
                favicon
            }
        }

        const html = await response.text()
        const titleMatch = html.match(/<title>([^<]*)<\/title>/)
        const title = (titleMatch ? titleMatch[1] : url.split('/').pop()) || "Link"

        return {
            title: cleanTitle(title),
            favicon
        }
    } catch (e) {
        console.error("Failed to fetch metadata:", e)
        return null
    }
}

export async function createResource(data: {
    content: string
    type: "LINK" | "CODE" | "TEXT" | "PDF" | "TWEET" | "FILE"
    title?: string
    userNote?: string
    tags?: string[]
    fileUrl?: string
}) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in to create resources" }
    }

    try {
        let finalTitle = data.title || "New Resource"
        let imageUrl = null

        if ((data.type === "LINK" || data.type === "TWEET") && data.content && data.content.startsWith("http")) {
            const metadata = await getLinkMetadata(data.content)
            if (metadata) {
                finalTitle = metadata.title || finalTitle
                imageUrl = metadata.favicon
            }
        }

        const resource = await prisma.resource.create({
            data: {
                userId,
                title: cleanTitle(finalTitle),
                content: data.content,
                type: data.type,
                userNote: data.userNote || null,
                imageUrl: imageUrl,
                fileUrl: data.fileUrl || null,
                tags: {
                    connectOrCreate: (data.tags || ["resource"]).map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                }
            }
        })

        revalidatePath("/")
        return { success: true, resource }
    } catch (e) {
        console.error(e)
        return { success: false, error: "Failed to create resource" }
    }
}

export async function getResources(options?: { search?: string, types?: string[], tags?: string[] }) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return []
    }

    const { search, types = [], tags = [] } = options || {}
    try {
        const resources = await prisma.resource.findMany({
            where: {
                userId,
                AND: [
                    search ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { content: { contains: search, mode: 'insensitive' } },
                        ]
                    } : {},
                    types.length > 0 ? { type: { in: types.map(t => t.toUpperCase() as any) } } : {},
                    tags.length > 0 ? {
                        tags: {
                            some: {
                                name: { in: tags }
                            }
                        }
                    } : {},
                ]
            },
            include: {
                tags: true
            },
            orderBy: { createdAt: "desc" },
        })
        return resources
    } catch (error) {
        console.error("Failed to fetch resources:", error)
        return []
    }
}

export async function getFilterData() {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { tags: [], types: [] }
    }

    try {
        const [tags, types] = await Promise.all([
            prisma.tag.findMany({
                where: { resources: { some: { userId } } },
                select: { name: true }
            }),
            prisma.resource.groupBy({
                by: ['type'],
                where: { userId }
            })
        ])
        return {
            tags: tags.map(t => t.name),
            types: types.map(t => t.type)
        }
    } catch (error) {
        console.error("Failed to fetch filter data:", error)
        return { tags: [], types: [] }
    }
}

export async function deleteResource(id: string) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in" }
    }

    try {
        await prisma.resource.delete({
            where: { id, userId }
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete resource:", error)
        return { success: false, error: "Failed to delete resource" }
    }
}

export async function deleteResources(ids: string[]) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in" }
    }

    try {
        await prisma.resource.deleteMany({
            where: { id: { in: ids }, userId }
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to bulk delete resources:", error)
        return { success: false, error: "Failed to delete resources" }
    }
}

export async function deleteAllResources() {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in" }
    }

    try {
        await prisma.resource.deleteMany({
            where: { userId }
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to clear memory:", error)
        return { success: false, error: "Failed to clear memory" }
    }
}

export async function updateResource(id: string, data: {
    title?: string
    content?: string
    url?: string
    fileUrl?: string
    userNote?: string
    tags?: string[]
}) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in" }
    }

    try {
        const updateData: any = {}
        if (data.title !== undefined) updateData.title = data.title
        if (data.content !== undefined) updateData.content = data.content
        if (data.url !== undefined) updateData.url = data.url
        if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl
        if (data.userNote !== undefined) updateData.userNote = data.userNote
        if (data.tags !== undefined) {
            updateData.tags = {
                set: [],
                connectOrCreate: data.tags.map(tag => ({
                    where: { name: tag },
                    create: { name: tag }
                }))
            }
        }

        await prisma.resource.update({
            where: { id, userId },
            data: updateData
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to update resource:", error)
        return { success: false, error: "Failed to update resource" }
    }
}

export async function exportVaultData() {
    const userId = await getCurrentUserId()
    if (!userId) {
        return { success: false, error: "You must be logged in" }
    }

    try {
        const resources = await prisma.resource.findMany({
            where: { userId },
            include: {
                tags: true
            },
            orderBy: { createdAt: "desc" },
        })

        // Export as JSON string
        return {
            success: true,
            data: JSON.stringify(resources, null, 2),
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error("Failed to export vault:", error)
        return { success: false, error: "Failed to export vault data" }
    }
}
