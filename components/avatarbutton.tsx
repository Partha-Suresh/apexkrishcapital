"use client"

import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"
import {useClerk} from "@clerk/nextjs"
import Link from "next/link"

export function DropdownMenuAvatar({ img_url }: { img_url: string | undefined }) {
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ring-2 ring-black/5 hover:ring-black/15 transition-all w-9 h-9 p-0 overflow-hidden"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={!img_url ? "/user_icon.webp" : img_url}
              alt="User"
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-200 text-zinc-700 text-xs font-semibold">
              AK
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border border-zinc-200/80 bg-white/95 p-1.5 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-in fade-in-80 zoom-in-95"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer transition-colors">
            <Link href="/profile" className="flex items-center gap-2.5 font-medium">
              <BadgeCheckIcon className="w-4 h-4 text-zinc-500" />
              <span>Investor Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 bg-zinc-100" />
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors">
          <button
            className="flex w-full items-center gap-2.5 font-medium"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            <LogOutIcon className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
