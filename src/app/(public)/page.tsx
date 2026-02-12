import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-2xl">
                <h1 className="text-5xl font-bold tracking-tight">
                    Welcome to <span className="text-primary">SILO</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Your Personal Knowledge Management System.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-3 bg-muted border border-border text-foreground rounded-xl font-semibold hover:bg-accent transition-all"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}
