"use client";

import { useEffect, useState, useCallback } from "react";
import { SavedProgression, ChordProgression } from "@/types/chord";
import ChordDisplay from "@/components/ChordDisplay";
import PianoRoll from "@/components/PianoRoll";
import PlaybackControls from "@/components/PlaybackControls";
import { downloadMidi } from "@/lib/midi";

export default function DashboardPage() {
  const [progressions, setProgressions] = useState<SavedProgression[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    fetch("/api/progressions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProgressions(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/progressions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProgressions((prev) => prev.filter((p) => p.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }, [selectedId]);

  const selected = progressions.find((p) => p.id === selectedId);

  return (
    <div className="page-shell py-10 sm:py-12">
      <div className="mb-6">
        <p className="section-label mb-3">Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">Saved progressions</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-5 w-5 animate-spin text-[var(--text-muted)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : progressions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--text-soft)]">No saved progressions yet.</p>
          <a href="/generate" className="button-primary mt-4 inline-block px-4 py-2 text-sm font-medium">
            Generate your first
          </a>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="surface-card max-h-[calc(100vh-12rem)] space-y-1.5 overflow-y-auto p-2">
            {progressions.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedId(p.id);
                  setActiveChordIndex(-1);
                  setCurrentBeat(0);
                }}
                className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                  selectedId === p.id
                    ? "border-[var(--foreground)] bg-[rgba(20,20,20,0.06)]"
                    : "border-[var(--border)] bg-[rgba(255,255,255,0.015)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="text-[var(--text-faint)] transition-colors hover:text-red-400"
                    title="Delete"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 truncate text-[10px] text-[var(--text-faint)]">
                  &quot;{p.prompt}&quot;
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--text-faint)]/80">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {selected ? (
            <div className="space-y-4 min-w-0">
              <div className="surface-card p-5 sm:p-6">
                <PlaybackControls
                  progression={selected.chords as ChordProgression}
                  onChordChange={setActiveChordIndex}
                  onBeatChange={setCurrentBeat}
                />
                <div className="mt-5">
                  <ChordDisplay
                    progression={selected.chords as ChordProgression}
                    activeChordIndex={activeChordIndex}
                  />
                </div>
                <div className="mt-5">
                  <PianoRoll
                    progression={selected.chords as ChordProgression}
                    activeChordIndex={activeChordIndex}
                    currentBeat={currentBeat}
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  downloadMidi(
                    selected.chords as ChordProgression,
                    `${selected.name}.mid`
                  )
                }
                className="button-secondary px-3 py-1.5 text-xs font-medium"
              >
                Download MIDI
              </button>
            </div>
          ) : (
            <div className="surface-card flex items-center justify-center py-20">
              <p className="text-sm text-[var(--text-faint)]">Select a progression to preview</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
