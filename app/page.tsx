import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
 
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              New release
            </span>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              Build better projects with a cleaner workflow.
            </h1>
            <p className="max-w-lg text-lg text-zinc-600">
              Design, launch, and grow faster with a platform built for modern teams and ambitious ideas.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Start now
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400"
              >
                View demo
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Monthly growth</p>
                  <p className="text-3xl font-bold text-zinc-950">+24.8%</p>
                </div>
                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                  +18.4%
                </div>
              </div>
              <div className="h-40 rounded-2xl bg-zinc-100 p-4">
                <div className="flex h-full items-end gap-2">
                  {[35, 48, 42, 60, 58, 76, 92].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-xl bg-zinc-950"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
