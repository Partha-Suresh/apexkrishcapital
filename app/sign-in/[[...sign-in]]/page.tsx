import Link from "next/link";
import Navbar from "@/components/navbar";
import { SignIn, SignInButton } from "@clerk/nextjs";
import { dark, neobrutalism, shadcn } from "@clerk/ui/themes";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_520px]">
          <section className="space-y-6">
            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              Welcome back
            </span>

            <h1 className="max-w-md text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              Sign in to continue your journey.
            </h1>

            
          </section>

          <SignIn appearance={{theme:neobrutalism}} />
        
        </div>
      </main>
    </div>
  );
}
