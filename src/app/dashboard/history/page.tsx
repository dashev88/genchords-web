"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { SavedProgression, ChordProgression } from "@/types/chord";
import ChordDisplay from "@/components/ChordDisplay";
import PianoRoll from "@/components/PianoRoll";
import PlaybackControls from "@/components/PlaybackControls";
import { downloadMidi } from "@/lib/midi";

export default function DashboardHistoryPage() {
  const [progressions, setProgressions] = useState<SavedProgression[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  useEffect(() => {
    fetch("/api/progressions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProgressions(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/progressions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProgressions((prev) => prev.filter((p) => p.id !== id));
        if (selectedId === id) setSelectedId(null);
      }
    },
    [selectedId]
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const p of progressions) {
      if (p.parameters?.genre) set.add(p.parameters.genre);
    }
    return [...set].sort();
  }, [progressions]);

  const filtered = useMemo(() => {
    return progressions.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.prompt.toLowerCase().includes(search.toLowerCase());
      const matchesGenre =
        genreFilter === "all" || p.parameters?.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [progressions, search, genreFilter]);

  const selected = progressions.find((p) => p.id === selectedId);

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-6">
        <p className="section-label mb-2">History</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">
          All Generations
        </h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">
          Browse, preview, and manage every progression you&apos;ve created.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg
            className="h-5 w-5 animate-spin text-[var(--text-muted)]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : progressions.length === 0 ? (
        <div className="surface-card py-16 text-center">
          <p className="text-[var(--text-soft)]">
            No saved progressions yet.
          </p>
          <a
            href="/dashboard/generate"
            className="button-primary mt-4 inline-block px-5 py-2 text-sm font-medium"
          >
            Generate your first
          </a>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or prompt..."
                className="ui-field py-2.5 pl-9 pr-3 text-sm placeholder:text-[var(--text-faint)]"
              />
            </div>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="ui-field w-full appearance-none px-3 py-2.5 text-sm sm:w-40"
            >
              <option value="all">All genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* List */}
            <div className="surface-card max-h-[calc(100vh-16rem)] space-y-1.5 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-[var(--text-faint)]">
                  No matches found
                </div>
              ) : (
                filtered.map((p) => {
                  const chords = p.chords as ChordProgression;
                  return (
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
                        <h3 className="truncate text-sm font-medium">
                          {p.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="text-[var(--text-faint)] transition-colors hover:text-red-400"
                          title="Delete"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-1 truncate text-[10px] text-[var(--text-faint)]">
                        &quot;{p.prompt}&quot;
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="chip px-2 py-0.5 text-[10px]">
                          {chords?.key} {chords?.scale}
                        </span>
                        <span className="text-[10px] text-[var(--text-faint)]/80">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Preview */}
            {selected ? (
              <div className="min-w-0 space-y-4">
                <div className="surface-card p-5 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">
                      {selected.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                      &quot;{selected.prompt}&quot;
                    </p>
                  </div>
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
                  className="button-secondary px-4 py-2 text-xs font-medium"
                >
                  Download MIDI
                </button>
              </div>
            ) : (
              <div className="surface-card flex items-center justify-center py-20">
                <p className="text-sm text-[var(--text-faint)]">
                  Select a progression to preview
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
