import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chord Library — GenChords",
  description: "Browse pre-made chord progressions by genre, key, and mood. Preview and download MIDI files for your DAW.",
};

const LIBRARY_ITEMS = [
  { id: 1, name: "Pop Anthem", key: "C", scale: "major", genre: "Pop", chords: "I – V – vi – IV", mood: "Uplifting" },
  { id: 2, name: "Jazz Standard", key: "F", scale: "major", genre: "Jazz", chords: "ii – V – I – vi", mood: "Smooth" },
  { id: 3, name: "Lo-fi Chill", key: "D", scale: "minor", genre: "Lo-fi", chords: "i – VI – III – VII", mood: "Relaxed" },
  { id: 4, name: "Cinematic Tension", key: "E", scale: "minor", genre: "Cinematic", chords: "i – iv – V – i", mood: "Dark" },
  { id: 5, name: "R&B Groove", key: "Ab", scale: "major", genre: "R&B", chords: "I – iii – vi – IV", mood: "Soulful" },
  { id: 6, name: "EDM Drop", key: "A", scale: "minor", genre: "EDM", chords: "vi – IV – I – V", mood: "Energetic" },
  { id: 7, name: "Classical Waltz", key: "G", scale: "major", genre: "Classical", chords: "I – IV – V – I", mood: "Elegant" },
  { id: 8, name: "Hip-Hop Dark", key: "C", scale: "minor", genre: "Hip-hop", chords: "i – VII – VI – V", mood: "Hard" },
  { id: 9, name: "Ambient Pad", key: "E", scale: "major", genre: "Ambient", chords: "I – IVmaj7 – vi – iii", mood: "Ethereal" },
  { id: 10, name: "Funk Groove", key: "Bb", scale: "mixolydian", genre: "Funk", chords: "I7 – IV7 – I7 – V7", mood: "Groovy" },
  { id: 11, name: "Gospel Praise", key: "Db", scale: "major", genre: "Gospel", chords: "I – vi – ii – V", mood: "Powerful" },
  { id: 12, name: "Rock Power", key: "E", scale: "minor", genre: "Rock", chords: "i – VII – VI – VII", mood: "Driving" },
];

const GENRES = ["All", "Pop", "Jazz", "Lo-fi", "Cinematic", "R&B", "EDM", "Classical", "Hip-hop", "Ambient", "Funk", "Gospel", "Rock"];

export default function LibraryPage() {
  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-12">
        <p className="section-label mb-3">Library</p>
        <h1 className="mb-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Chord Progressions</h1>
        <p className="max-w-lg text-[var(--text-soft)]">
          Browse pre-made progressions by genre. Use these as starting points, or head to the generator to create your own.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {GENRES.map((g) => (
          <span
            key={g}
            className={`cursor-default px-3 py-1.5 text-xs ${
              g === "All"
                ? "button-primary"
                : "chip"
            }`}
          >
            {g}
          </span>
        ))}
      </div>

      <div className="surface-grid grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {LIBRARY_ITEMS.map((item) => (
          <div key={item.id} className="surface-cell p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 font-medium">{item.name}</h3>
                <p className="text-xs text-[var(--text-faint)]">
                  {item.key} {item.scale} &middot; {item.genre}
                </p>
              </div>
              <span className="chip px-2.5 py-1 text-[11px]">{item.mood}</span>
            </div>
            <p className="mb-5 font-mono text-sm text-[var(--text-soft)]">{item.chords}</p>
            <div className="flex gap-2">
              <Link
                href="/generate"
                className="button-secondary px-3 py-1.5 text-xs"
              >
                Use as starting point
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="mb-4 text-[var(--text-soft)]">Don&apos;t see what you need?</p>
        <Link href="/generate" className="button-primary inline-flex h-11 items-center justify-center px-8 text-sm font-medium">
          Generate a custom progression
        </Link>
      </div>
    </div>
  );
}
