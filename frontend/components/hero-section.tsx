"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { WordCard } from "@/components/word-card";
import { CountdownTimer } from "@/components/countdown-timer";
import { getWordOfTheDay, type WordOfTheDay } from "@/lib/data";

interface HeroSectionProps {
  /** Selected language code */
  language: string;
}

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
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Countdown */}
        <div>
          <CountdownTimer />
        </div>

        {/* Word Card */}
        <div className="mt-8 w-full">
          {word && <WordCard data={word} />}
        </div>
      </div>
    </section>
  );
}
