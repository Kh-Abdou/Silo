"use client"

import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Smartphone } from "lucide-react"

export function NotificationView() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">Push Notifications</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Alerts on your mobile device</p>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">Email Updates</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Weekly digest and feature news</p>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Bell className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">System Alerts</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Important security and system updates</p>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>
        </div>
    )
}
