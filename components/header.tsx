"use client";

import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  language: string;
  onLanguageChange: (code: string) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Subtle text logo */}
        <a
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground/80 transition-colors hover:text-foreground"
        >
          wordofthe.day
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
