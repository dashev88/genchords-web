"use client";

import { ChordProgression } from "@/types/chord";
import { noteNameToPitchClass } from "@/lib/music";

interface ChordDisplayProps {
  progression: ChordProgression;
  activeChordIndex: number;
}

export default function ChordDisplay({ progression, activeChordIndex }: ChordDisplayProps) {
  const totalBeats = progression.chords.reduce((sum, c) => sum + c.duration, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="font-medium text-[var(--foreground)]">
          {progression.key} {progression.scale}
        </span>
        <span className="text-[var(--border-strong)]">/</span>
        <span>{progression.tempo} BPM</span>
        <span className="text-[var(--border-strong)]">/</span>
        <span>
          {progression.timeSignature[0]}/{progression.timeSignature[1]}
        </span>
        <span className="text-[var(--border-strong)]">/</span>
        <span>{totalBeats / progression.timeSignature[0]} bars</span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {progression.chords.map((chord, i) => {
          const isActive = i === activeChordIndex;
          const bassPitchClass = chord.bassNote ? noteNameToPitchClass(chord.bassNote) : chord.root;
          const chordLabel = bassPitchClass && bassPitchClass !== chord.root ? `${chord.root}/${bassPitchClass}` : chord.root;

          return (
            <div
              key={i}
              className={`min-w-[88px] flex-shrink-0 rounded-2xl border p-3 transition-all ${
                isActive
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] shadow-[0_12px_26px_rgba(20,20,20,0.12)]"
                  : "border-[var(--border)] bg-[rgba(255,255,255,0.72)]"
              }`}
            >
              <div className="text-center">
                <div className={`text-base font-semibold ${isActive ? "text-[var(--background)]" : "text-[var(--foreground)]"}`}>
                  {chordLabel}
                  <span className={`text-xs font-normal ${isActive ? "text-[var(--background)]/60" : "text-[var(--text-muted)]"}`}>
                    {chord.quality === "major" ? "" : chord.quality}
                  </span>
                </div>
                <div className={`mt-0.5 text-[10px] ${isActive ? "text-[var(--background)]/50" : "text-[var(--text-faint)]"}`}>
                  {chord.romanNumeral}
                </div>
                {chord.inversion && chord.inversion !== "root" && (
                  <div className={`mt-1 text-[10px] ${isActive ? "text-[var(--background)]/50" : "text-[var(--text-faint)]"}`}>
                    {chord.inversion} inv.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
