"use client"

import * as React from "react"

interface UserData {
    name: string
    email: string
    avatarUrl: string | null
}

const DEFAULT_USER: UserData = {
    name: "Khobz",
    email: "khobz@silo.local",
    avatarUrl: null
}

const USER_STORAGE_KEY = "silo_user_data"

export function getUser(): UserData {
    if (typeof window === "undefined") return DEFAULT_USER
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return DEFAULT_USER
        }
    }
    return DEFAULT_USER
}

export function updateUser(data: Partial<UserData>): UserData {
    const current = getUser()
    const updated = { ...current, ...data }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent("user-updated", { detail: updated }))
    return updated
}

export function useUser() {
    const [user, setUser] = React.useState<UserData>(DEFAULT_USER)

    React.useEffect(() => {
        setUser(getUser())

        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<UserData>
            setUser(customEvent.detail)
        }

        window.addEventListener("user-updated", handleUpdate)
        return () => window.removeEventListener("user-updated", handleUpdate)
    }, [])

    const update = React.useCallback((data: Partial<UserData>) => {
        const updated = updateUser(data)
        setUser(updated)
    }, [])

    return { user, updateUser: update }
}
