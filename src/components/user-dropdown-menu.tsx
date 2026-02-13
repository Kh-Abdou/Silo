"use client"

import * as React from "react"
import { Shield, LogOut, LayoutDashboard } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/auth/actions"

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
    const handleSignOut = async () => {
        await signOut()
    }

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
                        <p className="text-sm font-bold leading-none">{user?.user_metadata?.full_name || "User"}</p>
                        <p className="text-[10px] leading-none text-muted-foreground font-medium uppercase tracking-widest">
                            {user?.email || "Not connected"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onOpenSettings("general")} className="gap-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="font-semibold">My Workspace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenSettings("security")} className="gap-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary">
                        <Shield className="w-4 h-4" />
                        <span className="font-semibold">Security</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-tight">Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
