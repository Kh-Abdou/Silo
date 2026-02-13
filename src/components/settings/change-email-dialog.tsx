"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Mail, AlertCircle, Loader2, Check, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface ChangeEmailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentEmail: string
}

export function ChangeEmailDialog({ open, onOpenChange, currentEmail }: ChangeEmailDialogProps) {
    const [step, setStep] = React.useState<"verify" | "2fa">("verify")
    const [password, setPassword] = React.useState("")
    const [newEmail, setNewEmail] = React.useState("")
    const [otpCode, setOtpCode] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [verifyFactorId, setVerifyFactorId] = React.useState<string | null>(null)

    // Reset state when opening
    React.useEffect(() => {
        if (open) {
            setStep("verify")
            setPassword("")
            setNewEmail("")
            setOtpCode("")
            setError(null)
            setIsLoading(false)
            setVerifyFactorId(null)
        }
    }, [open])

    const handleVerifyInitial = async () => {
        setError(null)
        setIsLoading(true)

        try {
            const supabase = createClient()

            // 1. STRICT CHECK: Email Availability (Blocking)
            const emailValue = String(newEmail).trim().toLowerCase()

            const { data: alreadyTaken, error: rpcError } = await supabase.rpc('check_email_available', {
                email_input: emailValue
            })

            if (rpcError) {
                console.error("Full RPC Error:", JSON.stringify(rpcError))
                throw new Error("Unable to check email availability.")
            }

            if (alreadyTaken) {
                setError("This email is already associated with another account.")
                setIsLoading(false)
                return
            }

            // 2. Verify Password (Blocking)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: currentEmail,
                password: password,
            })

            if (signInError) {
                setError("Incorrect password")
                setIsLoading(false)
                return
            }

            // 3. Check 2FA Status (Blocking)
            const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

            if (aalError) throw aalError

            // If user has 2FA enabled (nextLevel === 'aal2'), we must challenge
            if (aalData?.nextLevel === 'aal2') {
                const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
                if (factorsError) throw factorsError

                const totpFactor = factors.totp.find(f => f.status === 'verified')

                if (totpFactor) {
                    setVerifyFactorId(totpFactor.id)
                    setStep("2fa")
                    setIsLoading(false)
                    return
                }
            }

            // No 2FA -> Proceed to update directly
            await performEmailUpdate()

        } catch (err: any) {
            setError(err.message || "An error occurred")
            setIsLoading(false)
        }
    }

    const handleVerify2FA = async () => {
        if (!verifyFactorId) return
        setError(null)
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.mfa.challengeAndVerify({
                factorId: verifyFactorId,
                code: otpCode,
            })

            if (error) {
                setError("Incorrect code")
                setIsLoading(false)
                return
            }

            await performEmailUpdate()

        } catch (err: any) {
            setError(err.message || "An error occurred")
            setIsLoading(false)
        }
    }

    const performEmailUpdate = async () => {
        try {
            const supabase = createClient()
            const { error: updateError } = await supabase.auth.updateUser({
                email: newEmail,
            }, {
                emailRedirectTo: `${window.location.origin}/dashboard`
            })

            if (updateError) {
                // Handle specific Rate Limit error
                if (updateError.status === 429 ||
                    updateError.message.toLowerCase().includes("rate limit") ||
                    updateError.message.toLowerCase().includes("too many requests")) {
                    toast.error("Too many attempts, try again in 1 minute")
                } else {
                    toast.error(updateError.message || "Unable to update email")
                }
                // Do NOT close the modal on error
                return
            }

            // Success case
            toast.success("Check your emails", {
                description: `⚠️ Action required: To validate the change, you must click on the confirmation links sent to BOTH your email addresses (the old one first, then the new one).`,
                duration: 10000,
            })
            onOpenChange(false)

        } catch (err: any) {
            // Unexpected errors (network, etc.)
            toast.error(err.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }


    if (!open) return null

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">
                                    {step === "verify" ? "Change Email" : "Two-Step Verification"}
                                </h3>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="p-1 hover:bg-accent rounded-full text-muted-foreground transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 relative overflow-hidden min-h-[300px]">
                                <AnimatePresence mode="wait" initial={false}>
                                    {step === "verify" ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-4"
                                        >
                                            <p className="text-sm text-muted-foreground">
                                                For security reasons, please confirm your current password and enter your new email address.
                                            </p>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value)
                                                            setError(null)
                                                        }}
                                                        className="w-full h-10 pl-9 pr-4 bg-muted/30 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                        placeholder="Confirm your identity"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    New Email
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="email"
                                                        value={newEmail}
                                                        onChange={(e) => {
                                                            setNewEmail(e.target.value)
                                                            setError(null)
                                                        }}
                                                        className="w-full h-10 pl-9 pr-4 bg-muted/30 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                        placeholder="example@email.com"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm text-center text-muted-foreground">
                                                    Please enter the 6-digit code from your authentication app.
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block text-center">
                                                    Security code
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otpCode}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '')
                                                        setOtpCode(val)
                                                        setError(null)
                                                    }}
                                                    className="w-full h-12 text-center text-xl tracking-[0.5em] font-mono bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="000000"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Error Area - Absolute positioned at the bottom of content area */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-0 left-6 right-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-2">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>

                                {step === "verify" ? (
                                    <button
                                        onClick={handleVerifyInitial}
                                        disabled={isLoading || !password || !newEmail}
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleVerify2FA}
                                        disabled={isLoading || otpCode.length !== 6}
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Verify
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
