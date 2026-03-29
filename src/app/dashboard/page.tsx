"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedProgression, ChordProgression } from "@/types/chord";

export default function DashboardPage() {
  const [progressions, setProgressions] = useState<SavedProgression[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progressions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProgressions(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalGenerations = progressions.length;
  const recent = progressions.slice(0, 5);
  const genreMap = new Map<string, number>();
  const keyMap = new Map<string, number>();

  for (const p of progressions) {
    const genre = p.parameters?.genre ?? "unknown";
    genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
    const chords = p.chords as ChordProgression;
    const key = chords?.key ?? "?";
    keyMap.set(key, (keyMap.get(key) ?? 0) + 1);
  }

  const topGenre = [...genreMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const topKey = [...keyMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="section-label mb-2">Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">
          Here&apos;s an overview of your creative workspace.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-5 w-5 animate-spin text-[var(--text-muted)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                Total Generations
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {totalGenerations}
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                Top Genre
              </p>
              <p className="mt-2 text-3xl font-semibold capitalize tracking-tight">
                {topGenre}
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                Favorite Key
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {topKey}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/generate"
              className="surface-card group flex items-center gap-4 p-5 transition-all hover:border-[var(--border-strong)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-[var(--foreground)]">
                  New Generation
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                  Create a chord progression with AI
                </p>
              </div>
              <svg className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>

            <Link
              href="/dashboard/history"
              className="surface-card group flex items-center gap-4 p-5 transition-all hover:border-[var(--border-strong)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.6)]">
                <svg className="h-5 w-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-[var(--foreground)]">
                  Browse History
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                  View and manage all saved progressions
                </p>
              </div>
              <svg className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Recent generations */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-[-0.03em]">
                Recent Generations
              </h2>
              {progressions.length > 5 && (
                <Link
                  href="/dashboard/history"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  View all →
                </Link>
              )}
            </div>

            {recent.length === 0 ? (
              <div className="surface-card py-12 text-center">
                <p className="text-sm text-[var(--text-soft)]">
                  No generations yet
                </p>
                <Link
                  href="/dashboard/generate"
                  className="button-primary mt-4 inline-block px-5 py-2 text-sm font-medium"
                >
                  Create your first
                </Link>
              </div>
            ) : (
              <div className="surface-card overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">Prompt</th>
                      <th className="hidden px-4 py-3 font-medium md:table-cell">Key</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((p) => {
                      const chords = p.chords as ChordProgression;
                      return (
                        <tr
                          key={p.id}
                          className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]"
                        >
                          <td className="max-w-[12rem] truncate px-4 py-3 font-medium">
                            {p.name}
                          </td>
                          <td className="hidden max-w-[16rem] truncate px-4 py-3 text-[var(--text-muted)] sm:table-cell">
                            {p.prompt}
                          </td>
                          <td className="hidden px-4 py-3 text-[var(--text-muted)] md:table-cell">
                            {chords?.key} {chords?.scale}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-faint)]">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
