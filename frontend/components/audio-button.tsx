"use client";

import { useRef, useState } from "react";
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
  /** Label for accessibility */
  label?: string;
}

export function AudioButton({
  src,
  label = "Listen to pronunciation",
}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!src) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
      audioRef.current.addEventListener("error", () => setPlaying(false));
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  if (!src) return null;

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
