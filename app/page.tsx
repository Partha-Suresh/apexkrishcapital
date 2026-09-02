'use client'

import { useState } from "react";
import Link from "next/link";
import { Bot, Cpu, Dna, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Test Build Header Notice */}
      <div className="pt-24 sm:pt-28 pb-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1 text-[10.5px] font-mono font-medium text-zinc-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          TEST BUILD v0.1.0 · SNEAK PEEK
        </span>
      </div>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[800px] px-4 sm:px-6 py-6 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-5">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.15]">
            Investing in Tomorrow’s Frontier Technologies
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Apex Krish Capital identifies and curates high-conviction private market
            investments across AI, biotechnology, and advanced computing for accredited
            investors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#waitlist"
              className="h-10 px-6 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider transition hover:bg-zinc-800 flex items-center justify-center shadow-sm"
            >
              Join Waitlist
            </a>
            <Link
              href="/aboutus"
              className="h-10 px-6 rounded-full border border-zinc-200 bg-white text-zinc-800 text-xs font-semibold uppercase tracking-wider transition hover:bg-zinc-50 flex items-center justify-center"
            >
              About Approach
            </Link>
          </div>
        </section>

        {/* Featured Test Asset Preview Card */}
        <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white">
                CURRENT SPV PIPELINE
              </span>
              <span className="text-xs font-medium text-zinc-400">Featured Asset</span>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-medium">
              Accredited Only
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950">
              Scale AI · Series F Allocation
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Highlighting our investment in Scale AI, the global standard for foundational
              AI data infrastructure and enterprise model validation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-zinc-100 text-center">
            <div className="rounded-xl bg-zinc-50 p-3">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Valuation</span>
              <p className="text-sm font-semibold text-zinc-900 mt-0.5">$14B+</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Structure</span>
              <p className="text-sm font-semibold text-zinc-900 mt-0.5">Direct SPV</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Status</span>
              <p className="text-sm font-semibold text-emerald-700 mt-0.5">Active</p>
            </div>
          </div>
        </section>

        {/* Core Focus Areas */}
        <section id="focus" className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              CORE SECTORS
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              Where We Invest
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-950">Artificial Intelligence</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Foundation models, synthetic data pipelines, enterprise LLM infrastructure,
                and applied intelligence.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-950">Advanced Computing</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Specialized silicon accelerators, optical interconnects, cloud hardware,
                and next-generation compute.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Dna className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-950">Biotechnology</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Algorithmic drug discovery, genomic editing, synthetic biology, and
                computational therapeutics.
              </p>
            </div>
          </div>
        </section>

        {/* Minimal Waitlist / Early Access Form */}
        <section
          id="waitlist"
          className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-6 sm:p-8 text-center space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-950">
              Join Our Investor Community
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Accredited investors receive priority access to private SPV syndications
              and quarterly research briefings.
            </p>
          </div>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-medium py-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you. We will be in touch shortly.</span>
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
                className="h-10 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
              />
              <button
                type="submit"
                className="h-10 px-6 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                Join Waitlist
              </button>
            </form>
          )}

          <p className="text-[11px] text-zinc-400 font-mono">
            SEC Rule 506(c) accredited investors only.
          </p>
        </section>

        {/* Simple Contact / Business Info */}
        <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 text-xs text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <a href="mailto:info@apexkrishcapital.com" className="hover:underline">
              info@apexkrishcapital.com
            </a>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <a href="tel:+17208456839" className="hover:underline">
              +1 (720) 845-6839
            </a>
          </div>
          <div className="flex items-center gap-2 font-mono text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>New York, NY 10001</span>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-zinc-200/60 bg-white py-8 px-4 text-center text-xs text-zinc-400 space-y-2">
        <p>© {new Date().getFullYear()} Apex Krish Capital. Test Build / Preview Release.</p>
        <p className="text-[11px] max-w-lg mx-auto leading-normal">
          Private placements restricted to accredited investors. Past performance does not
          guarantee future returns.
        </p>
      </footer>
    </div>
  );
}
