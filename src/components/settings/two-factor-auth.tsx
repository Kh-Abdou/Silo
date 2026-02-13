"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Shield, Loader2, AlertCircle, X, Key, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { RecoveryCodesModal } from "./recovery-codes-modal"

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

type MfaStatus = "loading" | "disabled" | "enabled" | "enrolling" | "verifying" | "confirming-disable" | "showing-recovery-codes" | "regenerating-codes"

const codeSchema = z.object({
    code: z
        .string()
        .length(6, "Code must contain 6 digits")
        .regex(/^\d+$/, "Code must be numeric"),
})

type CodeFormData = z.infer<typeof codeSchema>

// ============================================================================
// COMPONENT
// ============================================================================

export function TwoFactorAuth() {
    // Internal state
    const [status, setStatus] = useState<MfaStatus>("loading")
    const [factorId, setFactorId] = useState<string | null>(null)
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Recovery codes state
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
    const [remainingCodes, setRemainingCodes] = useState<number | null>(null)

    // Supabase client
    const supabase = createClient()

    // Form setup with Zod validation
    const form = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: "" },
    })

    // ========================================================================
    // CHECK MFA STATUS
    // ========================================================================
    const checkMfaStatus = useCallback(async () => {
        setStatus("loading")
        setError(null)

        try {
            const { data, error: listError } = await supabase.auth.mfa.listFactors()

            if (listError) {
                console.error("Error listing MFA factors:", listError)
                setError("Unable to check 2FA status")
                setStatus("disabled")
                return
            }

            // Find a verified TOTP factor
            const verifiedFactor = data?.totp?.find(
                (factor) => factor.status === "verified"
            )

            if (verifiedFactor) {
                setFactorId(verifiedFactor.id)
                setStatus("enabled")
            } else {
                setStatus("disabled")
            }
        } catch (err) {
            console.error("Unexpected error checking MFA status:", err)
            setError("Unexpected error during verification")
            setStatus("disabled")
        }
    }, [supabase.auth.mfa])

    // Check MFA status on mount
    useEffect(() => {
        checkMfaStatus()
    }, [checkMfaStatus])

    // ========================================================================
    // ENROLL (START 2FA SETUP)
    // ========================================================================
    const handleEnroll = async () => {
        setIsProcessing(true)
        setError(null)

        try {
            const { data, error: enrollError } = await supabase.auth.mfa.enroll({
                factorType: "totp",
                friendlyName: "Google Authenticator",
            })

            if (enrollError) {
                console.error("Enrollment error:", enrollError)
                setError(enrollError.message || "Error during activation")
                toast.error("Unable to activate 2FA")
                setIsProcessing(false)
                return
            }

            if (data) {
                setQrCode(data.totp.qr_code)
                setFactorId(data.id)
                setStatus("enrolling")
            }
        } catch (err) {
            console.error("Unexpected enrollment error:", err)
            setError("Unexpected error during activation")
            toast.error("An error occurred")
        } finally {
            setIsProcessing(false)
        }
    }

    // ========================================================================
    // VERIFY (COMPLETE 2FA SETUP)
    // ========================================================================
    const handleVerify = async (data: CodeFormData) => {
        if (!factorId) {
            setError("No factor to verify")
            return
        }

        setStatus("verifying")
        setError(null)

        try {
            // First create a challenge
            const { data: challengeData, error: challengeError } =
                await supabase.auth.mfa.challenge({ factorId })

            if (challengeError) {
                console.error("Challenge error:", challengeError)
                setError("Error creating challenge")
                setStatus("enrolling")
                toast.error("Verification error")
                return
            }

            // Then verify the challenge with the code
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code: data.code,
            })

            if (verifyError) {
                console.error("Verify error:", verifyError)
                setError("Invalid code. Please try again.")
                setStatus("enrolling")
                toast.error("Invalid code")
                form.reset()
                return
            }

            // Success! Now generate recovery codes
            setQrCode(null)

            // Generate recovery codes automatically
            try {
                const response = await fetch('/api/recovery-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })

                if (response.ok) {
                    const { codes } = await response.json()
                    setRecoveryCodes(codes)
                    setStatus("showing-recovery-codes")
                } else {
                    // If recovery codes fail, still enable MFA but warn user
                    console.error("Failed to generate recovery codes")
                    setStatus("enabled")
                    toast.warning("MFA activated but recovery codes could not be generated")
                }
            } catch (rcError) {
                console.error("Recovery codes error:", rcError)
                setStatus("enabled")
                toast.warning("MFA activated but recovery codes could not be generated")
            }
        } catch (err) {
            console.error("Unexpected verify error:", err)
            setError("Unexpected error during verification")
            setStatus("enrolling")
            toast.error("An error occurred")
            form.reset()
        }
    }

    // ========================================================================
    // DISABLE (INITIATE CONFIRMATION)
    // ========================================================================
    const handleDisable = () => {
        if (!factorId) {
            setError("No factor to disable")
            return
        }
        // Switch to confirmation state - user must verify with TOTP code
        setError(null)
        form.reset()
        setStatus("confirming-disable")
    }

    // ========================================================================
    // CONFIRM DISABLE (CHALLENGE + VERIFY + UNENROLL)
    // ========================================================================
    const handleConfirmDisable = async (data: CodeFormData) => {
        if (!factorId) {
            setError("No factor to disable")
            return
        }

        setIsProcessing(true)
        setError(null)

        try {
            // Step 1: Create a challenge to elevate to AAL2
            const { data: challengeData, error: challengeError } =
                await supabase.auth.mfa.challenge({ factorId })

            if (challengeError) {
                console.error("Challenge error:", challengeError)
                setError("Error creating challenge")
                toast.error("Verification error")
                setIsProcessing(false)
                return
            }

            // Step 2: Verify the code to reach AAL2
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code: data.code,
            })

            if (verifyError) {
                console.error("Verify error:", verifyError)
                setError("Invalid code. Please try again.")
                toast.error("Invalid code")
                form.reset()
                setIsProcessing(false)
                return
            }

            // Step 3: Now we're at AAL2, we can unenroll
            const { error: unenrollError } = await supabase.auth.mfa.unenroll({
                factorId,
            })

            if (unenrollError) {
                console.error("Unenroll error:", unenrollError)
                setError(unenrollError.message || "Error during deactivation")
                toast.error("Unable to deactivate 2FA")
                setIsProcessing(false)
                return
            }

            // Success!
            setStatus("disabled")
            setFactorId(null)
            form.reset()
            toast.success("Two-factor authentication disabled")
        } catch (err) {
            console.error("Unexpected disable error:", err)
            setError("Unexpected error during deactivation")
            toast.error("An error occurred")
        } finally {
            setIsProcessing(false)
        }
    }

    // ========================================================================
    // CANCEL DISABLE CONFIRMATION
    // ========================================================================
    const handleCancelDisable = () => {
        setStatus("enabled")
        setError(null)
        form.reset()
    }

    // ========================================================================
    // CANCEL ENROLLMENT
    // ========================================================================
    const handleCancel = async () => {
        // If we started enrollment, try to unenroll the unverified factor
        if (factorId) {
            try {
                await supabase.auth.mfa.unenroll({ factorId })
            } catch {
                // Ignore errors during cancel
            }
        }
        setStatus("disabled")
        setQrCode(null)
        setFactorId(null)
        setError(null)
        form.reset()
    }

    // ========================================================================
    // RECOVERY CODES - CONFIRM SAVED
    // ========================================================================
    const handleRecoveryCodesConfirmed = () => {
        setRecoveryCodes([])
        setStatus("enabled")
        toast.success("Two-factor authentication activated with recovery codes!")
        // Fetch remaining codes count
        fetchRemainingCodes()
    }

    // ========================================================================
    // RECOVERY CODES - FETCH REMAINING COUNT
    // ========================================================================
    const fetchRemainingCodes = useCallback(async () => {
        try {
            const response = await fetch('/api/recovery-codes')
            if (response.ok) {
                const data = await response.json()
                setRemainingCodes(data.remaining)
            }
        } catch (err) {
            console.error("Error fetching recovery codes count:", err)
        }
    }, [])

    // Fetch remaining codes when status becomes enabled
    useEffect(() => {
        if (status === "enabled") {
            fetchRemainingCodes()
        }
    }, [status, fetchRemainingCodes])

    // ========================================================================
    // RECOVERY CODES - START REGENERATION (SUDO MODE)
    // ========================================================================
    const handleRegenerateStart = () => {
        setError(null)
        form.reset()
        setStatus("regenerating-codes")
    }

    // ========================================================================
    // RECOVERY CODES - CONFIRM REGENERATION (TOTP VERIFIED)
    // ========================================================================
    const handleRegenerateConfirm = async (data: CodeFormData) => {
        if (!factorId) {
            setError("No MFA factor found")
            return
        }

        setIsProcessing(true)
        setError(null)

        try {
            // Step 1: Create a challenge to verify TOTP
            const { data: challengeData, error: challengeError } =
                await supabase.auth.mfa.challenge({ factorId })

            if (challengeError) {
                console.error("Challenge error:", challengeError)
                setError("Verification error")
                setIsProcessing(false)
                return
            }

            // Step 2: Verify the code to reach AAL2
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code: data.code
            })

            if (verifyError) {
                console.error("Verify error:", verifyError)
                setError("Invalid code. Please try again.")
                form.reset()
                setIsProcessing(false)
                return
            }

            // Step 3: Now we're at AAL2, regenerate recovery codes
            const response = await fetch('/api/recovery-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regenerate: true })
            })

            if (!response.ok) {
                throw new Error("Failed to regenerate codes")
            }

            const { codes } = await response.json()
            setRecoveryCodes(codes)
            setStatus("showing-recovery-codes")
            toast.success("New recovery codes generated!")

        } catch (err) {
            console.error("Regeneration error:", err)
            setError("Error during codes regeneration")
            toast.error("An error occurred")
        } finally {
            setIsProcessing(false)
            form.reset()
        }
    }

    // ========================================================================
    // RECOVERY CODES - CANCEL REGENERATION
    // ========================================================================
    const handleCancelRegenerate = () => {
        setStatus("enabled")
        setError(null)
        form.reset()
    }

    // ========================================================================
    // RENDER LOADING STATE
    // ========================================================================
    if (status === "loading") {
        return (
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Checking 2FA status...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // ========================================================================
    // RENDER DISABLED STATE
    // ========================================================================
    if (status === "disabled") {
        return (
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">
                            Two-Factor Authentication
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                            Not enabled — Protect your account
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleEnroll}
                    disabled={isProcessing}
                    className="gap-2"
                >
                    {isProcessing ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <ShieldCheck className="w-3 h-3" />
                    )}
                    Enable
                </Button>
            </div>
        )
    }

    // ========================================================================
    // RENDER ENROLLMENT STATE (QR CODE DISPLAY)
    // ========================================================================
    if (status === "enrolling" || status === "verifying") {
        return (
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
                {/* Header with cancel button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">
                                Set up Google Authenticator
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                Scan the QR code with your app
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        disabled={status === "verifying"}
                        className="h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* QR Code Display */}
                {qrCode && (
                    <div className="flex justify-center">
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm"
                            dangerouslySetInnerHTML={{ __html: qrCode }}
                        />
                    </div>
                )}

                {/* Instructions */}
                <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground">
                        1. Open Google Authenticator on your phone
                    </p>
                    <p className="text-xs text-muted-foreground">
                        2. Scan the QR code above
                    </p>
                    <p className="text-xs text-muted-foreground">
                        3. Enter the 6-digit generated code
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs">{error}</span>
                    </div>
                )}

                {/* Verification Form */}
                <form
                    onSubmit={form.handleSubmit(handleVerify)}
                    className="space-y-3"
                >
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-xs">
                            Verification code
                        </Label>
                        <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            disabled={status === "verifying"}
                            autoComplete="one-time-code"
                            className="text-center text-lg tracking-widest font-mono"
                            {...form.register("code")}
                        />
                        {form.formState.errors.code && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.code.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full gap-2"
                        disabled={status === "verifying"}
                    >
                        {status === "verifying" ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                Verify and enable
                            </>
                        )}
                    </Button>
                </form>
            </div>
        )
    }

    // ========================================================================
    // RENDER CONFIRMING-DISABLE STATE (TOTP VERIFICATION BEFORE DISABLE)
    // ========================================================================
    if (status === "confirming-disable") {
        return (
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
                {/* Header with cancel button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">
                                Confirm deactivation
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                Enter your code to confirm
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelDisable}
                        disabled={isProcessing}
                        className="h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Security Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                        For security reasons, you must enter a code from your authentication app to disable 2FA.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs">{error}</span>
                    </div>
                )}

                {/* Verification Form */}
                <form
                    onSubmit={form.handleSubmit(handleConfirmDisable)}
                    className="space-y-3"
                >
                    <div className="space-y-2">
                        <Label htmlFor="disable-code" className="text-xs">
                            Verification code
                        </Label>
                        <Input
                            id="disable-code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            disabled={isProcessing}
                            autoComplete="one-time-code"
                            className="text-center text-lg tracking-widest font-mono"
                            {...form.register("code")}
                        />
                        {form.formState.errors.code && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.code.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="destructive"
                        className="w-full gap-2"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Disabling...
                            </>
                        ) : (
                            <>
                                <X className="w-4 h-4" />
                                Confirm deactivation
                            </>
                        )}
                    </Button>
                </form>
            </div>
        )
    }

    // ========================================================================
    // RENDER SHOWING RECOVERY CODES STATE (Modal Display)
    // ========================================================================
    if (status === "showing-recovery-codes") {
        return (
            <>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Key className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Save your recovery codes...
                            </span>
                        </div>
                    </div>
                </div>
                <RecoveryCodesModal
                    isOpen={true}
                    codes={recoveryCodes}
                    onConfirm={handleRecoveryCodesConfirmed}
                />
            </>
        )
    }

    // ========================================================================
    // RENDER REGENERATING CODES STATE (TOTP Verification for Sudo Mode)
    // ========================================================================
    if (status === "regenerating-codes") {
        return (
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
                {/* Header with cancel button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">
                                Regenerate recovery codes
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                Verification required
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelRegenerate}
                        disabled={isProcessing}
                        className="h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Security Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                        For security reasons, enter your authentication code to regenerate recovery codes. Old codes will be invalidated.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs">{error}</span>
                    </div>
                )}

                {/* Verification Form */}
                <form
                    onSubmit={form.handleSubmit(handleRegenerateConfirm)}
                    className="space-y-3"
                >
                    <div className="space-y-2">
                        <Label htmlFor="regen-code" className="text-xs">
                            Verification code
                        </Label>
                        <Input
                            id="regen-code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            disabled={isProcessing}
                            autoComplete="one-time-code"
                            className="text-center text-lg tracking-widest font-mono"
                            {...form.register("code")}
                        />
                        {form.formState.errors.code && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.code.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full gap-2"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Regenerating...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Regenerate codes
                            </>
                        )}
                    </Button>
                </form>
            </div>
        )
    }

    // ========================================================================
    // RENDER ENABLED STATE
    // ========================================================================
    if (status === "enabled") {
        return (
            <div className="space-y-4">
                {/* Main MFA Status Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm text-foreground">
                                    Two-Factor Authentication
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shrink-0"
                                >
                                    Enabled
                                </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                Your account is protected
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDisable}
                        disabled={isProcessing}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 w-full sm:w-auto"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <X className="w-3 h-3" />
                        )}
                        Disable
                    </Button>
                </div>

                {/* Recovery Codes Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-muted text-muted-foreground rounded-lg shrink-0">
                            <Key className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-foreground">
                                Recovery codes
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                {remainingCodes !== null
                                    ? `${remainingCodes}/10 codes remaining`
                                    : "Codes available in case of loss"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateStart}
                        disabled={isProcessing}
                        className="gap-2 shrink-0 w-full sm:w-auto"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Regenerate
                    </Button>
                </div>
            </div>
        )
    }

    // Fallback (should never reach here)
    return null
}

