import { Midi } from "@tonejs/midi";
import { ChordProgression } from "@/types/chord";
import { noteNameToMidi } from "./music";

export function progressionToMidi(progression: ChordProgression): Uint8Array {
  const midi = new Midi();
  const { tempo, timeSignature } = progression;

  midi.header.setTempo(tempo);
  midi.header.timeSignatures.push({
    ticks: 0,
    timeSignature: [timeSignature[0], timeSignature[1]],
    measures: 0,
  });
  midi.header.name = "GenChords Chord Progression";

  const track = midi.addTrack();
  track.name = "Chords";
  track.channel = 0;

  const ppq = midi.header.ppq; // pulses per quarter note
  let currentTick = 0;

  for (const chord of progression.chords) {
    const durationTicks = chord.duration * ppq;

    for (const noteName of chord.notes) {
      const midiNumber = noteNameToMidi(noteName);
      track.addNote({
        midi: midiNumber,
        ticks: currentTick,
        durationTicks: durationTicks,
        velocity: 0.8,
      });
    }

    currentTick += durationTicks;
  }

  return midi.toArray();
}

export function downloadMidi(progression: ChordProgression, filename?: string) {
  const data = progressionToMidi(progression);
  const blob = new Blob([data.buffer as ArrayBuffer], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "genchords-progression.mid";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
