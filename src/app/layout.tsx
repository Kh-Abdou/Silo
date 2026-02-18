import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeTransition } from "@/components/theme-transition"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Silo",
    description: "Personal Knowledge Management",
};

const materialSymbolsLink = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" href={materialSymbolsLink} />
            </head>
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                >
                    <ThemeTransition>
                        {children}
                    </ThemeTransition>
                </ThemeProvider>
            </body>
        </html>
    );
}
