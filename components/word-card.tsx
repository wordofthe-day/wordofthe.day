"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AudioButton } from "@/components/audio-button";
import type { WordOfTheDay } from "@/lib/data";

// Color themes that rotate daily
const COLOR_THEMES = [
  {
    name: "pink",
    bg: "#F472B6",
    bgDark: "#BE185D",
    text: "#1a1a1a",
    textDark: "#fdf2f8",
    accent: "#FBCFE8",
    accentDark: "#9D174D",
    tileColors: ["#FDE047", "#67E8F9", "#C4B5FD", "#6EE7B7", "#FDBA74"],
  },
  {
    name: "mint",
    bg: "#6EE7B7",
    bgDark: "#059669",
    text: "#1a1a1a",
    textDark: "#ecfdf5",
    accent: "#A7F3D0",
    accentDark: "#065F46",
    tileColors: ["#F472B6", "#FDE047", "#C4B5FD", "#67E8F9", "#FDBA74"],
  },
  {
    name: "peach",
    bg: "#FDBA74",
    bgDark: "#C2410C",
    text: "#1a1a1a",
    textDark: "#fff7ed",
    accent: "#FED7AA",
    accentDark: "#9A3412",
    tileColors: ["#F472B6", "#6EE7B7", "#C4B5FD", "#67E8F9", "#FDE047"],
  },
  {
    name: "lavender",
    bg: "#C4B5FD",
    bgDark: "#6D28D9",
    text: "#1a1a1a",
    textDark: "#f5f3ff",
    accent: "#DDD6FE",
    accentDark: "#5B21B6",
    tileColors: ["#F472B6", "#6EE7B7", "#FDE047", "#67E8F9", "#FDBA74"],
  },
  {
    name: "yellow",
    bg: "#FDE047",
    bgDark: "#A16207",
    text: "#1a1a1a",
    textDark: "#fefce8",
    accent: "#FEF08A",
    accentDark: "#854D0E",
    tileColors: ["#F472B6", "#6EE7B7", "#C4B5FD", "#67E8F9", "#FDBA74"],
  },
  {
    name: "cyan",
    bg: "#67E8F9",
    bgDark: "#0891B2",
    text: "#1a1a1a",
    textDark: "#ecfeff",
    accent: "#A5F3FC",
    accentDark: "#155E75",
    tileColors: ["#F472B6", "#6EE7B7", "#C4B5FD", "#FDE047", "#FDBA74"],
  },
];

function getDailyTheme() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return COLOR_THEMES[dayOfYear % COLOR_THEMES.length];
}

// Slight rotation for each tile for playfulness
const TILE_ROTATIONS = [-3, 2, -1, 3, -2, 1, -3, 2, -1, 3, -2, 1];

interface WordCardProps {
  data: WordOfTheDay;
}

export function WordCard({ data }: WordCardProps) {
  const theme = getDailyTheme();
  const letters = data.word.split("");

  return (
    <div
      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out fill-mode-both w-full max-w-xl"
    >
      <Card
        className="w-full border-3 border-black/10 shadow-[4px_6px_0_rgba(0,0,0,0.12)] dark:border-white/10 dark:shadow-[4px_6px_0_rgba(255,255,255,0.06)] ring-0 overflow-hidden"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="dark:hidden"
          style={{ position: "absolute", inset: 0, backgroundColor: theme.bg, zIndex: 0 }}
        />
        <div
          className="hidden dark:block"
          style={{ position: "absolute", inset: 0, backgroundColor: theme.bgDark, zIndex: 0 }}
        />
        <CardContent className="p-6 sm:p-8 relative z-10">
          {/* Part of speech pill */}
          <div className="flex items-center justify-between">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase"
              style={{
                backgroundColor: "rgba(0,0,0,0.12)",
                color: theme.text,
              }}
            >
              <span className="dark:hidden">{data.partOfSpeech}</span>
              <span className="hidden dark:inline" style={{ color: theme.textDark }}>
                {data.partOfSpeech}
              </span>
            </span>
          </div>

          {/* Letter tiles */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {letters.map((letter, i) => {
              const tileColor = theme.tileColors[i % theme.tileColors.length];
              const rotation = TILE_ROTATIONS[i % TILE_ROTATIONS.length];
              return (
                <div
                  key={i}
                  className="letter-tile"
                  style={{
                    backgroundColor: tileColor,
                    color: "#1a1a1a",
                    "--tile-rotate": `${rotation}deg`,
                    transform: `rotate(${rotation}deg)`,
                    animationDelay: `${i * 0.06}s`,
                  } as React.CSSProperties}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {/* Pronunciation */}
          <p
            className="mt-4 text-center text-sm font-mono break-all"
            style={{ color: theme.text, opacity: 0.7 }}
          >
            <span className="dark:hidden">{data.pronunciation}</span>
            <span className="hidden dark:inline" style={{ color: theme.textDark, opacity: 0.8 }}>
              {data.pronunciation}
            </span>
          </p>

          {/* Divider */}
          <div
            className="my-5 h-px w-full"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          />

          {/* Definition */}
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: theme.text }}
          >
            <span className="dark:hidden">{data.definition}</span>
            <span className="hidden dark:inline" style={{ color: theme.textDark }}>
              {data.definition}
            </span>
          </p>

          {/* Examples */}
          {data.examples.length > 0 && (
            <div
              className="mt-5 rounded-xl px-4 py-3.5"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            >
              <div className="dark:hidden">
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.text, opacity: 0.6 }}
                >
                  {data.examples.length === 1 ? "Example" : "Examples"}
                </p>
                <ul className="space-y-2">
                  {data.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed italic break-words"
                      style={{ color: theme.text, opacity: 0.85 }}
                    >
                      &ldquo;{ex}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden dark:block">
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.textDark, opacity: 0.6 }}
                >
                  {data.examples.length === 1 ? "Example" : "Examples"}
                </p>
                <ul className="space-y-2">
                  {data.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed italic break-words"
                      style={{ color: theme.textDark, opacity: 0.85 }}
                    >
                      &ldquo;{ex}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Audio + Date row */}
          <div className="mt-5 flex items-center justify-between">
            <span
              className="text-xs tabular-nums"
              style={{ color: theme.text, opacity: 0.5 }}
            >
              <span className="dark:hidden">{data.date}</span>
              <span className="hidden dark:inline" style={{ color: theme.textDark }}>
                {data.date}
              </span>
            </span>
            <AudioButton
              src={data.audioUrl}
              word={data.word}
              lang={data.language === "hin" ? "hi" : "en"}
              label={`Listen to pronunciation of ${data.word}`}
              themeColor={theme.bg}
              themeColorDark={theme.bgDark}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
