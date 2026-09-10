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
          className="rounded-full ring-2 ring-foreground/10 hover:ring-foreground/25 transition-all w-9 h-9 p-0 overflow-hidden cursor-pointer"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={!img_url ? "/usericon.webp" : img_url}
              alt="User"
              className="object-cover"
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
              AK
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border border-border bg-popover/95 text-popover-foreground p-1.5 shadow-md backdrop-blur-xl animate-in fade-in-80 zoom-in-95"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors focus:bg-accent focus:text-accent-foreground">
            <Link href="/profile" className="flex items-center gap-2.5 font-medium">
              <BadgeCheckIcon className="w-4 h-4 text-muted-foreground" />
              <span>Investor Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 bg-border" />
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors focus:bg-destructive/10 focus:text-destructive">
          <button
            className="flex w-full items-center gap-2.5 font-medium cursor-pointer"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            <LogOutIcon className="w-4 h-4 text-destructive" />
            <span>Sign Out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
