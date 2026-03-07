"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getTimeUntilUTCMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const utcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  );

  const diff = utcMidnight - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTime(getTimeUntilUTCMidnight());

    const interval = setInterval(() => {
      setTime(getTimeUntilUTCMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card px-4 py-2 shadow-sm">
      <Clock className="size-3.5 text-muted-foreground" />
      <span className="font-mono text-sm tabular-nums tracking-wider text-muted-foreground">
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    </div>
  );
}
