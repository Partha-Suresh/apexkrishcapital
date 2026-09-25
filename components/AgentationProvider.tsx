"use client";

import { useEffect, useState } from "react";
import { Agentation } from "agentation";

export default function AgentationProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Agentation endpoint="http://localhost:4747" />;
}
