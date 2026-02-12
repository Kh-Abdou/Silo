export type Resource = {
    id: string
    title: string
    type: "LINK" | "CODE" | "PDF" | "TWEET" | "FILE" | "TEXT" | "MEMBER"
    content?: string | null
    url?: string | null
    description?: string | null
    userNote?: string | null
    imageUrl?: string | null
    fileUrl?: string | null
    tags: { name: string }[]
    date: string
    createdAt?: Date
    updatedAt?: Date
}
