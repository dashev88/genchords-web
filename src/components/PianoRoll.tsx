"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ChordProgression } from "@/types/chord";
import { noteNameToMidi } from "@/lib/music";

interface PianoRollProps {
  progression: ChordProgression;
  activeChordIndex: number;
  currentBeat: number;
}

const PIANO_KEY_HEIGHT = 14;
const BEAT_WIDTH = 48;
const KEYBOARD_WIDTH = 40;

export default function PianoRoll({ progression, activeChordIndex, currentBeat }: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragBeat, setDragBeat] = useState<number | null>(null);

  // Calculate note range
  const allMidiNotes = progression.chords.flatMap((c) =>
    c.notes.map((n) => noteNameToMidi(n))
  );
  const minNote = Math.min(...allMidiNotes) - 2;
  const maxNote = Math.max(...allMidiNotes) + 2;
  const noteRange = maxNote - minNote + 1;

  const totalBeats = progression.chords.reduce((sum, c) => sum + c.duration, 0);
  const canvasWidth = KEYBOARD_WIDTH + totalBeats * BEAT_WIDTH;
  const canvasHeight = noteRange * PIANO_KEY_HEIGHT;

  const isBlackKey = useCallback((midi: number): boolean => {
    const note = midi % 12;
    return [1, 3, 6, 8, 10].includes(note);
  }, []);

  const midiToName = useCallback((midi: number): string => {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(midi / 12) - 1;
    return `${names[midi % 12]}${octave}`;
  }, []);

  // Auto-scroll to follow playhead
  useEffect(() => {
    if (scrollRef.current && currentBeat > 0 && !isDragging) {
      const playheadX = KEYBOARD_WIDTH + currentBeat * BEAT_WIDTH;
      const container = scrollRef.current;
      const visibleWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

      if (playheadX > scrollLeft + visibleWidth - 80 || playheadX < scrollLeft + KEYBOARD_WIDTH) {
        container.scrollTo({
          left: Math.max(0, playheadX - visibleWidth / 3),
          behavior: "smooth",
        });
      }
    }
  }, [currentBeat, isDragging]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#fcfbf8";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid rows (piano keys)
    for (let i = 0; i <= noteRange; i++) {
      const midiNote = maxNote - i;
      const y = i * PIANO_KEY_HEIGHT;

      ctx.fillStyle = isBlackKey(midiNote) ? "#ece8e0" : "#f7f4ee";
      ctx.fillRect(KEYBOARD_WIDTH, y, canvasWidth - KEYBOARD_WIDTH, PIANO_KEY_HEIGHT);

      ctx.strokeStyle = "#ddd8cf";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(KEYBOARD_WIDTH, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();

      // Piano key
      if (i < noteRange) {
        ctx.fillStyle = isBlackKey(midiNote) ? "#d9d3c8" : "#f1ede6";
        ctx.fillRect(0, y, KEYBOARD_WIDTH - 1, PIANO_KEY_HEIGHT);

        if (midiNote % 12 === 0) {
          ctx.fillStyle = "#757b82";
          ctx.font = "9px sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(midiToName(midiNote), KEYBOARD_WIDTH - 4, y + PIANO_KEY_HEIGHT - 3);
        }
      }
    }

    // Draw beat lines
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = KEYBOARD_WIDTH + beat * BEAT_WIDTH;
      ctx.strokeStyle = beat % 4 === 0 ? "#bcb6ab" : "#e2ddd5";
      ctx.lineWidth = beat % 4 === 0 ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // Draw notes
    let currentBeatOffset = 0;
    progression.chords.forEach((chord, chordIdx) => {
      const isActive = chordIdx === activeChordIndex;

      chord.notes.forEach((noteName) => {
        const midi = noteNameToMidi(noteName);
        const y = (maxNote - midi) * PIANO_KEY_HEIGHT;
        const x = KEYBOARD_WIDTH + currentBeatOffset * BEAT_WIDTH;
        const width = chord.duration * BEAT_WIDTH - 2;

        // Note rectangle
        ctx.fillStyle = isActive ? "#151515" : "#686e75";
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, width, PIANO_KEY_HEIGHT - 2, 2);
        ctx.fill();

        // Note label
        if (width > 28) {
          ctx.fillStyle = "#fbfaf8";
          ctx.font = "bold 8px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(noteName, x + 4, y + PIANO_KEY_HEIGHT - 4);
        }
      });

      currentBeatOffset += chord.duration;
    });

    // Active chord highlight column
    if (activeChordIndex >= 0 && activeChordIndex < progression.chords.length) {
      let activeBeat = 0;
      for (let i = 0; i < activeChordIndex; i++) {
        activeBeat += progression.chords[i].duration;
      }
      const x = KEYBOARD_WIDTH + activeBeat * BEAT_WIDTH;
      const width = progression.chords[activeChordIndex].duration * BEAT_WIDTH;

      ctx.fillStyle = "rgba(20, 20, 20, 0.05)";
      ctx.fillRect(x, 0, width, canvasHeight);
    }

    // Draw playhead line
    const displayBeat = dragBeat !== null ? dragBeat : currentBeat;
    if (displayBeat >= 0) {
      const playheadX = KEYBOARD_WIDTH + displayBeat * BEAT_WIDTH;
      ctx.strokeStyle = "#141414";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();

      // Playhead handle
      ctx.fillStyle = "#141414";
      ctx.beginPath();
      ctx.moveTo(playheadX - 5, 0);
      ctx.lineTo(playheadX + 5, 0);
      ctx.lineTo(playheadX, 8);
      ctx.closePath();
      ctx.fill();
    }
  }, [progression, activeChordIndex, currentBeat, dragBeat, canvasWidth, canvasHeight, maxNote, noteRange, totalBeats, isBlackKey, midiToName]);

  // Mouse handlers for dragging playhead
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const beat = (x - KEYBOARD_WIDTH) / BEAT_WIDTH;
    if (beat >= 0 && beat <= totalBeats) {
      setIsDragging(true);
      setDragBeat(Math.max(0, Math.min(totalBeats, beat)));
    }
  }, [canvasWidth, totalBeats]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const beat = (x - KEYBOARD_WIDTH) / BEAT_WIDTH;
    setDragBeat(Math.max(0, Math.min(totalBeats, beat)));
  }, [isDragging, canvasWidth, totalBeats]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragBeat(null);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.7)]">
      <div ref={scrollRef} className="overflow-x-auto">
        <canvas
          ref={canvasRef}
          style={{ width: canvasWidth, height: Math.min(canvasHeight, 280) }}
          className="block cursor-col-resize"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
}
