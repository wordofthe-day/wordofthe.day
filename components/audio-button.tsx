"use client";

import { useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AudioButtonProps {
  /** URL of the audio file to play */
  src?: string;
  /** The word to speak via TTS if no src is provided */
  word?: string;
  /** Language code for TTS (e.g. "en", "hi") */
  lang?: string;
  /** Label for accessibility */
  label?: string;
  /** Theme color for light mode */
  themeColor?: string;
  /** Theme color for dark mode */
  themeColorDark?: string;
}

export function AudioButton({
  src,
  word,
  lang = "en",
  label = "Listen to pronunciation",
  themeColor,
}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, []);

  const playWithAudioElement = useCallback(() => {
    if (!src) return false;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
      audioRef.current.addEventListener("error", () => {
        setPlaying(false);
      });
    }

    audioRef.current.play().catch(() => setPlaying(false));
    setPlaying(true);
    return true;
  }, [src]);

  const playWithSpeechSynthesis = useCallback(() => {
    if (!word || typeof window === "undefined" || !window.speechSynthesis) {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
    return true;
  }, [word, lang]);

  const handlePlay = useCallback(() => {
    if (playing) {
      stopAudio();
      return;
    }

    // Try audio file first, fall back to speech synthesis
    if (!playWithAudioElement()) {
      playWithSpeechSynthesis();
    }
  }, [playing, stopAudio, playWithAudioElement, playWithSpeechSynthesis]);

  // Show button if we have either a src URL or a word to speak
  if (!src && !word) return null;

  // Themed large circle button (used inside word card)
  if (themeColor) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              aria-label={label}
              onClick={handlePlay}
              className="inline-flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "rgba(0,0,0,0.15)",
                color: "#1a1a1a",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.08)",
              }}
            />
          }
        >
          {playing ? (
            <VolumeX className="size-5" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {playing ? "Stop" : "Listen"}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Fallback: ghost button style
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={handlePlay}
            className="text-muted-foreground hover:text-foreground"
          />
        }
      >
        {playing ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {playing ? "Stop" : "Listen"}
      </TooltipContent>
    </Tooltip>
  );
}
