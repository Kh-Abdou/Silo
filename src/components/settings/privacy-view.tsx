"use client"

import { Switch } from "@/components/ui/switch"
import { Shield, Eye, Lock } from "lucide-react"
import { TwoFactorAuth } from "./two-factor-auth"

export function PrivacyView() {
    return (
        <div className="space-y-6">
            {/* Two-Factor Authentication - Most important security feature */}
            <TwoFactorAuth />
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">Public Profile</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Allow others to see your vault</p>
                    </div>
                </div>
                <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">Anonymous Telemetry</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Help improve the platform</p>
                    </div>
                </div>
                <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Lock className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">Auto-Lock Vault</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Lock after 5 minutes of inactivity</p>
                    </div>
                </div>
                <Switch defaultChecked={false} />
            </div>
        </div>
    )
}
