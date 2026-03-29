"use client";

import * as Tone from "tone";
import { ChordProgression, PreviewPreset } from "@/types/chord";
import { midiToNoteName, noteNameToMidi } from "@/lib/music";

type PreviewOscillator =
  | "triangle4"
  | "sine4"
  | "triangle8"
  | "square4"
  | "sine"
  | "triangle"
  | "square"
  | "sawtooth";

export const PREVIEW_PRESETS: Record<
  PreviewPreset,
  {
    label: string;
    hint: string;
    oscillator: PreviewOscillator;
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
    volume: number;
  }
> = {
  piano: {
    label: "Piano",
    hint: "Balanced and neutral for checking harmony.",
    oscillator: "triangle4",
    envelope: { attack: 0.008, decay: 0.22, sustain: 0.18, release: 1.1 },
    volume: -6,
  },
  "electric-piano": {
    label: "Electric Piano",
    hint: "Softer transient with more body for R&B and lo-fi.",
    oscillator: "sine4",
    envelope: { attack: 0.01, decay: 0.28, sustain: 0.1, release: 0.95 },
    volume: -7,
  },
  "warm-pad": {
    label: "Warm Pad",
    hint: "Slower attack and longer release for cinematic previews.",
    oscillator: "triangle8",
    envelope: { attack: 0.24, decay: 0.42, sustain: 0.62, release: 1.8 },
    volume: -9,
  },
  pluck: {
    label: "Pluck",
    hint: "Sharper transient to hear rhythmic movement inside the bar.",
    oscillator: "square4",
    envelope: { attack: 0.002, decay: 0.14, sustain: 0.04, release: 0.3 },
    volume: -8,
  },
  "soft-organ": {
    label: "Soft Organ",
    hint: "Smooth and steady for gospel, soul, and voiced block chords.",
    oscillator: "sine",
    envelope: { attack: 0.018, decay: 0.12, sustain: 0.66, release: 0.82 },
    volume: -9,
  },
  "choir-pad": {
    label: "Choir Pad",
    hint: "Airy and emotional for lush voicings and suspended harmony.",
    oscillator: "triangle",
    envelope: { attack: 0.3, decay: 0.34, sustain: 0.74, release: 2.2 },
    volume: -10,
  },
  "bell-mallet": {
    label: "Bell Mallet",
    hint: "Clean attack for sparse, bright, or modal progressions.",
    oscillator: "square",
    envelope: { attack: 0.001, decay: 0.22, sustain: 0.02, release: 1.05 },
    volume: -12,
  },
  "brass-ensemble": {
    label: "Brass Ensemble",
    hint: "Bold and urgent for tension-heavy, dramatic harmonic movement.",
    oscillator: "sawtooth",
    envelope: { attack: 0.028, decay: 0.2, sustain: 0.44, release: 0.72 },
    volume: -11,
  },
};

interface PlaybackOptions {
  preset?: PreviewPreset;
  bassLayer?: boolean;
}

let synth: Tone.PolySynth | null = null;
let synthPreset: PreviewPreset | null = null;
let bassSynth: Tone.MonoSynth | null = null;
let scheduledEvents: number[] = [];
let beatInterval: ReturnType<typeof setInterval> | null = null;
let loopEnabled = true;
let currentProgression: ChordProgression | null = null;

function createSynthForPreset(presetName: PreviewPreset) {
  const preset = PREVIEW_PRESETS[presetName];
  const nextSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: preset.oscillator },
    envelope: preset.envelope,
  }).toDestination();

  nextSynth.maxPolyphony = 24;
  nextSynth.volume.value = preset.volume;

  return nextSynth;
}

function getSynth(presetName: PreviewPreset): Tone.PolySynth {
  if (!synth || synthPreset !== presetName) {
    synth?.dispose();
    synth = createSynthForPreset(presetName);
    synthPreset = presetName;
  }

  return synth;
}

function getBassSynth() {
  if (!bassSynth) {
    bassSynth = new Tone.MonoSynth({
      oscillator: { type: "triangle2" },
      filter: { Q: 1, type: "lowpass", rolloff: -24 },
      envelope: { attack: 0.01, decay: 0.18, sustain: 0.45, release: 0.7 },
      filterEnvelope: { attack: 0.005, decay: 0.18, sustain: 0.2, release: 0.6, baseFrequency: 90, octaves: 2 },
    }).toDestination();
    bassSynth.volume.value = -10;
  }

  return bassSynth;
}

function resolveBassPreviewNote(chord: ChordProgression["chords"][number]) {
  if (chord.bassNote) {
    return chord.bassNote;
  }

  if (chord.notes.length > 0) {
    const lowestNote = [...chord.notes].sort((a, b) => noteNameToMidi(a) - noteNameToMidi(b))[0];
    return midiToNoteName(Math.max(24, noteNameToMidi(lowestNote) - 12));
  }

  return `${chord.root}${Math.max(2, chord.octave - 1)}`;
}

function scheduleProgression(
  progression: ChordProgression,
  s: Tone.PolySynth,
  bass: Tone.MonoSynth | null,
  onChordChange?: (index: number) => void,
  startOffset: number = 0,
) {
  let currentBeat = 0;

  progression.chords.forEach((chord, index) => {
    const beatTime = startOffset + (currentBeat * 60) / progression.tempo;

    const eventId = Tone.getTransport().schedule(() => {
      const durationSeconds = (chord.duration * 60) / progression.tempo;
      s.triggerAttackRelease(chord.notes, durationSeconds, undefined, 0.88);
      if (bass) {
        bass.triggerAttackRelease(resolveBassPreviewNote(chord), Math.max(0.1, durationSeconds * 0.92), undefined, 0.72);
      }
      onChordChange?.(index);
    }, beatTime);

    scheduledEvents.push(eventId);
    currentBeat += chord.duration;
  });

  return (currentBeat * 60) / progression.tempo;
}

function scheduleLoop() {
  if (!currentProgression || !loopEnabled) return;

  const totalBeats = currentProgression.chords.reduce((sum, c) => sum + c.duration, 0);
  const loopDuration = (totalBeats * 60) / currentProgression.tempo;

  Tone.getTransport().loopEnd = loopDuration;
  Tone.getTransport().loop = true;
}

export async function startPlayback(
  progression: ChordProgression,
  onChordChange?: (index: number) => void,
  onBeatChange?: (beat: number) => void,
  options?: PlaybackOptions,
) {
  await Tone.start();

  stopPlayback();

  currentProgression = progression;

  const preset = options?.preset ?? progression.previewPreset ?? "piano";
  const s = getSynth(preset);
  const bass = options?.bassLayer ? getBassSynth() : null;

  Tone.getTransport().bpm.value = progression.tempo;
  Tone.getTransport().timeSignature = progression.timeSignature[0];

  scheduleProgression(progression, s, bass, onChordChange);
  scheduleLoop();

  Tone.getTransport().start();

  // Start beat tracking interval
  if (onBeatChange) {
    beatInterval = setInterval(() => {
      const transportSeconds = Tone.getTransport().seconds;
      const beat = (transportSeconds * progression.tempo) / 60;
      onBeatChange(beat);
    }, 1000 / 60); // 60fps
  }
}

export function stopPlayback() {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  Tone.getTransport().loop = false;
  Tone.getTransport().position = 0;
  scheduledEvents = [];
  synth?.releaseAll();
  bassSynth?.triggerRelease();
  currentProgression = null;

  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

export function getTransportState(): "started" | "stopped" | "paused" {
  return Tone.getTransport().state;
}
