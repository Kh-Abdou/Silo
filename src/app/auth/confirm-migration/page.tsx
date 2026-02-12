"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ConfirmMigrationPage() {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkStatus = async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()
            const user = data?.user

            // Logic:
            // If user.new_email is NULL, it means the change is complete (or not pending).
            // If user.new_email is SET, it means we are still waiting for the second click.

            // BUT, we need to be careful. Is 'new_email' exposed in the session user object?
            // Let's debug/assume yes based on Supabase docs (user_metadata or directly on user object).
            // Actually, 'new_email' is a property on the User object in Supabase.

            if (user) {
                // Check if the email change is complete
                if (!user.new_email) {
                    // Change complete! specific redirect for "New Email Click"
                    // We can't distinguish "Change Complete" vs "Just regular login" easily without context, 
                    // but landing here implies a flow.
                    router.push("/dashboard") // Dashboard
                } else {
                    // Change pending -> "Old Email Click" state
                    setIsLoading(false)
                }
            } else {
                // Not logged in? Should not happen if link logs them in.
                router.push("/login")
            }
        }

        // Brief delay to allow session to settle if coming from a link
        setTimeout(checkStatus, 1000)
    }, [router])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 bg-noise flex items-center justify-center p-4">
            {/* Background Glows */}
            <div className="fixed top-1/3 -left-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/3 -right-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />

            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 text-center relative z-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">
                            Identity Verified!
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Now, please click the link sent to your <span className="font-semibold text-foreground">new email address</span> to finalize the change.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
