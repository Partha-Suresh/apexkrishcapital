"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ExpandableScreenContextType = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpand: () => void;
  layoutId?: string;
  triggerRadius?: string;
  contentRadius?: string;
};

const ExpandableScreenContext = createContext<ExpandableScreenContextType | undefined>(undefined);

export function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error("useExpandableScreen must be used within an ExpandableScreen provider");
  }
  return context;
}

interface ExpandableScreenProps {
  children: ReactNode;
  layoutId?: string;
  triggerRadius?: string;
  contentRadius?: string;
  className?: string;
  onExpandChange?: (expanded: boolean) => void;
  lockScroll?: boolean;
}

export function ExpandableScreen({
  children,
  layoutId = "expandable-screen",
  triggerRadius = "24px",
  contentRadius = "0px",
  className,
  onExpandChange,
  lockScroll = true,
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpandedState] = useState(false);

  const setIsExpanded = (expanded: boolean) => {
    setIsExpandedState(expanded);
    if (onExpandChange) onExpandChange(expanded);
    if (!expanded) {
      window.dispatchEvent(
        new CustomEvent("close-expandable-screen", {
          detail: { layoutId },
        })
      );
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Handle global custom events to open/close programmatically
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ layoutId?: string }>;
      if (!customEvent.detail?.layoutId || customEvent.detail?.layoutId === layoutId) {
        setIsExpandedState(true);
        if (onExpandChange) onExpandChange(true);
      }
    };

    const handleCloseEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ layoutId?: string }>;
      if (!customEvent.detail?.layoutId || customEvent.detail?.layoutId === layoutId) {
        setIsExpandedState(false);
        if (onExpandChange) onExpandChange(false);
      }
    };

    window.addEventListener("open-expandable-screen", handleOpenEvent as EventListener);
    window.addEventListener("close-expandable-screen", handleCloseEvent as EventListener);

    return () => {
      window.removeEventListener("open-expandable-screen", handleOpenEvent as EventListener);
      window.removeEventListener("close-expandable-screen", handleCloseEvent as EventListener);
    };
  }, [layoutId, onExpandChange]);

  // Lock scroll on body & html when expanded
  useEffect(() => {
    if (!lockScroll) return;
    if (isExpanded) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isExpanded, lockScroll]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleExpand,
        layoutId,
        triggerRadius,
        contentRadius,
      }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </ExpandableScreenContext.Provider>
  );
}

interface ExpandableScreenTriggerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ExpandableScreenTrigger({
  children,
  className,
  onClick,
}: ExpandableScreenTriggerProps) {
  const { toggleExpand, isExpanded } = useExpandableScreen();

  return (
    <div
      onClick={() => {
        if (onClick) onClick();
        toggleExpand();
      }}
      className={cn("cursor-pointer select-none transition-all", className)}
      aria-expanded={isExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onClick) onClick();
          toggleExpand();
        }
      }}
    >
      {children}
    </div>
  );
}

interface ExpandableScreenContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function ExpandableScreenContent({
  children,
  className,
  showCloseButton = true,
  onClose,
}: ExpandableScreenContentProps) {
  const { isExpanded, setIsExpanded } = useExpandableScreen();

  if (!isExpanded) return null;

  const handleClose = () => {
    if (onClose) onClose();
    setIsExpanded(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/75 dark:bg-black/85 backdrop-blur-2xl animate-in fade-in zoom-in-[0.98] duration-200"
      onClick={(e) => {
        // Close when clicking outside content area
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={cn(
          "relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[28px] border border-border/80 bg-background text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-[0.99] duration-200",
          className
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal screen"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-md backdrop-blur-xl hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        )}
        <div className="overflow-y-auto p-5 sm:p-8 md:p-10 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
