"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { WordCard } from "@/components/word-card";
import { CountdownTimer } from "@/components/countdown-timer";
import { GamesSection } from "@/components/games-section";
import { getWordOfTheDay, type WordOfTheDay } from "@/lib/data";

interface HeroSectionProps {
  /** Selected language code */
  language: string;
}

const FLOATING_LETTERS = [
  { char: "A", top: "8%", left: "5%", size: "4rem", rotate: "-12deg", delay: "0s" },
  { char: "W", top: "15%", right: "8%", size: "3rem", rotate: "8deg", delay: "1s" },
  { char: "Z", bottom: "20%", left: "10%", size: "3.5rem", rotate: "15deg", delay: "2s" },
  { char: "Q", bottom: "12%", right: "6%", size: "2.5rem", rotate: "-6deg", delay: "3s" },
  { char: "K", top: "45%", left: "3%", size: "2rem", rotate: "20deg", delay: "1.5s" },
  { char: "M", top: "35%", right: "4%", size: "2.5rem", rotate: "-18deg", delay: "0.5s" },
];

const FUN_COLORS = ["#F472B6", "#6EE7B7", "#FDBA74", "#C4B5FD", "#FDE047", "#67E8F9"];

export function HeroSection({ language }: HeroSectionProps) {
  const [word, setWord] = useState<WordOfTheDay | null>(null);
  const [, startTransition] = useTransition();

  const fetchWord = useCallback(
    (lang: string) => {
      startTransition(() => {
        getWordOfTheDay(lang).then(setWord);
      });
    },
    [startTransition]
  );

  useEffect(() => {
    fetchWord(language);
  }, [language, fetchWord]);

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24 overflow-hidden">
      {/* Floating decorative letters */}
      {FLOATING_LETTERS.map((fl, i) => (
        <span
          key={fl.char}
          className="floating-letter hidden sm:block"
          style={{
            top: fl.top,
            left: fl.left,
            right: fl.right,
            bottom: fl.bottom,
            fontSize: fl.size,
            color: FUN_COLORS[i % FUN_COLORS.length],
            animationDelay: fl.delay,
            "--float-rotate": fl.rotate,
          } as React.CSSProperties}
        >
          {fl.char}
        </span>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Fun tagline */}
        <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          ✦ Learn a new word every day ✦
        </p>

        {/* Countdown */}
        <div>
          <CountdownTimer />
        </div>

        {/* Word Card */}
        <div className="mt-8 w-full">
          {word && <WordCard data={word} />}
        </div>

        {/* Games Section */}
        {word && <GamesSection word={word} />}
      </div>
    </section>
  );
}
