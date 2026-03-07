"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AudioButton } from "@/components/audio-button";
import type { WordOfTheDay } from "@/lib/data";

interface WordCardProps {
  data: WordOfTheDay;
}

export function WordCard({ data }: WordCardProps) {
  return (
    <div className="rainbow-border rounded-xl p-[1.5px] animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out fill-mode-both transition-transform hover:-translate-y-1 w-full max-w-xl">
      <Card className="w-full border-0 ring-0 shadow-none">
        <CardContent className="p-6 sm:p-8">
          {/* Top row: part of speech + audio */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-xs font-medium tracking-wide uppercase"
            >
              {data.partOfSpeech}
            </Badge>
            <AudioButton
              src={data.audioUrl}
              label={`Listen to pronunciation of ${data.word}`}
            />
          </div>

          {/* Word + pronunciation */}
          <div className="mt-5 space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl break-words">
              {data.word}
            </h2>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {data.pronunciation}
            </p>
          </div>

          <Separator className="my-5" />

          {/* Definition */}
          <p className="text-base leading-relaxed text-foreground">
            {data.definition}
          </p>

          {/* Example sentence */}
          <div className="mt-5 rounded-lg bg-muted/50 px-4 py-3.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
              Example
            </p>
            <p className="text-sm leading-relaxed text-foreground/80 italic break-words">
              &ldquo;{data.example}&rdquo;
            </p>
          </div>

          {/* Date — bottom right */}
          <div className="mt-5 flex justify-end">
            <span className="text-xs text-muted-foreground tabular-nums">
              {data.date}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
