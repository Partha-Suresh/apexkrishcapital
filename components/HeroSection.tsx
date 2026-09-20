"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Building2,
  Lock,
  Layers,
  Activity,
  DollarSign,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  Scale,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"spv" | "comparison" | "structure">("spv");
  const [gainAmount, setGainAmount] = useState<number>(100000);

  // Calculations for carry comparison
  const standardFee = Math.round(gainAmount * 0.20);
  const apexFee = Math.round(gainAmount * 0.10);
  const investorKeepsStandard = gainAmount - standardFee;
  const investorKeepsApex = gainAmount - apexFee;
  const netSavings = standardFee - apexFee;

  return (
    <section className="relative pt-6 sm:pt-10 pb-8 space-y-12">
      {/* BACKGROUND ACCENTS & RADIAL GLOW (NO generic AI blobs, crisp geometric light) */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center overflow-hidden">
        <div className="h-[400px] w-[700px] rounded-full bg-gradient-to-b from-emerald-500/10 via-primary/5 to-transparent blur-3xl opacity-70 dark:opacity-40" />
      </div>

      {/* HERO COPY & CONVERSION HEADLINE */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-mono font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 shadow-xs">
          <Zap className="size-3.5 fill-emerald-500 text-emerald-500" />
          <span>10% CARRY FEE · HALF THE 20%+ INDUSTRY STANDARD</span>
        </div>

        {/* Conversion Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-foreground leading-[1.12]">
          Invest in top tech companies.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-emerald-600 dark:to-emerald-400">
            Keep 50% more of your upside.
          </span>
        </h1>

        {/* Narrative & Value Proposition */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          While larger players in the private equity market charge fees upwards of 20% of profits, we charge half of that. You leave it to us to secure your allocations in high-conviction frontier companies.
        </p>

        {/* High-Impact Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-7 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <a href="#offerings" className="flex items-center justify-center gap-2">
              Explore Active Allocations
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-7 rounded-full font-semibold text-xs uppercase tracking-wider border-border/80 hover:bg-muted cursor-pointer"
          >
            <a href="#waitlist">Join Accredited Syndicate</a>
          </Button>
        </div>

        {/* Micro-Trust Footnote */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            SEC Rule 506(c) Ring-Fenced SPVs
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            $5,000 Accessible Minimum
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Zero Management Fees on Direct Deals
          </span>
        </div>
      </div>

      {/* INTERACTIVE SYNDICATE TERMINAL / ALLOCATION WINDOW (Agno & Humblytics Aesthetic) */}
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-border/80 bg-card text-card-foreground shadow-xl overflow-hidden transition-all">
        {/* Terminal Chrome Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-red-500/80 inline-block" />
              <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline-block ml-2">
              apexkrishcapital.com/syndicate/terminal
            </span>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="inline-flex rounded-xl border border-border/80 bg-background/80 p-0.5 shadow-xs">
            <button
              onClick={() => setActiveTab("spv")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === "spv"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Activity className="size-3" />
              <span>Live SPV</span>
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === "comparison"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Scale className="size-3" />
              <span>10% vs 20% Carry</span>
            </button>
            <button
              onClick={() => setActiveTab("structure")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === "structure"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck className="size-3" />
              <span>SPV Structure</span>
            </button>
          </div>
        </div>

        {/* Tab 1: LIVE SPV TERMINAL */}
        {activeTab === "spv" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Allocation
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">Series Secondary</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Micro1 Inc. · Direct Equity SPV
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Button asChild size="sm" className="rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs">
                  <a href="#offerings">View Terms & Commit</a>
                </Button>
              </div>
            </div>

            {/* Metrics Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Pre-Money Valuation
                </span>
                <p className="text-xl font-bold text-foreground mt-1 tabular-nums">$3.7B</p>
                <span className="text-[10px] text-muted-foreground font-mono">Institutional round</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Carry Performance Fee
                </span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">10%</p>
                <span className="text-[10px] text-muted-foreground font-mono">vs 20%+ standard</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Minimum Check
                </span>
                <p className="text-xl font-bold text-foreground mt-1 tabular-nums">$5,000</p>
                <span className="text-[10px] text-muted-foreground font-mono">Accessible entry</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Funding Deadline
                </span>
                <p className="text-xl font-bold text-foreground mt-1">Sept 30, 2026</p>
                <span className="text-[10px] text-muted-foreground font-mono">Target: $125K cap</span>
              </div>
            </div>

            {/* Live Progress Bar & Syndicate Note */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Syndicate Allocation Capacity:</span>
                <span className="font-semibold text-foreground">$125,000 Cap (Strict Allocation)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[42%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Direct cap table entry via ring-fenced Delaware SPV</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Allocations filling on verified basis</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CARRY COMPARISON CALCULATOR */}
        {activeTab === "comparison" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  The 10% Carry Advantage Calculator
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See how much more capital stays in your portfolio compared to traditional 20%+ private equity funds.
                </p>
              </div>
              <div className="inline-flex rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                +{netSavings.toLocaleString()} USD Kept
              </div>
            </div>

            {/* Profit Gain Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground block">
                Simulated Net Capital Gain on Deal:
              </label>
              <div className="flex flex-wrap gap-2">
                {[50000, 100000, 250000, 500000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setGainAmount(val)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer",
                      gainAmount === val
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    ${val.toLocaleString()} Gain
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Traditional PE 20% */}
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-semibold text-destructive">
                    Standard Private Equity
                  </span>
                  <span className="text-xs font-mono font-bold text-destructive">20% Carry</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    ${investorKeepsStandard.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Net investor return (${standardFee.toLocaleString()} paid in fees)
                  </p>
                </div>
              </div>

              {/* Apex Krish 10% */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-semibold text-emerald-700 dark:text-emerald-400">
                    Apex Krish Capital
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">10% Carry</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    ${investorKeepsApex.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 font-mono">
                    Net investor return (${apexFee.toLocaleString()} paid in fees · 50% savings)
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center font-mono">
              On every \$100,000 of profit, you keep an extra \$10,000 with Apex Krish Capital.
            </p>
          </div>
        )}

        {/* Tab 3: SPV STRUCTURE & INTEGRITY */}
        {activeTab === "structure" && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-border/70">
              <h3 className="text-xl font-bold text-foreground">
                Institutional SPV Architecture
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every deal is ring-fenced to ensure zero cross-collateralization and complete tax transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-xs">
                  <Layers className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Delaware Series LLC</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Isolated balance sheet per investment. Bankruptcy-remote legal structure protecting LP assets.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-xs">
                  <ShieldCheck className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Direct Cap Table Rights</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pass-through economic interest directly mirroring institutional Series preferred shares.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-xs">
                  <Percent className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">10% Carry Alignment</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We only profit when you profit. No multi-tier management fee drag or hidden administrative marks.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* METRIC STRIP / PROOF TICKER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">10%</p>
          <p className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
            Performance Carry Fee
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">$5,000</p>
          <p className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
            Accessible Min. Check
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">$120M+</p>
          <p className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
            Curated Deal Flow
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">100%</p>
          <p className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
            Ring-Fenced Delaware SPVs
          </p>
        </div>
      </div>
    </section>
  );
}

