"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import GenerationForm from "@/components/GenerationForm";
import ChordDisplay from "@/components/ChordDisplay";
import PianoRoll from "@/components/PianoRoll";
import PlaybackControls from "@/components/PlaybackControls";
import { ChordProgression, GenerateRequest } from "@/types/chord";

const LOADING_CHORDS = ["Dm9", "G13", "Cmaj9", "Am11"];
const LOADING_NOTES = [
  { left: "8%", top: "18%", width: "16%", delay: "0s" },
  { left: "8%", top: "34%", width: "16%", delay: "0.1s" },
  { left: "8%", top: "50%", width: "16%", delay: "0.2s" },
  { left: "30%", top: "24%", width: "15%", delay: "0.4s" },
  { left: "30%", top: "42%", width: "15%", delay: "0.52s" },
  { left: "30%", top: "60%", width: "15%", delay: "0.64s" },
  { left: "52%", top: "20%", width: "18%", delay: "0.82s" },
  { left: "52%", top: "36%", width: "18%", delay: "0.94s" },
  { left: "52%", top: "54%", width: "18%", delay: "1.06s" },
  { left: "74%", top: "28%", width: "12%", delay: "1.24s" },
  { left: "74%", top: "46%", width: "12%", delay: "1.36s" },
  { left: "74%", top: "64%", width: "12%", delay: "1.48s" },
];

export default function GenerateTrialPage() {
  const [progression, setProgression] = useState<ChordProgression | null>(null);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(
    (progs: ChordProgression[], _p: GenerateRequest) => {
      setProgression(progs[0] || null);
      setActiveChordIndex(-1);
      setCurrentBeat(0);
      setHasGenerated(true);
    },
    []
  );

  const handleChordChange = useCallback((index: number) => {
    setActiveChordIndex(index);
  }, []);

  const handleBeatChange = useCallback((beat: number) => {
    setCurrentBeat(beat);
  }, []);

  return (
    <div className="page-shell py-10 sm:py-12">
      {/* Trial banner */}
      <div className="surface-card-muted mb-8 flex flex-col items-start gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Try the generator</p>
          <p className="mt-0.5 text-xs text-[var(--text-soft)]">
            This is a preview with basic options. Sign in for the full experience with history, MIDI export, and more.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="button-primary shrink-0 px-5 py-2 text-sm font-medium"
        >
          Sign in for full access
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <div className="surface-card p-6">
            <p className="section-label mb-3">Try it</p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">Build a progression</h1>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Describe your vision and listen to the result
            </p>
          </div>
          <div className="surface-card p-5 sm:p-6">
            <GenerationForm onGenerate={handleGenerate} onGeneratingChange={setIsGenerating} />
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          {isGenerating ? (
            <div className="surface-card p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="section-label mb-2">Generating</p>
                  <h2 className="text-xl font-semibold tracking-[-0.04em]">Building harmonic options from your prompt</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-soft)]">
                    GenChords is sketching voicings, testing movement, and shaping variations.
                  </p>
                </div>
              </div>

              <div className="surface-card-muted p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Progress</p>
                  <span className="generation-status text-xs text-[var(--text-faint)]">Drafting loop</span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {LOADING_CHORDS.map((chord, index) => (
                    <span
                      key={chord}
                      className="generation-chip rounded-full border px-3 py-1.5 text-xs font-medium"
                      style={{ animationDelay: `${index * 0.32}s` }}
                    >
                      {chord}
                    </span>
                  ))}
                </div>

                <div className="generation-roll relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(241,239,234,0.94))] p-3">
                  <div className="generation-grid-lines absolute inset-0" />
                  {LOADING_NOTES.map((note, index) => (
                    <span
                      key={`${note.left}-${index}`}
                      className="generation-note absolute h-3 rounded-md bg-[var(--foreground)]/84"
                      style={{
                        left: note.left,
                        top: note.top,
                        width: note.width,
                        animationDelay: note.delay,
                      }}
                    />
                  ))}
                  <span className="generation-playhead absolute bottom-0 top-0 w-[2px] bg-[var(--foreground)]" />
                </div>
              </div>
            </div>
          ) : progression ? (
            <>
              <div className="surface-card p-5 sm:p-6">
                <PlaybackControls
                  progression={progression}
                  onChordChange={handleChordChange}
                  onBeatChange={handleBeatChange}
                />
                <div className="mt-5">
                  <ChordDisplay
                    progression={progression}
                    activeChordIndex={activeChordIndex}
                  />
                </div>
                <div className="mt-5">
                  <PianoRoll
                    progression={progression}
                    activeChordIndex={activeChordIndex}
                    currentBeat={currentBeat}
                  />
                </div>
              </div>

              {/* CTA after generation */}
              <div className="surface-card flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Want to save this or export MIDI?</p>
                  <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                    Create a free account to unlock saving, history, MIDI export, and more generation options.
                  </p>
                </div>
                <Link
                  href="/auth/login"
                  className="button-primary shrink-0 px-5 py-2 text-sm font-medium"
                >
                  Get started free
                </Link>
              </div>
            </>
          ) : (
            <div className="surface-card flex h-full items-center justify-center py-32">
              <div className="text-center">
                <h3 className="text-base font-medium text-[var(--text-soft)]">No progression yet</h3>
                <p className="mt-1 text-sm text-[var(--text-faint)]">
                  Fill in the form and let AI suggest a starting point for your next idea
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
