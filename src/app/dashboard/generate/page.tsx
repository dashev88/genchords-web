"use client";

import { useState, useCallback } from "react";
import GenerationForm from "@/components/GenerationForm";
import ChordDisplay from "@/components/ChordDisplay";
import PianoRoll from "@/components/PianoRoll";
import PlaybackControls from "@/components/PlaybackControls";
import { ChordProgression, GenerateRequest } from "@/types/chord";
import { downloadMidi } from "@/lib/midi";

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

export default function DashboardGeneratePage() {
  const [progressions, setProgressions] = useState<ChordProgression[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [params, setParams] = useState<GenerateRequest | null>(null);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(
    (progs: ChordProgression[], p: GenerateRequest) => {
      setProgressions(progs);
      setSelectedVariation(0);
      setParams(p);
      setActiveChordIndex(-1);
      setCurrentBeat(0);
      setSaveMessage("");
    },
    []
  );

  const handleChordChange = useCallback((index: number) => {
    setActiveChordIndex(index);
  }, []);

  const handleBeatChange = useCallback((beat: number) => {
    setCurrentBeat(beat);
  }, []);

  const handleTempoChange = useCallback(
    (tempo: number) => {
      setProgressions((prev) =>
        prev.map((item, index) =>
          index === selectedVariation ? { ...item, tempo } : item
        )
      );
      setCurrentBeat(0);
      setActiveChordIndex(-1);
      setSaveMessage("");
    },
    [selectedVariation]
  );

  const handleSave = useCallback(async () => {
    const progression = progressions[selectedVariation];
    if (!progression || !params) return;

    setSaving(true);
    try {
      const res = await fetch("/api/progressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${progression.key} ${progression.scale} - ${params.genre}`,
          prompt: params.prompt,
          parameters: { ...params, tempo: progression.tempo },
          chords: progression,
        }),
      });

      if (res.ok) {
        setSaveMessage("Saved to history!");
      } else {
        const data = await res.json();
        setSaveMessage(data.error || "Failed to save");
      }
    } catch {
      setSaveMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [progressions, selectedVariation, params]);

  const progression = progressions[selectedVariation] || null;

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: Form */}
        <div className="space-y-4">
          <div className="surface-card p-5">
            <p className="section-label mb-2">Generate</p>
            <h1 className="text-xl font-semibold tracking-[-0.04em]">
              Build a progression
            </h1>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Full creative control with all parameters
            </p>
          </div>
          <div className="surface-card p-5">
            <GenerationForm
              onGenerate={handleGenerate}
              onGeneratingChange={setIsGenerating}
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className="min-w-0 space-y-4">
          {isGenerating ? (
            <div className="surface-card p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="section-label mb-2">Generating</p>
                  <h2 className="text-xl font-semibold tracking-[-0.04em]">
                    Building harmonic options from your prompt
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-soft)]">
                    GenChords is sketching voicings, testing movement, and
                    shaping variations. You keep the idea, the taste, and the
                    final call.
                  </p>
                </div>
                <div className="chip px-3 py-1.5 text-[11px]">
                  AI as inspiration
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="surface-card-muted p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                      Progress
                    </p>
                    <span className="generation-status text-xs text-[var(--text-faint)]">
                      Drafting loop
                    </span>
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

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-3 py-3 text-xs text-[var(--text-soft)]">
                      Interpreting mood
                    </div>
                    <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-3 py-3 text-xs text-[var(--text-soft)]">
                      Voicing chords
                    </div>
                    <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-3 py-3 text-xs text-[var(--text-soft)]">
                      Comparing variations
                    </div>
                  </div>
                </div>

                <div className="surface-card-muted p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    What happens next
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
                    <p>
                      The AI proposes progressions, not finished songs.
                    </p>
                    <p>
                      Preview them, keep what sparks an idea, and reshape the
                      rest in your DAW.
                    </p>
                    <p>
                      Export the MIDI when one variation feels worth developing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : progression ? (
            <>
              {progressions.length > 1 && (
                <div className="flex gap-1.5">
                  {progressions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedVariation(i);
                        setActiveChordIndex(-1);
                        setCurrentBeat(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium ${
                        selectedVariation === i
                          ? "button-primary"
                          : "button-secondary"
                      }`}
                    >
                      Variation {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <div className="surface-card p-5 sm:p-6">
                <PlaybackControls
                  progression={progression}
                  onChordChange={handleChordChange}
                  onBeatChange={handleBeatChange}
                  onTempoChange={handleTempoChange}
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

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="button-primary px-4 py-2 text-xs font-medium disabled:opacity-30"
                >
                  {saving ? "Saving..." : "Save to history"}
                </button>
                <button
                  onClick={() =>
                    downloadMidi(
                      progression,
                      `${progression.key}-${progression.scale}.mid`
                    )
                  }
                  className="button-secondary px-4 py-2 text-xs font-medium"
                >
                  Download MIDI
                </button>
                {saveMessage && (
                  <span className="text-xs text-[var(--text-faint)]">
                    {saveMessage}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="surface-card flex h-full items-center justify-center py-32">
              <div className="text-center">
                <h3 className="text-base font-medium text-[var(--text-soft)]">
                  No progression yet
                </h3>
                <p className="mt-1 text-sm text-[var(--text-faint)]">
                  Fill in the form and let AI suggest a starting point for your
                  next idea
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
