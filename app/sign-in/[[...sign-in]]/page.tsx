import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { dark, neobrutalism, shadcn } from "@clerk/ui/themes";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 pt-[110px] md:pt-[150px] pb-16 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Apex Krish Capital</span>
        </Link>

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3.5 py-1.5 shadow-[0_2px_8px_rgba(10,10,10,0.03)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.08em] text-zinc-700">
                Accredited Investor Portal
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.1]">
              Access Your Investment Portal
            </h1>

            <p className="text-base text-zinc-600 leading-relaxed max-w-md">
              Sign in to access your direct SPV subscriptions, quarterly portfolio
              marks, capital calls, and confidential frontier tech diligence memoranda.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
                <span>256-bit Encrypted Private Market Access</span>
              </div>
            </div>
          </section>

          <div className="flex justify-center lg:justify-end">
            <div className="rounded-[28px] border border-zinc-200/80 bg-white/95 p-3 shadow-[0_20px_50px_-15px_rgba(10,10,10,0.1)] backdrop-blur-xl">
              <SignIn appearance={{ theme: neobrutalism }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

