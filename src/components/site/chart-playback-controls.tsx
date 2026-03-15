"use client";

import {
  PauseIcon,
  PlayIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ChartPlaybackControlsProps = {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function ChartPlaybackControls({
  isPlaying,
  onTogglePlayback,
  onPrevious,
  onNext,
}: ChartPlaybackControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[var(--bber-border)] bg-white text-[var(--bber-ink)]"
        onClick={onPrevious}
      >
        <StepBackIcon data-icon="inline-start" className="size-3.5" />
        Prev
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[var(--bber-border)] bg-white text-[var(--bber-ink)]"
        onClick={onTogglePlayback}
      >
        {isPlaying ? (
          <PauseIcon data-icon="inline-start" className="size-3.5" />
        ) : (
          <PlayIcon data-icon="inline-start" className="size-3.5" />
        )}
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[var(--bber-border)] bg-white text-[var(--bber-ink)]"
        onClick={onNext}
      >
        <StepForwardIcon data-icon="inline-start" className="size-3.5" />
        Next
      </Button>
    </div>
  );
}
