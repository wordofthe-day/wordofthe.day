"use client";

import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  language: string;
  onLanguageChange: (code: string) => void;
}

const LOGO_TEXT = "wordofthe.day";
const LOGO_COLORS = [
  "#F472B6", // w
  "#6EE7B7", // o
  "#FDBA74", // r
  "#C4B5FD", // d
  "#FDE047", // o
  "#67E8F9", // f
  "#F472B6", // t
  "#6EE7B7", // h
  "#FDBA74", // e
  "#C4B5FD", // .
  "#FDE047", // d
  "#67E8F9", // a
  "#F472B6", // y
];

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Colorful logo */}
        <a
          href="/"
          className="text-base font-bold tracking-tight transition-transform hover:scale-105"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {LOGO_TEXT.split("").map((char, i) => (
            <span
              key={i}
              style={{ color: LOGO_COLORS[i % LOGO_COLORS.length] }}
            >
              {char}
            </span>
          ))}
        </a>

        {/* Right-side controls */}
        <div className="flex items-center gap-1">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
