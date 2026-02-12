"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft, Key } from "lucide-react"

// ============================================================================
// SCHEMA
// ============================================================================

const codeSchema = z.object({
    code: z
        .string()
        .length(6, "Le code doit contenir 6 chiffres")
        .regex(/^\d+$/, "Le code doit être numérique"),
})

const recoveryCodeSchema = z.object({
    code: z
        .string()
        .min(8, "Le code de secours est requis")
        .max(10, "Code de secours invalide"),
})

type CodeFormData = z.infer<typeof codeSchema>
type RecoveryCodeFormData = z.infer<typeof recoveryCodeSchema>

// ============================================================================
// COMPONENT
// ============================================================================

export default function VerifyMfaPage() {
    const router = useRouter()
    const supabase = createClient()

    const [factorId, setFactorId] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isVerifying, setIsVerifying] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [useRecoveryCode, setUseRecoveryCode] = React.useState(false)

    const form = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: "" },
    })

    const recoveryForm = useForm<RecoveryCodeFormData>({
        resolver: zodResolver(recoveryCodeSchema),
        defaultValues: { code: "" },
    })

    // ========================================================================
    // LOAD FACTOR ID ON MOUNT
    // ========================================================================
    React.useEffect(() => {
        const loadFactors = async () => {
            try {
                const { data, error: listError } = await supabase.auth.mfa.listFactors()

                if (listError) {
                    console.error("Error listing factors:", listError)
                    setError("Unable to load 2FA configuration")
                    setIsLoading(false)
                    return
                }

                // Find a verified TOTP factor
                const verifiedFactor = data?.totp?.find(
                    (factor) => factor.status === "verified"
                )

                if (!verifiedFactor) {
                    // No MFA factor found - redirect back to login
                    console.error("No verified TOTP factor found")
                    router.push("/login")
                    return
                }

                setFactorId(verifiedFactor.id)
                setIsLoading(false)
            } catch (err) {
                console.error("Error loading factors:", err)
                setError("An unexpected error occurred")
                setIsLoading(false)
            }
        }

        loadFactors()
    }, [supabase.auth.mfa, router])

    // ========================================================================
    // VERIFY CODE
    // ========================================================================
    const handleVerify = async (data: CodeFormData) => {
        if (!factorId) {
            setError("No 2FA factor available")
            return
        }

        setIsVerifying(true)
        setError(null)

        try {
            // Step 1: Create a challenge
            const { data: challengeData, error: challengeError } =
                await supabase.auth.mfa.challenge({ factorId })

            if (challengeError) {
                console.error("Challenge error:", challengeError)
                setError("Unable to initiate verification")
                setIsVerifying(false)
                return
            }

            // Step 2: Verify the challenge with the code
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code: data.code,
            })

            if (verifyError) {
                console.error("Verify error:", verifyError)
                setError("Invalid code. Please try again.")
                form.reset()
                setIsVerifying(false)
                return
            }

            // Success! Redirect to dashboard
            toast.success("Verification successful!")
            router.push("/dashboard")
        } catch (err) {
            console.error("Unexpected verify error:", err)
            setError("An unexpected error occurred")
            form.reset()
            setIsVerifying(false)
        }
    }

    // ========================================================================
    // VERIFY RECOVERY CODE
    // ========================================================================
    const handleRecoveryCodeVerify = async (data: RecoveryCodeFormData) => {
        setIsVerifying(true)
        setError(null)

        try {
            const response = await fetch('/api/recovery-codes/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: data.code })
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.message || "Invalid recovery code")
                recoveryForm.reset()
                setIsVerifying(false)
                return
            }

            // Show warning if running low on codes
            if (result.warning) {
                toast.warning(result.warning)
            }

            // Success! Redirect to dashboard
            toast.success("Vérification réussie ! Code de secours consommé.")
            router.push("/dashboard")
        } catch (err) {
            console.error("Recovery code verify error:", err)
            setError("An unexpected error occurred")
            recoveryForm.reset()
            setIsVerifying(false)
        }
    }

    // ========================================================================
    // TOGGLE RECOVERY CODE MODE
    // ========================================================================
    const toggleRecoveryMode = () => {
        setUseRecoveryCode(!useRecoveryCode)
        setError(null)
        form.reset()
        recoveryForm.reset()
    }

    // ========================================================================
    // CANCEL & GO BACK
    // ========================================================================
    const handleCancel = async () => {
        // Sign out and go back to login
        await supabase.auth.signOut()
        router.push("/login")
    }

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 bg-noise">
            <Toaster />

            {/* Background Glows */}
            <div className="fixed top-1/3 -left-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/3 -right-20 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none z-0" />

            {/* Atmospheric Blobs */}
            <div className="blob w-[180px] h-[180px] bg-slate-300/40 dark:bg-blue-400/25 top-[5%] left-[10%]" />
            <div className="blob w-[150px] h-[150px] bg-gray-200/50 dark:bg-indigo-400/20 top-[15%] right-[20%]" />
            <div className="blob w-[200px] h-[200px] bg-slate-200/45 dark:bg-purple-400/25 top-[40%] left-[30%]" />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen p-4">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">2FA Verification</h1>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                            <p className="text-sm text-muted-foreground">
                                Loading security configuration...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {useRecoveryCode ? "Utiliser un code de secours" : "Vérifiez votre identité"}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {useRecoveryCode
                                        ? "Entrez l'un de vos codes de secours sauvegardés"
                                        : "Entrez le code à 6 chiffres de Google Authenticator"}
                                </p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mb-6 flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Conditional Form Based on Mode */}
                            {useRecoveryCode ? (
                                /* Recovery Code Form */
                                <form onSubmit={recoveryForm.handleSubmit(handleRecoveryCodeVerify)} className="space-y-6">
                                    <div>
                                        <label
                                            className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider"
                                            htmlFor="recovery-code"
                                        >
                                            Code de Secours
                                        </label>
                                        <input
                                            id="recovery-code"
                                            type="text"
                                            maxLength={10}
                                            placeholder="XXXX-XXXX"
                                            autoComplete="off"
                                            autoFocus
                                            disabled={isVerifying}
                                            className="w-full h-14 px-4 bg-muted/30 border border-border rounded-lg text-center text-xl tracking-widest font-mono text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50 uppercase"
                                            {...recoveryForm.register("code")}
                                        />
                                        {recoveryForm.formState.errors.code && (
                                            <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {recoveryForm.formState.errors.code.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isVerifying}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Vérification...
                                            </>
                                        ) : (
                                            <>
                                                <Key className="w-4 h-4" />
                                                Utiliser ce code
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* TOTP Form */
                                <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-6">
                                    <div>
                                        <label
                                            className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider"
                                            htmlFor="code"
                                        >
                                            Code d&apos;authentification
                                        </label>
                                        <input
                                            id="code"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={6}
                                            placeholder="000000"
                                            autoComplete="one-time-code"
                                            autoFocus
                                            disabled={isVerifying}
                                            className="w-full h-14 px-4 bg-muted/30 border border-border rounded-lg text-center text-2xl tracking-[0.5em] font-mono text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50"
                                            {...form.register("code")}
                                        />
                                        {form.formState.errors.code && (
                                            <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {form.formState.errors.code.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isVerifying}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Vérification...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-4 h-4" />
                                                Vérifier et continuer
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Toggle Mode Link */}
                            <div className="mt-6 pt-4 border-t border-border text-center">
                                <button
                                    type="button"
                                    onClick={toggleRecoveryMode}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                                >
                                    {useRecoveryCode ? (
                                        <>
                                            <ShieldCheck className="w-4 h-4" />
                                            Utiliser un code d&apos;authentification
                                        </>
                                    ) : (
                                        <>
                                            <Key className="w-4 h-4" />
                                            Téléphone perdu ? Utiliser un code de secours
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Cancel Link */}
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleCancel}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Annuler et se déconnecter
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Help Text */}
                <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
                    {useRecoveryCode
                        ? "Les codes de secours sont à usage unique. Une fois utilisé, ce code sera invalidé."
                        : "Ouvrez Google Authenticator sur votre appareil et entrez le code à 6 chiffres affiché pour Silo."}
                </p>
            </div>
        </main>
    )
}
