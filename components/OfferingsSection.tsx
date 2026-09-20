"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Info,
  Building2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UserInteraction = {
  type: "interest" | "commitment";
  amount?: number | null;
};

type OfferingsSectionProps = {
  initialVerificationStatus?: string | null;
  isSignedIn?: boolean;
};

export default function OfferingsSection({
  initialVerificationStatus,
  isSignedIn: initialIsSignedIn,
}: OfferingsSectionProps) {
  const { isLoaded: isClerkLoaded, isSignedIn: clerkIsSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedIn ?? false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    initialVerificationStatus ?? null
  );
  const [interactions, setInteractions] = useState<Record<string, UserInteraction>>({});
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);

  // Commit Dialog State
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [commitAmount, setCommitAmount] = useState("5000");
  const [commitError, setCommitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Interest loading state
  const [isExpressingInterest, setIsExpressingInterest] = useState(false);

  // Fetch current user state & interactions when clerk auth state changes
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (!clerkIsSignedIn) {
      setIsSignedIn(false);
      setVerificationStatus(null);
      setInteractions({});
      setIsLoadingInteractions(false);
      return;
    }

    let isMounted = true;

    async function loadInteractions() {
      setIsLoadingInteractions(true);
      try {
        const res = await fetch("/api/offerings/my-interactions", {
          cache: "no-store",
        });
        const data = await res.json();
        if (isMounted && res.ok) {
          setIsSignedIn(!!data.isSignedIn);
          setVerificationStatus(data.verificationStatus);
          setInteractions(data.interactions || {});
        }
      } catch (err) {
        console.error("Failed to load user interactions:", err);
      } finally {
        if (isMounted) setIsLoadingInteractions(false);
      }
    }

    loadInteractions();
    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, clerkIsSignedIn]);

  const isVerified = isSignedIn && verificationStatus === "verified";
  const isPending = isSignedIn && verificationStatus !== "verified";

  // Handle "I'm Interested" action
  async function handleExpressInterest(offeringId: string) {
    if (!isSignedIn) return;
    if (!isVerified) return;

    setIsExpressingInterest(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/offerings/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offeringId, type: "interest" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to record interest.");
      }

      setInteractions((prev) => ({
        ...prev,
        [offeringId]: { type: "interest", amount: null },
      }));

      setSuccessMessage("Interest successfully recorded. Our syndicate partners will keep you updated on allocations.");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to record interest.");
    } finally {
      setIsExpressingInterest(false);
    }
  }

  // Handle Commit Capital action
  async function handleCommitSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCommitError(null);

    const amountNum = Number(commitAmount);
    const minAmount = 5000;

    if (isNaN(amountNum) || amountNum < minAmount) {
      setCommitError(`Minimum investment is $${minAmount.toLocaleString()} USD.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/offerings/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offeringId: "micro1-inc",
          type: "commitment",
          amount: amountNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit commitment.");
      }

      setInteractions((prev) => ({
        ...prev,
        "micro1-inc": { type: "commitment", amount: amountNum },
      }));

      setCommitModalOpen(false);
      setSuccessMessage(`Commitment of $${amountNum.toLocaleString()} USD submitted successfully.`);
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      setCommitError(err.message || "Unable to submit commitment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const micro1Interaction = interactions["micro1-inc"];

  return (
    <section id="offerings" className="space-y-8 py-6 scroll-mt-24">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>01 / PRIVATE SYNDICATE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Current & Past Offerings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Direct SPV allocations into high-conviction frontier technology growth rounds.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab("current")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3.5 py-1.5 font-medium transition cursor-pointer",
              activeTab === "current"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Current Deal (1)
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3.5 py-1.5 font-medium transition cursor-pointer",
              activeTab === "past"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Past Deals (3)
          </button>
        </div>
      </div>

      {/* Global Success Banner */}
      {successMessage && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 font-mono text-xs">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* TAB CONTENT: CURRENT OFFERINGS */}
      {activeTab === "current" && (
        <div className="space-y-6">
          {/* Main Micro1 Card */}
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 shadow-xs relative">
            {/* Top Badge Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 uppercase tracking-wider text-[10.5px]">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active Offering
                </span>
                <span className="px-2.5 py-0.5 rounded border border-border bg-muted/30 text-muted-foreground text-[10.5px] uppercase">
                  Direct SPV Equity
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>Closing: <strong className="text-foreground font-semibold">Sept 30, 2026</strong></span>
              </div>
            </div>

            {/* Main Info */}
            <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-wider">
                    <Building2 className="size-3.5" />
                    Equity: Direct shares in Micro1 Inc.
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    Micro1 Inc.
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Micro1 provides AI-driven technical vetting and global talent infrastructure, powering developer teams at top hyper-growth tech companies. Direct secondary share access via Apex Krish Capital syndicate.
                </p>

                {/* Key Offering Terms Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                      Valuation
                    </span>
                    <p className="text-base font-semibold text-foreground mt-0.5 tabular-nums">
                      $3.7B
                    </p>
                    <span className="text-[10px] text-muted-foreground">Pre-money</span>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                      Funding Goal
                    </span>
                    <p className="text-base font-semibold text-foreground mt-0.5 tabular-nums">
                      $125K
                    </p>
                    <span className="text-[10px] text-muted-foreground">Allocation cap</span>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                      Minimum Check
                    </span>
                    <p className="text-base font-semibold text-foreground mt-0.5 tabular-nums">
                      $5K
                    </p>
                    <span className="text-[10px] text-muted-foreground">USD per investor</span>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                      Eligibility
                    </span>
                    <p className="text-base font-semibold text-foreground mt-0.5">
                      Accredited
                    </p>
                    <span className="text-[10px] text-muted-foreground">506(c) verified</span>
                  </div>
                </div>
              </div>

              {/* Action Box / Status Panel */}
              <div className="lg:col-span-5 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Participation Status
                  </span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                      <CheckCircle2 className="size-3" />
                      Verified Investor
                    </span>
                  ) : isSignedIn ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                      <AlertCircle className="size-3" />
                      Verification Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold">
                      <Lock className="size-3" />
                      Public Preview
                    </span>
                  )}
                </div>

                {/* State-specific CTA / Notice */}
                {!isSignedIn ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All offering details are publicly visible. To express interest or commit capital to Micro1 Inc., please sign in as an accredited investor.
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Button asChild className="w-full h-10 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-xs">
                        <Link href="/sign-in">Log in to participate</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full h-10 rounded-xl font-semibold text-xs uppercase tracking-wider">
                        <Link href="/profile">Complete Investor Profile</Link>
                      </Button>
                    </div>
                  </div>
                ) : isPending ? (
                  <div className="space-y-3 pt-1">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-300 leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="size-4 shrink-0 text-amber-500" />
                        Administrator Verification Required
                      </div>
                      <p>
                        Your investor profile is pending review by our administrator. Once verified, direct investment commitments and deal interest buttons will be unlocked.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full h-10 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      <Link href="/profile">Review Investor Profile</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    {/* User has committed or expressed interest banner */}
                    {micro1Interaction?.type === "commitment" ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-300 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                          Active Allocation Request
                        </span>
                        <p className="text-lg font-bold text-foreground">
                          ${micro1Interaction.amount?.toLocaleString()} USD Committed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Our closing team will reach out with wire instructions and subscription documents prior to the Sept 30th deadline.
                        </p>
                      </div>
                    ) : micro1Interaction?.type === "interest" ? (
                      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-blue-900 dark:text-blue-300 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="size-4 text-blue-500" />
                          Interest Expressed
                        </div>
                        <p className="text-muted-foreground">
                          You are on the priority list for this SPV. You can also formalize your dollar commitment below.
                        </p>
                      </div>
                    ) : null}

                    {/* Action Buttons for Verified User */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Button
                        variant={micro1Interaction?.type === "interest" ? "secondary" : "outline"}
                        onClick={() => handleExpressInterest("micro1-inc")}
                        disabled={isExpressingInterest}
                        className="h-10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        {isExpressingInterest ? (
                          <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        ) : micro1Interaction?.type === "interest" ? (
                          <CheckCircle2 className="size-3.5 text-primary mr-1.5" />
                        ) : null}
                        {micro1Interaction?.type === "interest" ? "Interested ✓" : "I'm Interested"}
                      </Button>

                      <Button
                        onClick={() => setCommitModalOpen(true)}
                        className="h-10 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs"
                      >
                        {micro1Interaction?.type === "commitment" ? "Update Commitment" : "Commit Capital"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PAST OFFERINGS */}
      {activeTab === "past" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scale AI */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border">
                Series F SPV
              </span>
              <span className="text-muted-foreground">
                Funded
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Scale AI</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Foundational AI data infrastructure & model validation platform. Direct SPV secondary syndicate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono text-xs">
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Valuation</span>
                <p className="font-bold text-foreground">$14.0B</p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Status</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Distributed</p>
              </div>
            </div>
          </div>

          {/* xAI */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border">
                Series B SPV
              </span>
              <span className="text-muted-foreground">
                Funded
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">xAI</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Frontier artificial intelligence research, Grok models, and high-performance supercomputing clusters.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono text-xs">
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Valuation</span>
                <p className="font-bold text-foreground">$24.0B</p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Status</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Distributed</p>
              </div>
            </div>
          </div>

          {/* Neuralink */}
          <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border">
                Direct SPV
              </span>
              <span className="text-muted-foreground">
                Funded
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Neuralink</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Brain-computer interface (BCI) technology restoring autonomy and pioneering human-AI integration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono text-xs">
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Valuation</span>
                <p className="font-bold text-foreground">$7.0B</p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/60 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block">Status</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Distributed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMIT CAPITAL MODAL */}
      {commitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-xl space-y-5 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-border font-mono">
              <div>
                <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold">
                  CAPITAL COMMITMENT
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  Micro1 Inc. SPV Series
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCommitModalOpen(false)}
                className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Terms reminder */}
            <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Minimum Investment:</span>
                <strong className="text-foreground">$5,000 USD</strong>
              </div>
              <div className="flex justify-between">
                <span>Funding Deadline:</span>
                <strong className="text-foreground">Sept 30th, 2026</strong>
              </div>
              <div className="flex justify-between">
                <span>Pre-money Valuation:</span>
                <strong className="text-foreground">$3.7B USD</strong>
              </div>
            </div>

            <form onSubmit={handleCommitSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Commitment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">
                    $
                  </span>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={commitAmount}
                    onChange={(e) => {
                      setCommitAmount(e.target.value);
                      if (commitError) setCommitError(null);
                    }}
                    placeholder="5000"
                    className="w-full h-12 pl-8 pr-4 rounded-xl border border-input bg-background text-base font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary tabular-nums"
                  />
                </div>
              </div>

              {/* Amount Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[5000, 10000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCommitAmount(preset.toString())}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer",
                      Number(commitAmount) === preset
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>

              {commitError && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {commitError}
                </p>
              )}

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By submitting this commitment, you express binding intent to participate in this SPV subject to receipt of formal subscription agreements and closing verification.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCommitModalOpen(false)}
                  className="rounded-xl text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-2" />
                      Recording...
                    </>
                  ) : (
                    "Confirm Commitment"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

