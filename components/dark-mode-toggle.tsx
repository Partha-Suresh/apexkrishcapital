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
          className="relative h-9 w-9 rounded-[12px] border-border bg-background text-foreground hover:bg-muted transition active:scale-95 shadow-xs cursor-pointer"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-border bg-popover text-popover-foreground shadow-md p-1 backdrop-blur-xl animate-in fade-in-80 zoom-in-95"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg text-xs font-medium focus:bg-accent focus:text-accent-foreground transition-colors"
        >
          <Sun className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Light</span>
          {theme === "light" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg text-xs font-medium focus:bg-accent focus:text-accent-foreground transition-colors"
        >
          <Moon className="h-4 w-4 text-blue-400 shrink-0" />
          <span>Dark</span>
          {theme === "dark" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg text-xs font-medium focus:bg-accent focus:text-accent-foreground transition-colors"
        >
          <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>System Default</span>
          {theme === "system" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

