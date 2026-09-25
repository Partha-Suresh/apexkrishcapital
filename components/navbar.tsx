'use client'

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { DropdownMenuAvatar } from "./avatarbutton";
import DarkModeToggle from "./dark-mode-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionClaims } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  // Scroll listener for adaptive elevation & contraction + scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Active Scroll-Spy for Homepage Sections
      if (window.location.pathname === "/" || window.location.pathname === "") {
        const offeringsEl = document.getElementById("offerings");
        if (offeringsEl) {
          const rect = offeringsEl.getBoundingClientRect();
          // Active when offerings is in the upper half of viewport or top entered viewport
          if (rect.top <= 260 && rect.bottom >= 120) {
            setActiveSection("offerings");
          } else {
            setActiveSection(null);
          }
        }
      } else {
        setActiveSection(null);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navItems = useMemo(() => [
    { label: "Offerings", href: "/#offerings" },
    { label: "About Us", href: "/aboutus" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ], [isAdmin]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Determine which item is actively matching the route or scroll section
  const activeRouteIndex = useMemo(() => {
    if (pathname === "/aboutus") return navItems.findIndex((i) => i.href === "/aboutus");
    if (pathname?.startsWith("/admin")) return navItems.findIndex((i) => i.href === "/admin");
    if ((pathname === "/" || pathname === "") && activeSection === "offerings") {
      return navItems.findIndex((i) => i.href === "/#offerings");
    }
    return -1;
  }, [pathname, activeSection, navItems]);

  const currentTargetIndex = hoveredIndex !== null ? hoveredIndex : activeRouteIndex;

  useEffect(() => {
    if (currentTargetIndex !== -1 && navItemRefs.current[currentTargetIndex]) {
      const el = navItemRefs.current[currentTargetIndex];
      if (el) {
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [currentTargetIndex, navItems, isScrolled]);

  return (
    <>
      {/* Desktop & Tablet Floating Navbar with Scroll-Adaptive Elevation */}
      <header
        className={cn(
          "fixed left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled ? "top-3 md:top-5" : "top-5 md:top-8"
        )}
      >
        <div className="relative w-full max-w-[840px]">
          {/* Scroll-Adaptive Pure Custom Liquid Glass Shell */}
          <div
            className={cn(
              "pointer-events-auto relative overflow-hidden flex w-full items-center justify-between rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isScrolled
                ? "py-2 px-5 md:px-5.5 border border-black/[0.08] dark:border-white/[0.14] bg-white/70 dark:bg-[#0c0c0e]/75 shadow-[0_16px_40px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_0_rgba(255,255,255,0.6),inset_0_-1px_1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_1.5px_0_rgba(255,255,255,0.2),inset_0_-1px_1px_0_rgba(255,255,255,0.03)] backdrop-blur-3xl backdrop-saturate-200 backdrop-brightness-105"
                : "py-2.5 px-6 border border-black/[0.04] dark:border-white/[0.06] bg-white/20 dark:bg-white/[0.03] shadow-[0_8px_24px_rgba(0,0,0,0.03),inset_0_1px_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl backdrop-saturate-150"
            )}
          >
            {/* Top Specular Rim Reflection - Dynamic on Scroll */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-opacity duration-300",
                isScrolled
                  ? "via-white/70 dark:via-white/30 opacity-100"
                  : "via-white/40 dark:via-white/15 opacity-70"
              )}
            />
            {/* Bottom Subtle Refraction Highlight */}
            <div className="pointer-events-none absolute inset-x-20 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.05] to-transparent" />

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
                  width={42}
                  height={42}
                  className="rounded-full object-contain transition-transform duration-300"
                  priority
                />
                <span className="text-[17px] font-bold tracking-tight text-foreground">
                  Apex Krish
                </span>
              </Link>
            </div>

            {/* Desktop Nav Items with Fluid Sliding Capsule */}
            <nav
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative hidden md:flex items-center gap-1 p-1 rounded-full text-[14px] font-medium"
            >
              {/* Fluid Sliding Capsule Background */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-black/[0.06] dark:bg-white/[0.12] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              {navItems.map((item, idx) => {
                const isItemActive = activeRouteIndex === idx;
                const isItemHovered = hoveredIndex === idx;
                const isHighlighted = isItemHovered || (hoveredIndex === null && isItemActive);

                return (
                  <Link
                    key={item.label}
                    ref={(el) => { navItemRefs.current[idx] = el; }}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className={cn(
                      "relative z-10 px-4 py-1.5 rounded-full transition-colors duration-200 cursor-pointer whitespace-nowrap",
                      isHighlighted
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
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
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/[0.06] text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition active:scale-95 shadow-xs cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden animate-in fade-in duration-150">
          <div className="relative overflow-hidden rounded-[24px] border border-black/[0.08] dark:border-white/[0.14] bg-white/95 dark:bg-[#0c0c0e]/95 text-foreground p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-3xl backdrop-saturate-200">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent" />
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
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


