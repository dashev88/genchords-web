export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  featured: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "use-ai-chord-progressions-without-losing-your-sound",
    title: "How to Use AI Chord Progressions Without Losing Your Sound",
    excerpt:
      "AI can unblock ideas fast, but the best results happen when you treat it like a collaborator instead of a replacement. Here is how to keep your musical identity intact.",
    date: "March 29, 2026",
    category: "Creative Workflow",
    readTime: "5 min read",
    featured: "Use AI to widen the option set, not to outsource taste.",
    sections: [
      {
        heading: "Start with intent, not random prompts",
        paragraphs: [
          "A vague prompt usually creates a vague progression. Before you generate anything, decide what role the harmony should play in the track: emotional lift, suspended tension, late-night warmth, club energy, or minimalist support for a vocal.",
          "When you describe the function of the chords, the AI becomes more useful. It is no longer inventing the entire creative direction. It is responding to one you already set."
        ]
      },
      {
        heading: "React like a producer, not a passive user",
        paragraphs: [
          "The first generation should be treated like a draft board. Keep the voicing you love, replace the weak turnaround, change the rhythm, or mute half of the progression and build around the one moment that feels alive.",
          "That is where your sound stays yours. The AI gives you options. Your ear decides which options deserve to survive."
        ]
      },
      {
        heading: "Use MIDI as raw material",
        paragraphs: [
          "Once the progression is in your DAW, change register, invert chords again, reharmonize the last bar, or split one long chord into two. Exported MIDI is flexible enough to become something personal very quickly.",
          "The smartest workflow is to use AI for momentum and your DAW for authorship."
        ]
      },
      {
        heading: "Keep one human decision in every pass",
        paragraphs: [
          "A simple rule works well: every time you generate, make one clear human choice afterwards. Maybe you change the bass note, maybe you thin out the harmony, maybe you move everything into a darker register.",
          "That small intervention compounds fast, and after a few passes the result feels less like a template and more like a track with identity."
        ]
      }
    ]
  },
  {
    slug: "chord-progression-ideas-for-rnb-pop-and-cinematic-tracks",
    title: "Chord Progression Ideas for R&B, Pop, and Cinematic Tracks",
    excerpt:
      "Different genres ask harmony to do different jobs. These three workflows help you generate better progressions faster by matching the prompt to the production context.",
    date: "March 29, 2026",
    category: "Music Theory",
    readTime: "6 min read",
    featured: "Genre is not only about sound design. It changes what the harmony should communicate.",
    sections: [
      {
        heading: "R&B: prioritize movement and color",
        paragraphs: [
          "For R&B, ask for extended voicings, smooth bass motion, and at least one bar with more than one harmonic event. Ninths, elevenths, and inversions matter because the style depends on internal movement and softness.",
          "A useful prompt shape is: warm, intimate, late-night, elegant tension, smooth release. That combination usually pushes the generator toward better voicings than simply typing neo-soul."
        ]
      },
      {
        heading: "Pop: clarity beats complexity",
        paragraphs: [
          "Pop progressions need to support hooks, toplines, and arrangement changes. Ask for strong functional motion, memorable cadence, and a version that stays singable after one listen.",
          "This does not mean the chords must be simple. It means the emotional read has to be immediate. Too much chromatic color can blur the hook."
        ]
      },
      {
        heading: "Cinematic: make the harmony pace the scene",
        paragraphs: [
          "Cinematic writing benefits from longer arcs. Ask for suspended tension, delayed resolution, and evolving harmonic rhythm so the progression feels like it is moving somewhere instead of looping in place.",
          "When the generator returns a strong shape, preview it with a slower preset and listen for whether the chords imply a scene change, not just a playlist mood."
        ]
      },
      {
        heading: "Generate variations on purpose",
        paragraphs: [
          "Instead of asking for four generic variations, ask for four distinct roles: one stable, one colorful, one dramatic, and one more rhythmic. You will get a wider creative spread and waste less time skipping near-duplicates.",
          "That is also the fastest way to discover whether the track wants to be intimate, glossy, or huge."
        ]
      }
    ]
  },
  {
    slug: "from-prompt-to-daw-a-fast-midi-workflow-for-producers",
    title: "From Prompt to DAW: A Fast MIDI Workflow for Producers",
    excerpt:
      "A useful AI music workflow is not generate-and-forget. It is generate, audition, export, reshape, and build. Here is a practical loop that keeps sessions moving.",
    date: "March 29, 2026",
    category: "Production",
    readTime: "4 min read",
    featured: "Speed matters most when the handoff from idea to arrangement is frictionless.",
    sections: [
      {
        heading: "Generate with the arrangement in mind",
        paragraphs: [
          "Do not wait until after export to decide what the chords are for. If the progression is meant to support a verse, ask for restraint. If it is meant to carry a drop or chorus, ask for stronger motion and wider emotional contrast.",
          "That single decision changes both the output and how much editing you need later."
        ]
      },
      {
        heading: "Preview before you commit",
        paragraphs: [
          "Audition the generated progression with different preview instruments and listen for rhythm, weight, and voicing clarity. A pluck will expose clutter. A pad will reveal whether the harmony can sustain emotion over time.",
          "Choose the version that makes sense structurally, not only the one that sounds the prettiest in isolation."
        ]
      },
      {
        heading: "Export early and edit ruthlessly",
        paragraphs: [
          "As soon as one variation feels close, drag the MIDI into the project and adapt it to the production. Double the top note, thin out the middle voices, or rewrite the bass so it locks with the groove.",
          "If the generated idea saves you ten minutes and your edits add character, the workflow is doing its job."
        ]
      },
      {
        heading: "Keep the loop short",
        paragraphs: [
          "The fastest sessions stay in a small loop: prompt, generate, preview, export, tweak. Avoid collecting endless options. Pick the one that opens a direction and move forward.",
          "AI is strongest when it reduces hesitation. Your production process should turn that speed into a finished record."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}