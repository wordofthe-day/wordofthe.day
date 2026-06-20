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

function getDayNumber(): number {
  // Day number since June 1, 2025 (arbitrary start date)
  const start = new Date(Date.UTC(2025, 5, 1)); // June 1, 2025
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

const PILL_COLORS = ["#F472B6", "#6EE7B7", "#FDBA74", "#C4B5FD", "#FDE047", "#67E8F9"];

export function CountdownTimer() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [dayNum, setDayNum] = useState<number>(1);

  useEffect(() => {
    setTime(getTimeUntilUTCMidnight());
    setDayNum(getDayNumber());

    const interval = setInterval(() => {
      setTime(getTimeUntilUTCMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const pillColor = PILL_COLORS[dayNum % PILL_COLORS.length];

  return (
    <div className="inline-flex items-center gap-3">
      {/* Day badge */}
      <span
        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider"
        style={{
          backgroundColor: pillColor,
          color: "#1a1a1a",
          boxShadow: "2px 3px 0 rgba(0,0,0,0.1)",
        }}
      >
        Day {dayNum}
      </span>

      {/* Countdown pill */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
        style={{
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      >
        <Clock className="size-3.5 text-muted-foreground" />
        <span className="font-mono text-sm font-bold tabular-nums tracking-wider text-muted-foreground">
          {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
        </span>
      </div>
    </div>
  );
}
