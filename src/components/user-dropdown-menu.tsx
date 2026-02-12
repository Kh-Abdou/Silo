"use client"

import * as React from "react"
import { User, Shield, LogOut } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

export type SettingsTab = "general" | "security" | "data"

interface UserDropdownMenuProps {
    user: SupabaseUser | null
    direction?: "up" | "down"
    onOpenSettings: (tab: SettingsTab) => void
    children: React.ReactNode
}

export function UserDropdownMenu({
    user,
    direction = "down",
    onOpenSettings,
    children
}: UserDropdownMenuProps) {
    const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Utilisateur"
    const email = user?.email || "non connecté"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={direction === "up" ? "top" : "bottom"}
                align="end"
                sideOffset={8}
                className="w-56 bg-background/95 backdrop-blur-xl border-border"
            >
                {/* Header: Name & Email */}
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-foreground">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Mon Espace -> General tab */}
                <DropdownMenuItem
                    onClick={() => onOpenSettings("general")}
                    className="cursor-pointer"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Espace</span>
                </DropdownMenuItem>

                {/* Sécurité -> Security tab */}
                <DropdownMenuItem
                    onClick={() => onOpenSettings("security")}
                    className="cursor-pointer"
                >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Sécurité</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className={cn(
                        "cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    )}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
