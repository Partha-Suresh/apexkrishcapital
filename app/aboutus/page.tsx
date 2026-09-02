import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, TrendingUp, Users, ShieldCheck, FileCheck2 } from "lucide-react";

export const metadata = {
  title: "About Us | Apex Krish Capital (Test Build)",
  description: "Learn about Apex Krish Capital, our investment philosophy, and frontier tech thesis.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="mx-auto w-full max-w-[800px] px-4 sm:px-6 pt-28 pb-16 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Test Build Home</span>
        </Link>

        {/* Hero */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            ABOUT APEX KRISH CAPITAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
            Disciplined Research & Curated Access
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
            Apex Krish Capital is dedicated to providing accredited investors with
            exclusive access to private equity opportunities in frontier technology
            sectors—focused on artificial intelligence, biotechnology, and advanced
            computing.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-950">
              Innovative Investment Strategies
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We leverage disciplined research and market insights to identify and
              invest in transformative sectors, ensuring long-term value for our
              investors.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-950">
              Direct SPV Model
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Our Special Purpose Vehicle model allows investors to participate in
              specific, ring-fenced opportunities with maximum transparency and risk
              isolation.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-950">
              Expert Team of Professionals
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Seasoned experts with extensive experience in private equity, technology
              investments, and collaborative syndicate management.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-950">
              Commitment to Transparency
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Clear communication, continuous portfolio marks, and fiduciary integrity
              throughout every investment lifecycle.
            </p>
          </div>
        </div>

        {/* Minimal CTA */}
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-zinc-800">
            Ready to explore active SPV syndications?
          </p>
          <Link
            href="/#waitlist"
            className="inline-flex h-9 px-5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider items-center justify-center hover:bg-zinc-800 transition"
          >
            Join Waitlist
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-zinc-200/60 bg-white py-6 px-4 text-center text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} Apex Krish Capital. Test Build / Preview Release.</p>
      </footer>
    </div>
  );
}
