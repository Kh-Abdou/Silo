"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Loader2, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [errors, setErrors] = React.useState<{ password?: string; confirm?: string }>({})
    const [isLoading, setIsLoading] = React.useState(false)
    const [isCheckingSession, setIsCheckingSession] = React.useState(true)
    const [isSuccess, setIsSuccess] = React.useState(false)

    // MFA State
    const [step, setStep] = React.useState<"password" | "2fa">("password")
    const [otpCode, setOtpCode] = React.useState("")
    const [verifyFactorId, setVerifyFactorId] = React.useState<string | null>(null)
    const [mfaEnabled, setMfaEnabled] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const supabase = createClient()

        const checkMfaStatus = async () => {
            const { data: aalData, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
            if (error) return // Fail silently or handle?

            if (aalData?.nextLevel === 'aal2') {
                setMfaEnabled(true)
                const { data: factors } = await supabase.auth.mfa.listFactors()
                if (factors?.totp?.length) {
                    const verified = factors.totp.find(f => f.status === 'verified')
                    if (verified) setVerifyFactorId(verified.id)
                }
            }
        }

        // Listen for auth state changes (handles the magic link token exchange)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                if (session) {
                    setIsCheckingSession(false)
                    checkMfaStatus()
                }
            }
        })

        // Initial check - but don't redirect immediately, give the listener a chance
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsCheckingSession(false)
                checkMfaStatus()
            } else {
                // If no session after 3 seconds, redirect
                setTimeout(() => {
                    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
                        if (!currentSession) {
                            toast.error("Session invalide ou expirée", {
                                description: "Veuillez demander un nouveau lien."
                            })
                            router.push("/login")
                        }
                    })
                }, 3000)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const validatePassword = (value: string) => {
        if (!value) return "Le mot de passe est requis"
        if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères"
        return null
    }

    const validateConfirmPassword = (value: string) => {
        if (!value) return "Veuillez confirmer le mot de passe"
        if (value !== password) return "Les mots de passe ne correspondent pas"
        return null
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        const error = validatePassword(value)
        setErrors(prev => error ? { ...prev, password: error } : (() => { const { password: _, ...rest } = prev; return rest })())
        // Re-validate confirm password if it's filled
        if (confirmPassword) {
            const confirmError = value !== confirmPassword ? "Les mots de passe ne correspondent pas" : null
            setErrors(prev => confirmError ? { ...prev, confirm: confirmError } : (() => { const { confirm: _, ...rest } = prev; return rest })())
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPassword(value)
        const error = validateConfirmPassword(value)
        setErrors(prev => error ? { ...prev, confirm: error } : (() => { const { confirm: _, ...rest } = prev; return rest })())
    }

    const validateForm = () => {
        const passwordError = validatePassword(password)
        const confirmError = validateConfirmPassword(confirmPassword)
        const newErrors: { password?: string; confirm?: string } = {}
        if (passwordError) newErrors.password = passwordError
        if (confirmError) newErrors.confirm = confirmError
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        const supabase = createClient()

        // If MFA is enabled and we are not yet verified (in password step), switch to 2FA step
        if (mfaEnabled && step === "password") {
            if (!verifyFactorId) {
                toast.error("Erreur MFA", { description: "Impossible de vérifier l'authentification à deux facteurs." })
                setIsLoading(false)
                return
            }
            setStep("2fa")
            setIsLoading(false)
            return
        }

        // If in 2FA step, verify code first
        if (step === "2fa") {
            const { error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
                factorId: verifyFactorId!,
                code: otpCode
            })

            if (challengeError) {
                toast.error("Code incorrect")
                setIsLoading(false)
                return
            }
        }

        // Proceed to update password (session is now AAL2 if MFA was required)
        // Add auth_success redirect param
        const { error } = await supabase.auth.updateUser({ password })
        // Note: updateUser redirect doesn't work for password updates in the same way, 
        // but we handle the success UI manually here anyway.

        if (error) {
            toast.error("Erreur", { description: error.message })
            setIsLoading(false)
            return
        }

        setIsSuccess(true)
        toast.success("Mot de passe mis à jour", {
            description: "Vous allez être redirigé vers le tableau de bord."
        })

        // Redirect to dashboard after brief delay
        setTimeout(() => router.push("/dashboard"), 1500)
    }

    // Loading state while checking session
    if (isCheckingSession) {
        return (
            <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 bg-noise flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Vérification de la session...</p>
                </div>
            </main>
        )
    }

    // Success state
    if (isSuccess) {
        return (
            <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500 bg-noise flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h2 className="text-xl font-semibold">Mot de passe mis à jour!</h2>
                    <p className="text-muted-foreground">Redirection en cours...</p>
                </div>
            </main>
        )
    }

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
            <div className="blob w-[160px] h-[160px] bg-gray-300/40 dark:bg-sky-400/20 top-[60%] right-[35%]" />
            <div className="blob w-[220px] h-[220px] bg-slate-100/50 dark:bg-blue-300/25 bottom-[10%] left-[15%]" />
            <div className="blob w-[140px] h-[140px] bg-white/60 dark:bg-indigo-300/20 bottom-[30%] right-[10%]" />

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-all text-muted-foreground"
                >
                    {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen p-4">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Silo</h1>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-foreground">Réinitialiser votre mot de passe</h2>
                        <p className="text-sm text-muted-foreground mt-2">Choisissez un nouveau mot de passe sécurisé</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {step === "password" ? (
                            <>
                                {/* New Password Input */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" htmlFor="password">
                                        Nouveau mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            className={`w-full h-11 pl-11 pr-11 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.password ? "border-destructive" : "border-border"
                                                }`}
                                            id="password"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" htmlFor="confirmPassword">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            className={`w-full h-11 pl-11 pr-11 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.confirm ? "border-destructive" : "border-border"
                                                }`}
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirm && (
                                        <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.confirm}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // 2FA Input Step
                            <div className="space-y-4">
                                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
                                <p className="text-center text-sm text-muted-foreground">
                                    Double authentification requise. Veuillez entrer le code de votre application.
                                </p>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider text-center" htmlFor="otp">
                                        Code de sécurité
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full h-12 text-center text-xl tracking-[0.5em] font-mono bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? "Traitement..." : (step === "password" ? (mfaEnabled ? "Suivant" : "Mettre à jour le mot de passe") : "Valider et mettre à jour")}
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                <div className="flex justify-center gap-6 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    <a className="hover:text-primary transition-colors" href="#">Documentation</a>
                    <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                    <a className="hover:text-primary transition-colors" href="#">Status</a>
                </div>
            </footer>
        </main>
    )
}
