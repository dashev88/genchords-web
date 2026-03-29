"use client";

import { useState } from "react";
import { GENRES, HARMONIC_RHYTHMS, KEYS, SCALES } from "@/lib/music";
import { GenerateRequest, ChordProgression } from "@/types/chord";

interface GenerationFormProps {
  onGenerate: (progressions: ChordProgression[], params: GenerateRequest) => void;
  onGeneratingChange?: (loading: boolean) => void;
}

function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map((part) => {
          if (!part) return part;
          if (part === part.toUpperCase()) return part;
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("-")
    )
    .join(" ");
}

export default function GenerationForm({ onGenerate, onGeneratingChange }: GenerationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [params, setParams] = useState<GenerateRequest>({
    prompt: "",
    key: "auto",
    scale: "auto",
    tempo: 120,
    bars: 4,
    genre: "pop",
    complexity: 3,
    harmonicRhythm: "balanced",
    variations: 1,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    onGeneratingChange?.(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      // API returns single object for 1 variation, array for multiple
      const progressions: ChordProgression[] = Array.isArray(data) ? data : [data];
      onGenerate(progressions, params);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      onGeneratingChange?.(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="ui-label">
          Creative Direction
        </label>
        <textarea
          value={params.prompt}
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
          placeholder="e.g. dark cinematic tension building to an epic resolution"
          required
          rows={3}
          className="ui-field resize-none px-3 py-2.5 text-sm placeholder:text-[var(--text-faint)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="ui-label">Key</label>
          <select
            value={params.key}
            onChange={(e) => setParams({ ...params, key: e.target.value })}
            className="ui-field appearance-none px-3 py-2.5 text-sm"
          >
            <option value="auto" className="bg-white text-[var(--foreground)]">AI Decides</option>
            {KEYS.map((k) => (
              <option key={k} value={k} className="bg-white text-[var(--foreground)]">{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="ui-label">Scale</label>
          <select
            value={params.scale}
            onChange={(e) => setParams({ ...params, scale: e.target.value })}
            className="ui-field appearance-none px-3 py-2.5 text-sm"
          >
            <option value="auto" className="bg-white text-[var(--foreground)]">AI Decides</option>
            {SCALES.map((s) => (
              <option key={s} value={s} className="bg-white text-[var(--foreground)]">{formatLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="ui-label">
            Tempo: {params.tempo} BPM
          </label>
          <input
            type="range"
            min={40}
            max={240}
            value={params.tempo}
            onChange={(e) => setParams({ ...params, tempo: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-[var(--text-faint)]">
            <span>40</span>
            <span>240</span>
          </div>
        </div>
        <div>
          <label className="ui-label">Bars</label>
          <div className="flex gap-1.5">
            {[2, 4, 8, 16].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setParams({ ...params, bars: b })}
                className={`flex-1 px-2 py-2 text-sm font-medium ${
                  params.bars === b
                    ? "button-primary"
                    : "button-secondary"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="ui-label">Genre</label>
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setParams({ ...params, genre: g })}
              className={`px-2.5 py-1 text-xs font-medium ${
                params.genre === g
                  ? "button-primary"
                  : "button-secondary"
              }`}
            >
              {formatLabel(g)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="ui-label">Density</label>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {HARMONIC_RHYTHMS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setParams({ ...params, harmonicRhythm: value as GenerateRequest["harmonicRhythm"] })}
              className={`px-2 py-2 text-xs font-medium ${
                params.harmonicRhythm === value
                  ? "button-primary"
                  : "button-secondary"
              }`}
            >
              {formatLabel(value)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--text-faint)]">
          Controls how much harmonic movement happens inside each bar.
        </p>
      </div>

      <div>
        <label className="ui-label">
          Complexity: {params.complexity}/5
        </label>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={params.complexity}
          onChange={(e) => setParams({ ...params, complexity: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[10px] text-[var(--text-faint)]">
          <span>Simple</span>
          <span>Complex</span>
        </div>
      </div>

      <div>
        <label className="ui-label">Variations</label>
        <div className="flex gap-1.5">
          {[1, 2, 4].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setParams({ ...params, variations: v })}
              className={`flex-1 px-2 py-2 text-sm font-medium ${
                params.variations === v
                  ? "button-primary"
                  : "button-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !params.prompt}
        className="button-primary w-full px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating{params.variations && params.variations > 1 ? ` ${params.variations} variations` : ""}...
          </span>
        ) : (
          `Generate${params.variations && params.variations > 1 ? ` ${params.variations} variations` : ""}`
        )}
      </button>
    </form>
  );
}
