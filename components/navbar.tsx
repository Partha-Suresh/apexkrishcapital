'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { DropdownMenuAvatar } from "./avatarbutton";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "About Us", href: "/aboutus" },
  { label: "Focus", href: "/#focus" },
  { label: "Waitlist", href: "/#waitlist" },
];

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop & Tablet Floating Navbar */}
      <header className="fixed top-5 md:top-8 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
        <div className="pointer-events-auto flex w-full max-w-[840px] items-center justify-between rounded-[20px] border border-white/80 bg-[rgba(248,249,250,0.75)] py-2.5 px-5 shadow-[0_10px_35px_-10px_rgba(10,10,10,0.1)] backdrop-blur-[20px] transition-all">
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
                width={28}
                height={28}
                className="rounded-md object-contain"
                priority
              />
              <span className="text-[14px] font-semibold tracking-tight text-zinc-950">
                Apex Krish
              </span>
            </Link>

            <span className="flex items-center justify-center px-2 py-0.5 rounded-[4px] bg-black text-white text-[8.5px] font-bold tracking-[0.7px] uppercase font-mono">
              TEST BUILD
            </span>
          </div>


          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-[450] text-zinc-500">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth & CTA */}
          <div className="flex items-center gap-3">
            {isLoaded ? (
              isSignedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="hidden sm:inline-flex text-[13px] font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                  >
                    Investor Portal
                  </Link>
                  <DropdownMenuAvatar img_url={user?.imageUrl} />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/sign-in"
                    className="hidden sm:inline-flex text-[14px] font-medium text-zinc-600 transition-colors hover:text-zinc-950"
                  >
                    Log in
                  </Link>
                  <a
                    href="#join"
                    className="flex h-9 items-center justify-center rounded-[12px] bg-black px-4 text-[13px] font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98] shadow-sm whitespace-nowrap"
                  >
                    Join Waitlist
                  </a>
                </div>
              )
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-200/50 animate-pulse" />
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-[12px] border border-zinc-200/80 bg-white text-zinc-800 transition active:scale-95 shadow-sm"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-[22px] border border-white/90 bg-white/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Navigation
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white">
                  Apex Krish
                </span>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-[15px] font-medium text-zinc-800 hover:text-zinc-950"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                </Link>
              ))}

              <div className="my-1 h-[0.5px] w-full bg-zinc-100" />

              {isLoaded && isSignedIn ? (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-[15px] font-medium text-zinc-900"
                  >
                    <span>My Profile</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-[14px] font-medium text-zinc-800"
                  >
                    Log In
                  </Link>
                  <a
                    href="#join"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-black text-[14px] font-medium text-white shadow-sm"
                  >
                    Join Investor Community
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

