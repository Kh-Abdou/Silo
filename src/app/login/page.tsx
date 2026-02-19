"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, AlertCircle, Loader2, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Hourglass } from "lucide-react"
import { useThemeTransition } from "@/components/theme-transition"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { signInWithGoogle, signInWithEmail } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

function LoginForm() {
    const { theme } = useTheme()
    const { toggleTheme } = useThemeTransition()
    const searchParams = useSearchParams()
    const [mounted, setMounted] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
    const [isLoading, setIsLoading] = React.useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

    // Forgot password modal state
    const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false)
    const [forgotEmail, setForgotEmail] = React.useState("")
    const [forgotEmailError, setForgotEmailError] = React.useState<string | null>(null)
    const [forgotLoading, setForgotLoading] = React.useState(false)
    const [forgotSuccess, setForgotSuccess] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const error = searchParams.get("error")
        if (error) {
            toast.error("Authentication failed", { description: "Please try again." })
        }
    }, [searchParams])


    const validateEmail = (value: string) => {
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email"
        return null
    }

    const validatePassword = (value: string) => {
        if (!value) return "Password is required"
        if (value.length < 6) return "Password must be at least 6 characters"
        return null
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        const error = validateEmail(value)
        setErrors(prev => error ? { ...prev, email: error } : (() => { const { email: _, ...rest } = prev; return rest })())
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        const error = validatePassword(value)
        setErrors(prev => error ? { ...prev, password: error } : (() => { const { password: _, ...rest } = prev; return rest })())
    }

    const validateForm = () => {
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)
        const newErrors: { email?: string; password?: string } = {}
        if (emailError) newErrors.email = emailError
        if (passwordError) newErrors.password = passwordError
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        const result = await signInWithEmail(email, password)

        if (result?.error) {
            toast.error("Sign in failed", { description: result.error })
            setIsLoading(false)
        }
        // If successful, redirect happens in server action
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        const result = await signInWithGoogle()

        if (result?.error) {
            toast.error("Google Sign-In failed", { description: result.error })
            setIsGoogleLoading(false)
        }
    }

    // Forgot Password handlers
    const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setForgotEmail(value)
        const error = validateEmail(value)
        setForgotEmailError(error)
    }

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const error = validateEmail(forgotEmail)
        if (error) {
            setForgotEmailError(error)
            return
        }

        setForgotLoading(true)

        try {
            const supabase = createClient()
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/auth/update-password`
            })

            if (resetError) {
                console.error("Reset password error:", resetError)
            }
        } catch (err) {
            console.error("Unexpected error during password reset:", err)
        }

        // Always show success regardless of whether email exists (security best practice)
        setForgotSuccess(true)
        setForgotLoading(false)
    }

    const handleForgotPasswordClose = () => {
        setForgotPasswordOpen(false)
        // Reset state after closing
        setTimeout(() => {
            setForgotEmail("")
            setForgotEmailError(null)
            setForgotSuccess(false)
        }, 300)
    }

    const openForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault()
        setForgotPasswordOpen(true)
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

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    href="/"
                    className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-all text-muted-foreground flex items-center justify-center group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
            </div>

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
                <Link href="/" className="mb-10 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                        <Hourglass className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Silo</h1>
                </Link>

                {/* Main Card */}
                <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-foreground">Sign in to your account</h2>
                        <p className="text-sm text-muted-foreground mt-2">Personal Knowledge Management for Developers</p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                            )}
                            <span>{isGoogleLoading ? "Redirecting..." : "Continue with Google"}</span>
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink mx-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">or</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        className={`w-full h-11 pl-11 pr-4 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.email ? "border-destructive" : "border-border"
                                            }`}
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="password">Password</label>
                                    <button
                                        type="button"
                                        className="text-xs text-primary hover:underline font-medium"
                                        onClick={openForgotPassword}
                                    >
                                        Forgot?
                                    </button>
                                </div>
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

                            {/* Submit Button */}
                            <button
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                            <p className="text-[10px] text-muted-foreground text-center mt-4 px-2">
                                By signing in, you agree to our{" "}
                                <Link href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                            </p>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link className="text-primary font-semibold hover:underline p-1" href="/signup">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>


            {/* Forgot Password Modal */}
            <Dialog open={forgotPasswordOpen} onOpenChange={handleForgotPasswordClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                        <DialogDescription>
                            Entrez votre adresse email pour recevoir un lien de réinitialisation.
                        </DialogDescription>
                    </DialogHeader>

                    {forgotSuccess ? (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <div className="text-center">
                                <p className="font-medium text-foreground">Email sent!</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    If an account exists with this email, a reset link has been sent.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleForgotPasswordClose}
                                className="mt-2 px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider" htmlFor="forgot-email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        className={`w-full h-11 pl-11 pr-4 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${forgotEmailError ? "border-destructive" : "border-border"
                                            }`}
                                        id="forgot-email"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={handleForgotEmailChange}
                                        autoFocus
                                    />
                                </div>
                                {forgotEmailError && (
                                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {forgotEmailError}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClose}
                                    className="flex-1 h-10 border border-border bg-card hover:bg-accent text-foreground font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {forgotLoading ? "Sending..." : "Send"}
                                </button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </main>
    )
}

export default function LoginPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading Silo...</p>
            </div>
        }>
            <LoginForm />
        </React.Suspense>
    )
}
