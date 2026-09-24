import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Shield,
  Layers,
  Percent,
  FileCheck,
} from "lucide-react";
import OfferingsSection from "@/components/OfferingsSection";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Top System Notice Bar */}
      <div className="pt-24 sm:pt-28 pb-2 text-center">
        <span className="inline-flex items-center gap-2 rounded border border-border bg-muted/40 px-3 py-1 text-[10.5px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          APEX KRISH CAPITAL · PRIVATE MARKET SYNDICATE
        </span>
      </div>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[960px] px-4 sm:px-6 py-4 space-y-24">
        {/* CONVERSION-OPTIMIZED HERO SECTION */}
        <HeroSection />

        {/* OFFERINGS SECTION (CURRENT: Micro1 Inc. & PAST OFFERINGS) */}
        <OfferingsSection />

        {/* CORE INVESTMENT THESIS & SECTOR INDEX (SiteInspire Editorial Architecture) */}
        <section id="focus" className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                02 / RESEARCH THESIS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Sectors of Conviction
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground max-w-sm">
              Disciplined focus on asymmetric platform shifts across intelligence, computing, and biotechnology.
            </p>
          </div>

          <div className="space-y-px bg-border rounded-xl overflow-hidden border border-border">
            {/* Sector 01 */}
            <div className="bg-card p-6 sm:p-7 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">01</span>
                  <span className="text-border">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    Intelligence & Autonomous Agents
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Foundation Architectures & Applied AI Infrastructure
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Backing category-leading teams building synthetic data pipelines, verified coding agents, autonomous developer infrastructure, and enterprise AI engines.
                </p>
              </div>

              <div className="sm:text-right shrink-0 space-y-1 font-mono text-xs text-muted-foreground">
                <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Historical & Live Marks</span>
                <span className="font-semibold text-foreground">Micro1 · Scale AI · xAI</span>
              </div>
            </div>

            {/* Sector 02 */}
            <div className="bg-card p-6 sm:p-7 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">02</span>
                  <span className="text-border">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    Hardware & Scale
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Accelerated Computing & Silicon Systems
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Next-generation datacenter interconnects, specialized ASIC accelerators, optical compute, and thermal architecture scaling massive cluster density.
                </p>
              </div>

              <div className="sm:text-right shrink-0 space-y-1 font-mono text-xs text-muted-foreground">
                <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Focus Stage</span>
                <span className="font-semibold text-foreground">Series B through Pre-IPO</span>
              </div>
            </div>

            {/* Sector 03 */}
            <div className="bg-card p-6 sm:p-7 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">03</span>
                  <span className="text-border">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    Frontier Science
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Neural Interfaces & Computational Therapeutics
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Pioneering brain-computer interfaces (BCI), algorithmic small molecule discovery, genetic engineering, and neuro-restorative technologies.
                </p>
              </div>

              <div className="sm:text-right shrink-0 space-y-1 font-mono text-xs text-muted-foreground">
                <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Historical Marks</span>
                <span className="font-semibold text-foreground">Neuralink SPV</span>
              </div>
            </div>
          </div>
        </section>

        {/* FIDUCIARY ARCHITECTURE & STANDARDS */}
        <section className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                03 / STRUCTURAL INTEGRITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Fiduciary & Execution Standards
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground max-w-sm">
              How we protect syndicate members and ensure clean, institutional-grade equity ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
                <FileCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Rigorous Secondary Diligence</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Direct verification of board approvals, company right-of-first-refusal (ROFR) waivers, capitalization table standings, and transfer restriction mechanics prior to capital calls.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
                <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Delaware Ring-Fenced SPVs</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every deal is isolated in its own Delaware Series LLC. Each vehicle is bankruptcy-remote, completely insulating your capital from other portfolio investments.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
                <Percent className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>10% Pure Carry Alignment</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We charge zero management fees on direct SPVs and cap our carry fee at 10%—half the standard 20%+ fee. Our economic upside is strictly tied to your net realized gain.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
                <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>SEC 506(c) Compliance</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
