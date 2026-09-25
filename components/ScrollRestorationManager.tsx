"use client";

import { useEffect } from "react";

export default function ScrollRestorationManager() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set scroll restoration to manual so refreshes start at the top of the page
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Ensure page starts at top on initial mount / refresh
      window.scrollTo(0, 0);

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  return null;
}
