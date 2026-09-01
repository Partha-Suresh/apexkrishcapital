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

export function DropdownMenuAvatar({ img_url }: { img_url: string | undefined }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={!img_url?"/user_icon.webp":img_url} alt="shadcn" />
            {/* <AvatarFallback>LR</AvatarFallback> */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon /><SignOutButton>Sign out</SignOutButton>
          {/* Sign Out */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
