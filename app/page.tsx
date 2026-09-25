import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import OfferingsSection from "@/components/OfferingsSection";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Top System Notice Bar */}
      <div className="pt-24 sm:pt-28 pb-2 text-center">
        <p className="text-[11px] font-mono font-medium tracking-[0.2em] text-muted-foreground uppercase">
          APEX KRISH CAPITAL
        </p>
      </div>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[1150px] px-4 sm:px-6 py-4 space-y-24">
        {/* CONVERSION-OPTIMIZED HERO SECTION */}
        <HeroSection />

        {/* OFFERINGS SECTION (CURRENT: Micro1 Inc. & PAST OFFERINGS) */}
        <OfferingsSection />

        {/* CORE INVESTMENT THESIS & SECTOR INDEX */}
        <section id="focus" className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                RESEARCH THESIS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Sectors of Conviction
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {/* Sector 01 */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 sm:p-7 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded text-[11px]">01</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide text-xs">
                    Intelligence & Autonomous Agents
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Foundation Architectures & Applied AI Infrastructure
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-normal">
                  Backing category-leading teams building synthetic data pipelines, verified coding agents, autonomous developer infrastructure, and enterprise AI engines.
                </p>
              </div>

              <div className="sm:text-right shrink-0 pt-1 sm:pt-0">
                <span className="font-semibold text-xs text-foreground bg-muted/40 px-3 py-1.5 rounded-md inline-block border border-border/60">
                  Micro1 · Scale AI · xAI
                </span>
              </div>
            </div>

            {/* Sector 02 */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 sm:p-7 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded text-[11px]">02</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide text-xs">
                    Hardware & Scale
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Accelerated Computing & Silicon Systems
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-normal">
                  Next-generation datacenter interconnects, specialized ASIC accelerators, optical compute, and thermal architecture scaling massive cluster density.
                </p>
              </div>

              <div className="sm:text-right shrink-0 pt-1 sm:pt-0">
                <span className="font-semibold text-xs text-foreground bg-muted/40 px-3 py-1.5 rounded-md inline-block border border-border/60">
                  Series B through Pre-IPO
                </span>
              </div>
            </div>

            {/* Sector 03 */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 sm:p-7 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded text-[11px]">03</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide text-xs">
                    Frontier Science
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Neural Interfaces & Computational Therapeutics
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-normal">
                  Pioneering brain-computer interfaces (BCI), algorithmic small molecule discovery, genetic engineering, and neuro-restorative technologies.
                </p>
              </div>

              <div className="sm:text-right shrink-0 pt-1 sm:pt-0">
                <span className="font-semibold text-xs text-foreground bg-muted/40 px-3 py-1.5 rounded-md inline-block border border-border/60">
                  Neuralink SPV
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FIDUCIARY ARCHITECTURE & STANDARDS */}
        <section className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Fiduciary & Execution Standards
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm">
              How we protect syndicate members and ensure clean, institutional-grade equity ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                Rigorous Secondary Diligence
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                Direct verification of board approvals, company right-of-first-refusal (ROFR) waivers, capitalization table standings, and transfer restriction mechanics prior to capital calls.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                Delaware Ring-Fenced SPVs
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                Every deal is isolated in its own Delaware Series LLC. Each vehicle is bankruptcy-remote, completely insulating your capital from other portfolio investments.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                10% Pure Carry Alignment
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                We charge zero management fees on direct SPVs and cap our carry fee at 10%—half the standard 20%+ fee. Our economic upside is strictly tied to your net realized gain.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-2.5">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                SEC 506(c) Compliance
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                All allocations are strictly structured under SEC Rule 506(c) exemptions for verified accredited individuals, family offices, and qualified institutional buyers.
              </p>
            </div>
          </div>
        </section>

        {/* OFFICE & DIRECT COMMUNICATIONS */}
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8 text-xs font-mono text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <a href="mailto:info@apexkrishcapital.com" className="text-foreground hover:underline">
              info@apexkrishcapital.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <a href="tel:+17208456839" className="text-foreground hover:underline">
              +1 (303) 945-6062
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-foreground">10846 Glengate Cir, Littleton CO 80130 USA</span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border bg-background py-10 px-4 text-center text-xs font-mono text-muted-foreground space-y-3">
        <p>© {new Date().getFullYear()} Apex Krish Capital. All Rights Reserved.</p>
        <p className="text-[11px] max-w-xl mx-auto leading-relaxed text-muted-foreground/80">
          Apex Krish Capital provides private market investment opportunities exclusively to accredited investors under SEC Rule 506(c). Past performance is not indicative of future results. Private market securities involve substantial risk of loss.
        </p>
      </footer>
    </div>
  );
}
