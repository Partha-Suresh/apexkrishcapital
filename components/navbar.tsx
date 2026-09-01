'use client'


import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuAvatar } from "./avatarbutton";


const navItems = [
  { label: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const {isLoaded, isSignedIn, user} = useUser()
  //Handling loading state
  console.log(user)
  
  
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md h-16">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 h-full sm:px-6 lg:px-8">


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
          {isLoaded ? (
            isSignedIn ? (
              <DropdownMenuAvatar img_url={user?.imageUrl} />
            ) : (
              <Link
                href="/sign-in"
                className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-950 sm:inline-flex"
              >
                Log in
              </Link>
            )
          ) : (
            <div className="w-10 h-10" aria-hidden />
          )}
        </div>
      </nav>
    </header>
  );
}
