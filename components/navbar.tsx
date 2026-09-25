'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { DropdownMenuAvatar } from "./avatarbutton";
import DarkModeToggle from "./dark-mode-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Offerings", href: "/#offerings" },
  { label: "About Us", href: "/aboutus" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionClaims } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = sessionClaims?.metadata?.role === "admin";
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {/* Desktop & Tablet Floating Navbar */}
      <header className="fixed top-5 md:top-8 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
        <div className="relative w-full max-w-[840px]">
          {/* Pure Custom Liquid Glass Shell */}
          <div className="pointer-events-auto relative overflow-hidden flex w-full items-center justify-between rounded-full border border-white/50 dark:border-white/[0.14] bg-white/30 dark:bg-white/[0.04] py-2 px-5 md:px-6 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.04),inset_0_1.5px_2px_0_rgba(255,255,255,0.85),inset_0_-1px_1.5px_0_rgba(255,255,255,0.25),inset_0_0_24px_rgba(255,255,255,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.3),inset_0_1.5px_2px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(255,255,255,0.06),inset_0_0_24px_rgba(255,255,255,0.02)] backdrop-blur-3xl backdrop-saturate-200 backdrop-brightness-105 transition-all">
            
            {/* Top Specular Rim Reflection */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/50 to-transparent" />
            {/* Bottom Subtle Refraction Highlight */}
            <div className="pointer-events-none absolute inset-x-16 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent" />

            {/* Brand */}
            <div className="flex items-center gap-2.5 relative z-10">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-transform active:scale-[0.98]"
                aria-label="Apex Krish Capital Home"
              >
                <Image
                  src="/apexkrishnalogo.png"
                  alt="Apex Krish Capital"
                  width={46}
                  height={46}
                  className="rounded-full object-contain"
                  priority
                />
                <span className="text-[17.5px] font-bold tracking-tight text-foreground">
                  Apex Krish
                </span>
              </Link>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1.5 text-[14px] font-[450] text-muted-foreground relative z-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3.5 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/[0.08] hover:text-foreground transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth & CTA */}
            <div className="flex items-center gap-2.5 md:gap-3 relative z-10">
              {isLoaded ? (
                isSignedIn ? (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/profile"
                      className="hidden sm:inline-flex text-[13px] font-medium text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/[0.08] transition-all"
                    >
                      Investor Profile
                    </Link>
                    <DropdownMenuAvatar img_url={user?.imageUrl} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/sign-in"
                      className="flex h-9 items-center justify-center rounded-full bg-foreground text-background px-4 text-[13px] font-medium transition-all shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:bg-foreground/90 active:scale-[0.98] whitespace-nowrap"
                    >
                      Log in
                    </Link>
                  </div>
                )
              ) : (
                <div className="w-9 h-9 rounded-full bg-muted/60 animate-pulse" />
              )}
              <DarkModeToggle />

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/[0.06] text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition active:scale-95 shadow-xs"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "pointer-events-auto absolute right-[-100px] top-1/2 -translate-y-1/2 hidden sm:inline-flex h-11 items-center justify-center rounded-full border px-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] backdrop-blur-3xl backdrop-saturate-200 transition-all whitespace-nowrap",
                isAdminPage
                  ? "border-primary/50 bg-white/40 dark:bg-black/50 text-foreground shadow-[0_0_16px_rgba(59,130,246,0.22),inset_0_1px_1.5px_0_rgba(255,255,255,0.7)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "border-white/40 dark:border-white/15 bg-white/30 dark:bg-white/[0.05] text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.1),inset_0_1px_1.5px_0_rgba(255,255,255,0.6)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.2)] hover:border-primary/40 hover:shadow-[0_0_14px_rgba(59,130,246,0.2)]"
              )}
            >
              Admin
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="relative overflow-hidden rounded-[24px] border border-white/50 dark:border-white/15 bg-white/80 dark:bg-[#0c0c0e]/80 text-foreground p-5 shadow-[0_30px_70px_rgba(0,0,0,0.25)] backdrop-blur-3xl backdrop-saturate-200">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent" />
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  Navigation
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  Apex Krish
                </span>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}

              <div className="my-1 h-[0.5px] w-full bg-border/40" />

              {isLoaded && isSignedIn ? (
                <div className="flex flex-col gap-2 pt-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span>Admin Dashboard</span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <span>My Profile</span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[14px] font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


