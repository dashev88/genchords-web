import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  ChordProgression,
  GenerateRequest,
  GenerateRequestSchema,
  ChordProgressionSchema,
  PreviewPreset,
} from "@/types/chord";
import { chordToNotes, noteNameToMidi, noteNameToPitchClass } from "@/lib/music";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const HARMONIC_RHYTHM_RULES: Record<string, string> = {
  sparse:
    "Mostly use one chord per bar with only occasional splits. Favor 4-beat chords and reserve shorter durations for a single pickup, anticipation, or turnaround.",
  balanced:
    "Use a mix of one and two chords per bar. At least one bar should contain more than one chord, but keep the groove readable and musical.",
  active:
    "Use frequent intra-bar movement. Several bars should contain two or more chords, and at least one bar should contain three harmonic events or a passing chord.",
  dense:
    "Use rich harmonic motion with passing chords, approach chords, or turnarounds. Half-bar and beat-level movement is expected in multiple bars.",
};

const VARIATION_PROFILES = [
  "Prioritize strong hook-driven harmony with clean voice leading and memorable functional movement.",
  "Lean into inversions, bass motion, and passing movement so the progression flows more than it loops.",
  "Use more color tones, modal interchange, and one unexpected reharmonization without losing musicality.",
  "Push rhythmic density with more intra-bar movement, turnarounds, and setup chords while staying coherent.",
];

const ADVANCED_QUALITIES = new Set([
  "dom7",
  "maj7",
  "min7",
  "min9",
  "maj9",
  "dom9",
  "min11",
  "dom11",
  "maj13",
  "dom13",
  "7b9",
  "7#11",
  "add9",
  "add11",
  "6",
  "min6",
  "sus2",
  "sus4",
]);

const PREVIEW_PRESET_GUIDANCE: Record<PreviewPreset, string> = {
  piano: "Balanced and neutral. Best for clear functional harmony and general-purpose playback.",
  "electric-piano": "Warm and rounded. Best for neo-soul, R&B, jazz-pop, lo-fi, and extended 7th/9th voicings.",
  "warm-pad": "Slow and wide. Best for cinematic, ambient, or spacious progressions with longer durations.",
  pluck: "Short and percussive. Best for active harmonic rhythm, syncopated movement, and split bars.",
  "soft-organ": "Stable and blended. Best for gospel, soul, and dense block-chord voicings with strong inner motion.",
  "choir-pad": "Airy and emotional. Best for lush suspended, modal, or highly voiced harmonic color.",
  "bell-mallet": "Bright and articulate. Best for sparse, modal, minimalist, or delicate consonant progressions.",
  "brass-ensemble": "Bold and dramatic. Best for dominant tension, cinematic lift, or assertive harmonic statements.",
};

const SYSTEM_PROMPT = `You are an expert music theory assistant that generates chord progressions. 
You must return ONLY valid JSON matching the exact schema requested.

Rules:
- All notes must be valid note names with octaves (e.g. "C4", "E4", "G4")
- Chord notes must reflect the ACTUAL played voicing from low to high, including inversions or slash-bass movement when used
- Progressions must be musically coherent for the given key and scale
- Roman numerals must be correct relative to the key
- Duration is measured in beats and may use practical subdivisions such as 0.5, 1, 2, 3, or 4 as long as the total is exact
- Use proper voice leading — minimize large jumps between chords
- For higher complexity, use extensions, substitutions, borrowed harmony, inversions, and passing chords
- For lower complexity, stick to triads and common progressions (I-IV-V-vi etc.)
- When a slash chord or inversion is used, include bassNote and inversion
- bassNote must be the lowest sounding note (e.g. "A2")
- inversion can be values like "root", "1st", "2nd", "3rd", or "inverted"
- Choose previewPreset from the allowed preset list based on the actual harmonic character of the progression, not at random

Chord quality must be one of: major, minor, dim, aug, dom7, maj7, min7, dim7, half-dim7, min9, maj9, dom9, min11, dom11, maj13, dom13, 7b9, 7#11, sus2, sus4, add9, add11, 6, min6

previewPreset must be one of: piano, electric-piano, warm-pad, pluck, soft-organ, choir-pad, bell-mallet, brass-ensemble

Return exactly the total number of beats requested.`;

function getVariationInstruction(index: number, total: number) {
  if (total <= 1) {
    return "Deliver one compelling progression with clear personality and enough contrast to feel authored, not generic.";
  }

  return `This is variation ${index + 1} of ${total}. ${VARIATION_PROFILES[index % VARIATION_PROFILES.length]}`;
}

function summarizeProgression(progression: ChordProgression) {
  return progression.chords
    .map((chord) => `${chord.romanNumeral}:${chord.quality}:${chord.duration}:${chord.bassNote ?? chord.root}`)
    .join(" | ");
}

function getProgressionSignature(progression: ChordProgression) {
  return progression.chords
    .map((chord) => `${chord.root}:${chord.quality}:${chord.duration}:${chord.bassNote ?? "-"}`)
    .join("|");
}

function inferInversion(root: string, quality: string, octave: number, bassNote: string) {
  const expected = chordToNotes(root, quality, octave).map(noteNameToPitchClass);
  const bassPitchClass = noteNameToPitchClass(bassNote);

  if (bassPitchClass === root) return "root";

  const inversionIndex = expected.indexOf(bassPitchClass);
  if (inversionIndex === 1) return "1st";
  if (inversionIndex === 2) return "2nd";
  if (inversionIndex === 3) return "3rd";
  if (inversionIndex === 4) return "4th";

  return "inverted";
}

function enrichProgression(progression: ChordProgression): ChordProgression {
  return {
    ...progression,
    chords: progression.chords.map((chord) => {
      const sortedNotes = [...chord.notes].sort((a, b) => noteNameToMidi(a) - noteNameToMidi(b));
      const bassNote = chord.bassNote ?? sortedNotes[0] ?? `${chord.root}${Math.max(2, chord.octave - 1)}`;
      const inversion = chord.inversion ?? inferInversion(chord.root, chord.quality, chord.octave, bassNote);

      return {
        ...chord,
        bassNote,
        inversion,
      };
    }),
  };
}

function countSplitBars(progression: ChordProgression, bars: number) {
  const counts = Array.from({ length: bars }, () => 0);
  let currentBeat = 0;

  for (const chord of progression.chords) {
    const barIndex = Math.min(bars - 1, Math.floor(currentBeat / 4));
    counts[barIndex] += 1;
    currentBeat += chord.duration;
  }

  return counts.filter((count) => count > 1).length;
}

function getMinimumChordCount(harmonicRhythm: GenerateRequest["harmonicRhythm"], bars: number) {
  switch (harmonicRhythm) {
    case "sparse":
      return bars;
    case "balanced":
      return bars + 1;
    case "active":
      return Math.max(bars + 2, Math.ceil(bars * 1.5));
    case "dense":
      return bars * 2;
    default:
      return bars;
  }
}

function getMinimumSplitBars(harmonicRhythm: GenerateRequest["harmonicRhythm"], bars: number) {
  switch (harmonicRhythm) {
    case "sparse":
      return 0;
    case "balanced":
      return 1;
    case "active":
      return Math.max(2, Math.floor(bars / 2));
    case "dense":
      return Math.max(2, Math.ceil(bars * 0.6));
    default:
      return 0;
  }
}

function validateGeneratedProgression(
  progression: ChordProgression,
  params: Pick<GenerateRequest, "bars" | "complexity" | "harmonicRhythm">,
  existingSignatures: Set<string>,
) {
  if (!progression.previewPreset) {
    return "Choose previewPreset from the allowed list so the preview has an AI-selected default instrument.";
  }

  const totalBeats = progression.chords.reduce((sum, chord) => sum + chord.duration, 0);
  const expectedBeats = params.bars * 4;

  if (Math.abs(totalBeats - expectedBeats) > 0.001) {
    return `Total beats must equal ${expectedBeats}, but got ${totalBeats}.`;
  }

  const minChordCount = getMinimumChordCount(params.harmonicRhythm, params.bars);
  if (progression.chords.length < minChordCount) {
    return `Progression is too static for ${params.harmonicRhythm} rhythm. Increase the number of harmonic events.`;
  }

  const splitBars = countSplitBars(progression, params.bars);
  const minSplitBars = getMinimumSplitBars(params.harmonicRhythm, params.bars);
  if (splitBars < minSplitBars) {
    return `Not enough intra-bar movement. At least ${minSplitBars} bar(s) should contain multiple chords.`;
  }

  if (params.complexity >= 4) {
    const advancedCount = progression.chords.filter((chord) =>
      ADVANCED_QUALITIES.has(chord.quality) || (chord.inversion && chord.inversion !== "root") || chord.duration <= 1,
    ).length;

    if (advancedCount < 2) {
      return "Complexity is too low for the requested setting. Use more extensions, inversions, or shorter passing chords.";
    }
  }

  if (existingSignatures.has(getProgressionSignature(progression))) {
    return "This variation is too similar to an existing one. Make the harmonic rhythm and chord functions more distinct.";
  }

  return null;
}

async function generateSingle(params: {
  prompt: string;
  key: string;
  scale: string;
  tempo: number;
  bars: number;
  genre: string;
  complexity: number;
  harmonicRhythm: GenerateRequest["harmonicRhythm"];
}, context: {
  variationIndex: number;
  variationCount: number;
  previousSummaries: string[];
  existingSignatures: Set<string>;
}) {
  const { prompt, key, scale, tempo, bars, genre, complexity, harmonicRhythm } = params;

  const totalBeats = bars * 4;
  const keyInstruction = key === "auto" ? "Choose the best key for the given genre and mood" : `Key: ${key}`;
  const scaleInstruction = scale === "auto" ? "Choose the best scale for the given genre and mood" : `Scale: ${scale}`;

  let retryInstruction = "";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const previousSummaryText = context.previousSummaries.length
      ? `Avoid duplicating these existing variations:\n- ${context.previousSummaries.join("\n- ")}`
      : "";

    const userPrompt = `Generate a chord progression with the following parameters:
- ${keyInstruction}
- ${scaleInstruction}
- Tempo: ${tempo} BPM
- Time Signature: 4/4
- Number of bars: ${bars} (total beats: ${totalBeats})
- Genre: ${genre}
- Harmonic rhythm / density: ${harmonicRhythm}
- Complexity: ${complexity}/5
- User's creative direction: "${prompt}"

Harmonic rhythm rule:
${HARMONIC_RHYTHM_RULES[harmonicRhythm]}

Complexity guidance:
- 1-2: mostly triads and stable functional movement
- 3: add tasteful 7ths, add9s, suspensions, or one split bar
- 4: use at least two of the following: inversions, slash chords, passing chords, secondary dominant flavor, borrowed color, or denser intra-bar movement
- 5: use clear harmonic personality with multiple advanced colors, denser movement, and strong bass direction while remaining musical

Variation directive:
${getVariationInstruction(context.variationIndex, context.variationCount)}

${previousSummaryText}
${retryInstruction}

Preview preset choices:
${Object.entries(PREVIEW_PRESET_GUIDANCE)
  .map(([preset, description]) => `- ${preset}: ${description}`)
  .join("\n")}

Return a JSON object with this exact structure:
{
  "chords": [
    {
      "root": "D",
      "quality": "min9",
      "duration": 2,
      "octave": 4,
      "notes": ["A2", "D4", "F4", "C5", "E5"],
      "bassNote": "A2",
      "inversion": "2nd",
      "romanNumeral": "i"
    }
  ],
  "previewPreset": "electric-piano",
  "key": "<chosen key>",
  "scale": "<chosen scale>",
  "tempo": ${tempo},
  "timeSignature": [4, 4]
}

The sum of all chord durations MUST equal exactly ${totalBeats} beats.
Use octave 2-5 range for natural sounding voicings and bass movement.
For denser rhythms, include multiple chords within bars instead of stretching everything to 4 beats.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = JSON.parse(text);
    const validated = ChordProgressionSchema.safeParse(json);
    if (!validated.success) {
      retryInstruction = `The previous output was invalid JSON for the schema. Regenerate with the exact requested structure.`;
      continue;
    }

    const progression = enrichProgression(validated.data);
    const validationIssue = validateGeneratedProgression(progression, { bars, complexity, harmonicRhythm }, context.existingSignatures);
    if (!validationIssue) {
      return progression;
    }

    retryInstruction = `Previous attempt issue: ${validationIssue} Regenerate and satisfy the density, complexity, and variation rules more strictly.`;
  }

  throw new Error("AI did not produce a musically valid progression after retries");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { variations = 1, ...params } = parsed.data;

    const results: ChordProgression[] = [];
    const existingSignatures = new Set<string>();

    for (let variationIndex = 0; variationIndex < variations; variationIndex += 1) {
      const result = await generateSingle(params, {
        variationIndex,
        variationCount: variations,
        previousSummaries: results.map(summarizeProgression),
        existingSignatures,
      });

      results.push(result);
      existingSignatures.add(getProgressionSignature(result));
    }

    if (variations === 1) {
      return NextResponse.json(results[0]);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate chord progression" },
      { status: 500 }
    );
  }
}
