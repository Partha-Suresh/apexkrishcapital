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
          <div className="pointer-events-auto flex w-full items-center justify-between rounded-[20px] border border-border/70 bg-background/80 py-2.5 px-5 shadow-sm backdrop-blur-xl transition-all">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-transform active:scale-[0.98]"
                aria-label="Apex Krish Capital Home"
              >
                <Image
                  src="/apexkrishnalogo.png"
                  alt="Apex Krish Capital"
                  width={50}
                  height={50}
                  className="rounded-md object-contain"
                  priority
                />
                <span className="text-[18px] font-bold tracking-tight text-foreground">
                  Apex Krish
                </span>
              </Link>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-7 text-[14px] font-[450] text-muted-foreground">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth & CTA */}
            <div className="flex items-center gap-3">
              {isLoaded ? (
                isSignedIn ? (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/profile"
                      className="hidden sm:inline-flex text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Investor Profile
                    </Link>
                    <DropdownMenuAvatar img_url={user?.imageUrl} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/sign-in"
                      className="flex h-9 items-center justify-center rounded-[12px] bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] shadow-xs whitespace-nowrap"
                    >
                      Log in
                    </Link>
                  </div>
                )
              ) : (
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
              )}
              <DarkModeToggle />

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-[12px] border border-border bg-background text-foreground hover:bg-muted transition active:scale-95 shadow-xs"
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
                "pointer-events-auto absolute right-[-100px] top-1/2 -translate-y-1/2 hidden sm:inline-flex h-11 items-center justify-center rounded-full border px-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] backdrop-blur-2xl transition-all whitespace-nowrap",
                isAdminPage
                  ? "border-primary/50 bg-background text-foreground shadow-[0_0_12px_rgba(59,130,246,0.18)] dark:shadow-[0_0_14px_rgba(59,130,246,0.25)] hover:shadow-[0_0_16px_rgba(59,130,246,0.28)]"
                  : "border-border/80 bg-background/95 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-primary/40 hover:shadow-[0_0_12px_rgba(59,130,246,0.18)] dark:hover:shadow-[0_0_14px_rgba(59,130,246,0.22)]"
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
          <div className="rounded-[22px] border border-border bg-popover/95 text-popover-foreground p-5 shadow-lg backdrop-blur-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  Navigation
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground">
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

              <div className="my-1 h-[0.5px] w-full bg-border" />

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

