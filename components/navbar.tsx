import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Contact us", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">


        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image src="/apexkrishnalogo.png" alt="Logo" width={50} height={24}/>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            Apex Krishna
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-950 sm:inline-flex"
          >
            Log in
          </Link>
          <SignOutButton/>
          
        </div>
      </nav>
    </header>
  );
}
