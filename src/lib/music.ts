// Music theory helpers

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const ENHARMONIC_MAP: Record<string, string> = {
  "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#",
  "E#": "F", "B#": "C", "Cb": "B",
};

function normalizeNote(note: string): string {
  const match = note.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return note;
  const [, pitch, octave] = match;
  const normalized = ENHARMONIC_MAP[pitch] || pitch;
  return `${normalized}${octave}`;
}

export function noteNameToMidi(name: string): number {
  const normalized = normalizeNote(name);
  const match = normalized.match(/^([A-G]#?)(\d+)$/);
  if (!match) return 60; // default to middle C
  const [, pitch, octaveStr] = match;
  const noteIndex = NOTE_NAMES.indexOf(pitch);
  if (noteIndex === -1) return 60;
  return (parseInt(octaveStr) + 1) * 12 + noteIndex;
}

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export function noteNameToPitchClass(name: string): string {
  const normalized = normalizeNote(name);
  const match = normalized.match(/^([A-G]#?)/);
  if (!match) return name;
  return match[1];
}

// Chord quality to interval semitones (from root)
const QUALITY_INTERVALS: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dim7: [0, 3, 6, 9],
  "half-dim7": [0, 3, 6, 10],
  min9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  dom9: [0, 4, 7, 10, 14],
  min11: [0, 3, 7, 10, 14, 17],
  dom11: [0, 4, 7, 10, 14, 17],
  maj13: [0, 4, 7, 11, 14, 21],
  dom13: [0, 4, 7, 10, 14, 21],
  "7b9": [0, 4, 7, 10, 13],
  "7#11": [0, 4, 7, 10, 18],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
  add11: [0, 4, 7, 17],
  "6": [0, 4, 7, 9],
  min6: [0, 3, 7, 9],
};

export function chordToNotes(root: string, quality: string, octave: number): string[] {
  const intervals = QUALITY_INTERVALS[quality] || QUALITY_INTERVALS.major;
  const rootNote = `${root}${octave}`;
  const rootMidi = noteNameToMidi(rootNote);
  return intervals.map((interval) => midiToNoteName(rootMidi + interval));
}

export const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const SCALES = [
  "major",
  "minor",
  "dorian",
  "mixolydian",
  "phrygian",
  "lydian",
  "locrian",
  "harmonic minor",
  "melodic minor",
  "pentatonic major",
  "pentatonic minor",
  "blues",
];

export const GENRES = [
  "pop",
  "jazz",
  "lo-fi",
  "cinematic",
  "EDM",
  "R&B",
  "classical",
  "rock",
  "hip-hop",
  "ambient",
  "funk",
  "soul",
  "gospel",
  "latin",
  "country",
  "metal",
];

export const HARMONIC_RHYTHMS = ["sparse", "balanced", "active", "dense"];

export { NOTE_NAMES };
