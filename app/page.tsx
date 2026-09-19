'use client'

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Cpu,
  Dna,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Lock,
  Building,
  Layers,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OfferingsSection from "@/components/OfferingsSection";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Test Build Header Notice */}
      <div className="pt-24 sm:pt-28 pb-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[10.5px] font-mono font-medium text-muted-foreground shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          APEX KRISH CAPITAL · FRONTIER TECHNOLOGY SYNDICATE
        </span>
      </div>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[920px] px-4 sm:px-6 py-6 space-y-20">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-4 pb-2">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.12]">
              Invest in Tomorrow’s Innovations
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Apex Krish Capital identifies and curates high-conviction private market investments across artificial intelligence, biotechnology, and advanced computing for accredited investors.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild className="h-11 px-7 rounded-full font-semibold text-xs tracking-wider uppercase shadow-xs">
              <a href="#offerings">Explore Offerings</a>
            </Button>
            <Button asChild variant="outline" className="h-11 px-7 rounded-full font-semibold text-xs tracking-wider uppercase">
              <a href="#waitlist">Join Investor Community</a>
            </Button>
          </div>

          {/* Stats / Credentials Strip */}
          <div className="grid grid-cols-3 gap-3 pt-8 max-w-2xl mx-auto text-center">
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
              <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">$120M+</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Curated Deal Volume
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
              <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">$3.7B+</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Avg. Co. Valuation
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
              <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">100%</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Direct SPV Isolation
              </p>
            </div>
          </div>
        </section>

        {/* OFFERINGS SECTION (CURRENT: Micro1 Inc. & PAST OFFERINGS) */}
        <OfferingsSection />

        {/* CORE FOCUS SECTORS */}
        <section id="focus" className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              CORE SECTORS
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Where We Invest
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Our investment thesis focuses on transformative platform technologies that reshape industries and compound enterprise value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-border bg-card text-card-foreground p-6 space-y-3.5 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">Artificial Intelligence</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Foundation models, synthetic data pipelines, enterprise developer engines, and next-gen agentic workflows.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card text-card-foreground p-6 space-y-3.5 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">Advanced Computing</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Specialized silicon accelerators, optical interconnects, cloud hardware, and supercomputing infrastructure.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card text-card-foreground p-6 space-y-3.5 shadow-xs hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <Dna className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">Biotechnology & Neurotech</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Algorithmic drug discovery, genomic editing, neurotechnology, and computational therapeutics.
              </p>
            </div>
          </div>
        </section>

        {/* INVESTMENT PHILOSOPHY & PILLARS */}
        <section className="rounded-3xl border border-border bg-card text-card-foreground p-7 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              OUR APPROACH
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Disciplined Research & Curated Access
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              At Apex Krish Capital, we combine rigorous research methodologies with deep industry access to deliver institutional-grade private equity opportunities to accredited individuals and family offices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-2">
              <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>Rigorous Due Diligence</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every deal undergoes comprehensive financial, legal, and operational screening before being structured for investor syndication.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-2">
              <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                <Layers className="size-4 text-primary" />
                <span>Ring-Fenced SPVs</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Each opportunity is isolated inside a dedicated Special Purpose Vehicle, ensuring clean liability separation and transparent reporting.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-2">
              <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                <TrendingUp className="size-4 text-primary" />
                <span>Direct Equity Rights</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Investors gain direct economic participation in premier late-stage growth rounds alongside Tier-1 venture capital firms.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-2">
              <div className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
                <Award className="size-4 text-primary" />
                <span>Fiduciary Integrity</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uncompromising alignment of interest, continuous portfolio updates, and prompt distribution management.
              </p>
            </div>
          </div>
        </section>

        {/* INVESTOR COMMUNITY / WAITLIST FORM */}
        <section
          id="waitlist"
          className="rounded-3xl border border-border bg-muted/40 p-7 sm:p-10 text-center space-y-5"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              JOIN THE SYNDICATE
            </span>
            <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Join Our Accredited Investor Community
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Receive priority access to upcoming SPV syndications, allocation updates, and confidential quarterly research briefings.
            </p>
          </div>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium py-3">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you for your submission. Our investor relations team will reach out shortly.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@domain.com"
                className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                type="submit"
                className="h-11 px-6 rounded-full font-semibold uppercase tracking-wider text-xs shadow-xs shrink-0 cursor-pointer"
              >
                Join Waitlist
              </Button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground font-mono">
            SEC Rule 506(c) accredited investors only. Subject to verification.
          </p>
        </section>

        {/* CONTACT & OFFICE DETAILS */}
        <section className="rounded-3xl border border-border bg-card text-card-foreground p-6 sm:p-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-2.5 font-mono">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a href="mailto:info@apexkrishcapital.com" className="text-foreground hover:underline">
              info@apexkrishcapital.com
            </a>
          </div>
          <div className="flex items-center gap-2.5 font-mono">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href="tel:+17208456839" className="text-foreground hover:underline">
              +1 (720) 845-6839
            </a>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-muted-foreground">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">New York, NY 10001</span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border bg-background py-10 px-4 text-center text-xs text-muted-foreground space-y-3">
        <p>© {new Date().getFullYear()} Apex Krish Capital. All Rights Reserved.</p>
        <p className="text-[11px] max-w-xl mx-auto leading-relaxed">
          Apex Krish Capital provides private market investment opportunities exclusively to accredited investors under SEC Rule 506(c). Past performance is not indicative of future results. Private market securities involve substantial risk of loss.
        </p>
      </footer>
    </div>
  );
}
