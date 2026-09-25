"use client"

import React from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Select theme"
          className="relative h-9 w-9 rounded-full border border-black/[0.05] dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.06] text-foreground hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-md transition active:scale-95 shadow-xs cursor-pointer"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-2xl border border-white/40 dark:border-white/15 bg-white/85 dark:bg-[#0c0c0e]/85 text-popover-foreground shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-1.5 backdrop-blur-3xl backdrop-saturate-200 animate-in fade-in-80 zoom-in-95"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-xs font-medium focus:bg-accent/80 focus:text-accent-foreground transition-colors whitespace-nowrap"
        >
          <Sun className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Light</span>
          {theme === "light" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-xs font-medium focus:bg-accent/80 focus:text-accent-foreground transition-colors whitespace-nowrap"
        >
          <Moon className="h-4 w-4 text-blue-400 shrink-0" />
          <span>Dark</span>
          {theme === "dark" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-xs font-medium focus:bg-accent/80 focus:text-accent-foreground transition-colors whitespace-nowrap"
        >
          <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="whitespace-nowrap">System Default</span>
          {theme === "system" && <Check className="ml-auto h-3.5 w-3.5 text-primary shrink-0" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

