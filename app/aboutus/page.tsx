import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, ShieldCheck, FileCheck2 } from "lucide-react";

export const metadata = {
  title: "About Us | Apex Krish Capital (Test Build)",
  description: "Learn about Apex Krish Capital, our investment philosophy, and frontier tech thesis.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-[800px] px-4 sm:px-6 pt-28 pb-16 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Test Build Home</span>
        </Link>

        {/* Hero */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            ABOUT APEX KRISH CAPITAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Disciplined Research & Curated Access
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Apex Krish Capital is dedicated to providing accredited investors with
            exclusive access to private equity opportunities in frontier technology
            sectors—focused on artificial intelligence, biotechnology, and advanced
            computing.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-card-foreground">
              Innovative Investment Strategies
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We leverage disciplined research and market insights to identify and
              invest in transformative sectors, ensuring long-term value for our
              investors.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-card-foreground">
              Direct SPV Model
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our Special Purpose Vehicle model allows investors to participate in
              specific, ring-fenced opportunities with maximum transparency and risk
              isolation.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-card-foreground">
              Expert Team of Professionals
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seasoned experts with extensive experience in private equity, technology
              investments, and collaborative syndicate management.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-card-foreground">
              Commitment to Transparency
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clear communication, continuous portfolio marks, and fiduciary integrity
              throughout every investment lifecycle.
            </p>
          </div>
        </div>

        {/* Minimal CTA */}
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-foreground">
            Ready to explore active SPV syndications?
          </p>
          <Link
            href="/#waitlist"
            className="inline-flex h-9 px-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider items-center justify-center hover:bg-primary/90 transition shadow-xs"
          >
            Join Waitlist
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-border bg-background py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Apex Krish Capital. Test Build / Preview Release.</p>
      </footer>
    </div>
  );
}
