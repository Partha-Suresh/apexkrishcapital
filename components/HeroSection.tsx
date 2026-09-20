"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Scale,
  Activity,
  Layers,
  ShieldCheck,
  Percent,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const { isLoaded: isClerkLoaded, isSignedIn: clerkIsSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<"allocation" | "carry_ledger" | "spv_mechanics">("allocation");
  const [simulatedGain, setSimulatedGain] = useState<number>(100000);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    if (!isClerkLoaded) return;

    if (!clerkIsSignedIn) {
      setIsSignedIn(false);
      setIsProfileSaved(false);
      setIsLoadingAuth(false);
      return;
    }

    let isMounted = true;
    async function loadUserState() {
      setIsLoadingAuth(true);
      try {
        const res = await fetch("/api/offerings/my-interactions", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsSignedIn(!!data.isSignedIn);
            setIsProfileSaved(!!data.isProfileSaved);
          }
        }
      } catch (e) {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoadingAuth(false);
      }
    }
    loadUserState();
    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, clerkIsSignedIn]);

  // Fee calculations
  const peCarry = Math.round(simulatedGain * 0.20);
  const apexCarry = Math.round(simulatedGain * 0.10);
  const netSavings = peCarry - apexCarry;
  const lpApexTakehome = simulatedGain - apexCarry;
  const lpPeTakehome = simulatedGain - peCarry;

  return (
    <section className="relative pt-4 sm:pt-8 pb-4 space-y-10">
      {/* EDITORIAL HERO HEADER */}
      <div className="space-y-6 max-w-3xl">
        {/* Monospace Metadata Tag */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-border bg-muted/60 text-foreground font-semibold">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            DIRECT SPV ALLOCATIONS
          </span>
          <span className="text-border">/</span>
          <span>10% PERFORMANCE CARRY</span>
          <span className="text-border">/</span>
          <span>SEC RULE 506(C)</span>
        </div>

        {/* High-Contrast Conversion Headline */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.04em] text-foreground leading-[1.08]">
          Frontier private tech investments.{" "}
          <span className="text-muted-foreground font-normal">
            At half the industry carry fee.
          </span>
        </h1>

        {/* Narrative Value Proposition */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
          While larger players in the private equity market charge fees upwards of 20% of profits, we charge half of that (10% carry). You leave it to us to source, diligience, and structure direct allocations into the right companies.
        </p>

        {/* High-Intent CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Button
            asChild
            size="lg"
            className="h-12 px-7 rounded-full font-semibold text-xs uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer group shadow-xs"
          >
            <a href="#offerings" className="flex items-center justify-center gap-2">
              Explore Active Allocations
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-7 rounded-full font-semibold text-xs uppercase tracking-wider border-border hover:bg-muted cursor-pointer"
          >
            <Link href="/profile" className="flex items-center justify-center gap-2">
              {isSignedIn && isProfileSaved ? (
                <>
                  <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Update Investor Profile</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-4 text-muted-foreground" />
                  <span>Complete Investor Profile</span>
                </>
              )}
            </Link>
          </Button>
        </div>

        {/* Editorial Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/70 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">01</span>
            <span>10% carry (vs 20%+ PE)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">02</span>
            <span>$5,000 accessible min.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">03</span>
            <span>Direct Delaware SPVs</span>
          </div>
        </div>
      </div>

      {/* ARCHITECTURAL ALLOCATION & CARRY LEDGER (SiteInspire Aesthetic) */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground overflow-hidden shadow-xs">
        {/* Ledger Header & Segment Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
              SYNDICATE TERMINAL
            </span>
            <span className="text-border">·</span>
            <span className="font-mono text-xs text-foreground font-semibold">
              ALLOCATION LEDGER
            </span>
          </div>

          {/* Segment Tabs */}
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5 self-start sm:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab("allocation")}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5",
                activeTab === "allocation"
                  ? "bg-muted text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Current SPV: Micro1</span>
            </button>
            <button
              onClick={() => setActiveTab("carry_ledger")}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5",
                activeTab === "carry_ledger"
                  ? "bg-muted text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Carry Advantage Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab("spv_mechanics")}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5",
                activeTab === "spv_mechanics"
                  ? "bg-muted text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Legal & SPV Architecture</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CURRENT SPV TERM SHEET */}
        {activeTab === "allocation" && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                    ● ACTIVE SYNDICATION
                  </span>
                  <span className="text-muted-foreground">Series Secondary Equity</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Micro1 Inc.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  AI-powered engineer vetting and global developer infrastructure. Direct equity access through isolated Apex Krish Capital SPV series.
                </p>
              </div>

              <Button asChild size="sm" className="rounded-full text-xs font-semibold uppercase tracking-wider shrink-0">
                <a href="#offerings">View Deal Room</a>
              </Button>
            </div>

            {/* Financial Terms Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
              <div className="bg-card p-4 space-y-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Pre-Money Valuation
                </span>
                <p className="text-xl font-bold text-foreground tabular-nums">$3.7B</p>
                <span className="text-[10px] text-muted-foreground font-mono">Institutional valuation</span>
              </div>

              <div className="bg-card p-4 space-y-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Performance Carry
                </span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">10%</p>
                <span className="text-[10px] text-muted-foreground font-mono">50% below PE standard</span>
              </div>

              <div className="bg-card p-4 space-y-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Minimum Commitment
                </span>
                <p className="text-xl font-bold text-foreground tabular-nums">$5,000</p>
                <span className="text-[10px] text-muted-foreground font-mono">USD accredited entry</span>
              </div>

              <div className="bg-card p-4 space-y-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Closing Deadline
                </span>
                <p className="text-xl font-bold text-foreground">Sept 30, 2026</p>
                <span className="text-[10px] text-muted-foreground font-mono">$125K allocation cap</span>
              </div>
            </div>

            {/* Capacity Footnote */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Allocation limit: $125,000 USD (Accredited verification required to commit)</span>
              </div>
              <a href="#offerings" className="text-foreground hover:underline inline-flex items-center gap-1 font-semibold">
                Go to commitment form <ArrowUpRight className="size-3" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: CARRY ADVANTAGE LEDGER (Real Numbers) */}
        {activeTab === "carry_ledger" && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  The 10% vs. 20%+ Carry Breakdown
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Direct capital impact on standard venture and private equity exit gains
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold">
                +${netSavings.toLocaleString()} USD Kept by LP
              </div>
            </div>

            {/* Capital Gain Selectors */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Select Example Exit Profit Gain:
              </span>
              <div className="flex flex-wrap gap-2 font-mono">
                {[50000, 100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSimulatedGain(amount)}
                    className={cn(
                      "px-3 py-1 rounded border text-xs transition cursor-pointer font-medium",
                      simulatedGain === amount
                        ? "border-foreground bg-foreground text-background font-semibold"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    ${amount.toLocaleString()} Net Gain
                  </button>
                ))}
              </div>
            </div>

            {/* Ledger Breakdown Table */}
            <div className="rounded-xl border border-border overflow-hidden text-xs font-mono">
              <div className="grid grid-cols-3 bg-muted/60 p-3 font-semibold text-muted-foreground border-b border-border uppercase tracking-wider text-[10.5px]">
                <div>Metric</div>
                <div>Traditional PE (20% Carry)</div>
                <div className="text-emerald-600 dark:text-emerald-400">Apex Krish Capital (10% Carry)</div>
              </div>

              <div className="grid grid-cols-3 p-3 border-b border-border/60 bg-card items-center">
                <div className="text-muted-foreground">Deal Profit Realized</div>
                <div className="font-semibold text-foreground">${simulatedGain.toLocaleString()}</div>
                <div className="font-semibold text-foreground">${simulatedGain.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-3 p-3 border-b border-border/60 bg-card items-center">
                <div className="text-muted-foreground">Performance Fee Deducted</div>
                <div className="text-destructive font-semibold">-${peCarry.toLocaleString()} (20%)</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">-${apexCarry.toLocaleString()} (10%)</div>
              </div>

              <div className="grid grid-cols-3 p-3 bg-muted/20 items-center font-bold">
                <div className="text-foreground">Net Profit in Your Pocket</div>
                <div className="text-muted-foreground text-sm">${lpPeTakehome.toLocaleString()}</div>
                <div className="text-emerald-600 dark:text-emerald-400 text-sm">
                  ${lpApexTakehome.toLocaleString()} (+${netSavings.toLocaleString()})
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-muted-foreground">
              By reducing carry from 20% to 10%, you retain an additional \$10,000 on every \$100,000 of investment profit.
            </p>
          </div>
        )}

        {/* TAB 3: SPV LEGAL STRUCTURE */}
        {activeTab === "spv_mechanics" && (
          <div className="p-5 sm:p-7 space-y-5">
            <div className="pb-3 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">
                Fiduciary & SPV Mechanics
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Institutional legal architecture designed for clean liability segregation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Structure
                </span>
                <h4 className="font-bold text-foreground text-sm">Delaware Series LLC</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Each company offering is isolated inside a dedicated series. Assets and liabilities are legally ring-fenced with zero cross-fund contamination.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Cap Table
                </span>
                <h4 className="font-bold text-foreground text-sm">Direct Economic Pass-Through</h4>
                <p className="text-muted-foreground leading-relaxed">
                  LPs receive pro-rata beneficial ownership matching institutional preferred stock with direct liquidation preference pass-throughs.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Alignment
                </span>
                <h4 className="font-bold text-foreground text-sm">Pure Carry Model</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Zero management fees on direct syndicated SPVs. We only generate revenue when our syndicated investors generate net profits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
