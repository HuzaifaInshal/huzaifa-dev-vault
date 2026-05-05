"use client";
import { useEffect, useState } from "react";

/**
 * Returns human-readable "time ago" format and auto-updates every second.
 * @param dateString - A date string (e.g. "2025-09-24T12:00:00Z")
 */
export function useTimeAgo(dateString: string): string {
  const getTimeAgo = () => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

    if (diff < 60) {
      return `${diff} second${diff !== 1 ? "s" : ""}`;
    }

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    const hours = Math.floor(diff / 3600);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }

    const days = Math.floor(diff / 86400);
    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""}`;
  };

  const [timeAgo, setTimeAgo] = useState(getTimeAgo);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo());
    }, 1000);

    return () => clearInterval(interval);
  }, [dateString]);

  return timeAgo;
}
