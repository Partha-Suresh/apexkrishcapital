import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import AgentationProvider from "@/components/AgentationProvider";
import ThemeProvider from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { dark, neobrutalism, shadcn } from "@clerk/ui/themes";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ScrollRestorationManager from "@/components/ScrollRestorationManager";

export const metadata: Metadata = {
  title: "Apex Krish Capital | Frontier Technology & Private Equity Investments",
  description:
    "Apex Krish Capital identifies and curates high-conviction private market investments across AI, biotechnology, and advanced computing for accredited investors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <ScrollRestorationManager />
        <ThemeProvider>
          <ClerkProvider
            appearance={{
              theme: neobrutalism,
            }}>
            <Navbar />
            {children}
            <AgentationProvider />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

