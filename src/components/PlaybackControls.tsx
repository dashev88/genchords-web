"use client";

import { useState, useCallback, useEffect } from "react";
import { ChordProgression, PreviewPreset } from "@/types/chord";
import { PREVIEW_PRESETS, startPlayback, stopPlayback } from "@/lib/playback";
import { downloadMidi } from "@/lib/midi";

interface PlaybackControlsProps {
  progression: ChordProgression;
  onChordChange: (index: number) => void;
  onBeatChange?: (beat: number) => void;
  onTempoChange?: (tempo: number) => void;
}

export default function PlaybackControls({
  progression,
  onChordChange,
  onBeatChange,
  onTempoChange,
}: PlaybackControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState<PreviewPreset>(progression.previewPreset ?? "piano");
  const [bassLayer, setBassLayer] = useState(true);
  const aiPreset = progression.previewPreset ?? "piano";

  const resetPlayback = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    onChordChange(-1);
    onBeatChange?.(0);
  }, [onChordChange, onBeatChange]);

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      resetPlayback();
    } else {
      setIsPlaying(true);
      await startPlayback(
        progression,
        (index) => {
          onChordChange(index);
        },
        (beat) => {
          onBeatChange?.(beat);
        },
        { preset, bassLayer },
      );
    }
  }, [bassLayer, isPlaying, onBeatChange, onChordChange, preset, progression, resetPlayback]);

  const handleStop = useCallback(() => {
    resetPlayback();
  }, [resetPlayback]);

  const handleDownload = useCallback(() => {
    const name = `genchords-${progression.key}-${progression.scale}-${progression.tempo}bpm.mid`;
    downloadMidi(progression, name);
  }, [progression]);

  const handlePresetChange = useCallback((nextPreset: PreviewPreset) => {
    if (isPlaying) {
      resetPlayback();
    }
    setPreset(nextPreset);
  }, [isPlaying, resetPlayback]);

  const handleBassLayerChange = useCallback((nextValue: boolean) => {
    if (isPlaying) {
      resetPlayback();
    }
    setBassLayer(nextValue);
  }, [isPlaying, resetPlayback]);

  const handleTempoChange = useCallback((nextTempo: number) => {
    if (!Number.isFinite(nextTempo)) {
      return;
    }

    const clampedTempo = Math.min(240, Math.max(40, nextTempo));
    onTempoChange?.(clampedTempo);
  }, [onTempoChange]);

  useEffect(() => {
    resetPlayback();
    setPreset(progression.previewPreset ?? "piano");
  }, [progression, resetPlayback]);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.36)] p-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className="button-primary flex h-9 w-9 items-center justify-center"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="ml-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleStop}
          className="button-secondary flex h-9 w-9 items-center justify-center"
          title="Stop"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>

        <span className="ml-1 text-xs text-[var(--text-faint)]">{progression.tempo} BPM</span>

        <div className="flex-1" />

        <button
          onClick={handleDownload}
          className="button-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
          </svg>
          MIDI
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-[var(--text-soft)]">
          <span className="text-[var(--text-faint)]">BPM</span>
          <input
            type="number"
            min={40}
            max={240}
            step={1}
            value={progression.tempo}
            onChange={(e) => handleTempoChange(Number.parseInt(e.target.value || "0", 10))}
            className="ui-field w-20 px-3 py-2 text-xs"
          />
        </label>

        <input
          type="range"
          min={40}
          max={240}
          step={1}
          value={progression.tempo}
          onChange={(e) => handleTempoChange(Number.parseInt(e.target.value, 10))}
          className="min-w-[8rem] flex-1"
          aria-label="Adjust BPM"
        />

        <label className="flex items-center gap-2 text-xs text-[var(--text-soft)]">
          <span className="text-[var(--text-faint)]">Preview</span>
          <select
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value as PreviewPreset)}
            className="ui-field min-w-[10rem] appearance-none px-3 py-2 text-xs"
          >
            {Object.entries(PREVIEW_PRESETS).map(([value, config]) => (
              <option key={value} value={value} className="bg-white text-[var(--foreground)]">
                {config.label}
              </option>
            ))}
          </select>
        </label>

        <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-faint)]">
          {preset === aiPreset ? "AI pick" : "Custom"}
        </span>

        <label className="flex items-center gap-2 text-xs text-[var(--text-soft)]">
          <input
            type="checkbox"
            checked={bassLayer}
            onChange={(e) => handleBassLayerChange(e.target.checked)}
            className="h-4 w-4 rounded border border-[var(--border)] accent-[var(--foreground)]"
          />
          Bass layer
        </label>

        <span className="text-xs text-[var(--text-faint)]">
          {PREVIEW_PRESETS[preset].hint}
        </span>
      </div>
    </div>
  );
}
