"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, AtSign } from "lucide-react"
import { toast } from "sonner"

export function ProfileView() {
    const [name, setName] = useState("Felix")
    const [email, setEmail] = useState("user@example.com")
    const [handle, setHandle] = useState("@felix_vault")

    const handleSave = () => {
        toast.success("Profile updated successfully")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Display Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 bg-muted/30 border-border focus-visible:ring-ring"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-muted/30 border-border focus-visible:ring-ring"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Silo Handle</label>
                <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="pl-12 bg-muted/30 border-border focus-visible:ring-ring font-mono"
                    />
                </div>
            </div>

            <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg"
            >
                UPDATE PROFILE
            </Button>
        </div>
    )
}
