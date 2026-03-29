import { z } from "zod/v4";

export const PreviewPresetSchema = z.enum([
  "piano",
  "electric-piano",
  "warm-pad",
  "pluck",
  "soft-organ",
  "choir-pad",
  "bell-mallet",
  "brass-ensemble",
]);

export const ChordSchema = z.object({
  root: z.string(),
  quality: z.string(),
  duration: z.number().positive(),
  octave: z.number(),
  notes: z.array(z.string()),
  bassNote: z.string().optional(),
  inversion: z.string().optional(),
  romanNumeral: z.string(),
});

export const ChordProgressionSchema = z.object({
  chords: z.array(ChordSchema),
  previewPreset: PreviewPresetSchema.optional(),
  key: z.string(),
  scale: z.string(),
  tempo: z.number(),
  timeSignature: z.tuple([z.number(), z.number()]),
});

export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
  key: z.string(),
  scale: z.string(),
  tempo: z.number().min(40).max(240),
  bars: z.number().min(2).max(32),
  genre: z.string(),
  complexity: z.number().min(1).max(5),
  harmonicRhythm: z.enum(["sparse", "balanced", "active", "dense"]).optional().default("balanced"),
  variations: z.number().min(1).max(4).optional().default(1),
});

export type Chord = z.infer<typeof ChordSchema>;
export type PreviewPreset = z.infer<typeof PreviewPresetSchema>;
export type ChordProgression = z.infer<typeof ChordProgressionSchema>;
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export interface SavedProgression {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  parameters: GenerateRequest;
  chords: ChordProgression;
  created_at: string;
}
