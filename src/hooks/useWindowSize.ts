"use client";
import { useLayoutEffect, useState } from "react";

// --------------------------
// useWindowBreakpoint Hook
// --------------------------

export function useWindowBreakpoint() {
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Determine Tailwind-like breakpoint
  let breakpoint: "sm" | "md" | "lg" | "xl" | "2xl" | "default" = "default";
  if (width >= 1536) breakpoint = "2xl";
  else if (width >= 1280) breakpoint = "xl";
  else if (width >= 1024) breakpoint = "lg";
  else if (width >= 768) breakpoint = "md";
  else if (width >= 640) breakpoint = "sm";
  else breakpoint = "default";

  return { width, breakpoint };
}

// --------------------------
// useWindowSize Hook
// --------------------------

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth || 0 : 0,
    height: typeof window !== "undefined" ? window.innerHeight || 0 : 0
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
