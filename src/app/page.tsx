import Link from "next/link";

const HERO_STEPS = ["Prompt", "Generate", "Preview", "Export"];
const HERO_CHORDS = ["Dm9", "Bbmaj7", "F/A", "Cadd9"];
const HERO_NOTES = [
  { left: "8%", width: "18%", top: "18%", delay: "0s" },
  { left: "30%", width: "14%", top: "38%", delay: "0.18s" },
  { left: "48%", width: "19%", top: "26%", delay: "0.36s" },
  { left: "71%", width: "13%", top: "46%", delay: "0.54s" },
  { left: "16%", width: "12%", top: "62%", delay: "0.72s" },
  { left: "58%", width: "17%", top: "66%", delay: "0.9s" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="page-shell grid gap-8 pb-20 pt-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(31rem,35rem)] lg:items-start lg:gap-8 lg:pt-24">
        <div className="lg:pt-4">
          <div className="chip mb-6 px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]/70" />
            AI Chord Progression Generator
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            AI chord progression generator for producers and songwriters.
          </h1>
          <p className="section-copy mt-6 max-w-2xl text-base sm:text-lg">
            Use AI to explore harmony, break writer&apos;s block, and hear fresh ideas quickly, then keep only what inspires you. GenChords gives you a musical starting point without taking over the creative decisions that make the track yours.
          </p>
          <div className="surface-card-muted mt-5 max-w-2xl px-4 py-4 sm:px-5">
            <p className="text-sm leading-relaxed text-[var(--text-soft)]">
              Prompt the vibe, audition variations, edit the result, and drag the MIDI into your DAW. Think of it as an inspiration engine, not an autopilot.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/generate" className="button-primary inline-flex h-11 items-center justify-center px-7 text-sm font-medium">
              Start generating
            </Link>
            <Link href="/library" className="button-secondary inline-flex h-11 items-center justify-center px-7 text-sm font-medium">
              Browse library
            </Link>
          </div>
        </div>

        <div className="hero-demo surface-card p-4 sm:p-5 lg:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="section-label mb-2">Live Workflow</p>
              <p className="text-sm text-[var(--text-soft)]">From inspiration to playable MIDI without losing your own direction.</p>
            </div>
            <div className="chip px-2.5 py-1 text-[11px]">Mini demo</div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="surface-card-muted min-w-0 p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {HERO_STEPS.map((step, index) => (
                  <div
                    key={step}
                    className={`hero-demo-step rounded-full border px-2.5 py-1 text-[11px] ${index === 1 ? "hero-demo-step-active" : ""}`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    {step}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.74)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Creative Prompt</p>
                <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                  Dreamy late-night R&amp;B with soft tension and a clean resolution. Give me a starting point I can still shape myself.
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-[var(--text-muted)]">
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-3 py-2">Key: Auto</div>
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-3 py-2">Genre: R&amp;B</div>
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-3 py-2">4 Bars</div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="button-primary inline-flex h-9 items-center justify-center px-4 text-xs font-medium">
                  Generate 4 variations
                </div>
                <div className="hero-demo-pulse text-xs text-[var(--text-faint)]">AI is arranging ideas...</div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[var(--text-faint)]">
                Keep the chords you like, swap the ones you don&apos;t, and build the rest by ear.
              </p>
            </div>

            <div className="surface-card-muted min-w-0 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Preview</p>
                <div className="hero-demo-playhead-indicator flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--foreground)]" />
                  Looping
                </div>
              </div>

              <div className="mb-3 flex gap-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-2">
                {HERO_CHORDS.map((chord, index) => (
                  <div
                    key={chord}
                    className={`hero-demo-chord flex-1 rounded-xl border px-2 py-2 text-center text-xs font-medium ${index === 0 ? "hero-demo-chord-active" : ""}`}
                    style={{ animationDelay: `${index * 0.45}s` }}
                  >
                    {chord}
                  </div>
                ))}
              </div>

              <div className="hero-demo-roll relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(241,239,234,0.9))] px-3 py-4">
                <div className="hero-demo-grid-lines absolute inset-0" />
                {HERO_NOTES.map((note, index) => (
                  <span
                    key={`${note.left}-${index}`}
                    className="hero-demo-note absolute h-3 rounded-md bg-[var(--foreground)]/85"
                    style={{
                      left: note.left,
                      width: note.width,
                      top: note.top,
                      animationDelay: note.delay,
                    }}
                  />
                ))}
                <span className="hero-demo-playhead absolute bottom-0 top-0 w-[2px] bg-[var(--foreground)]" />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-faint)]">
                <span>MIDI ready</span>
                <span>Drag into Ableton, Logic, FL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-9">
        <div className="page-shell">
          <p className="section-label mb-6 text-center">Works with every major DAW</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--text-faint)]">
            <span>Ableton Live</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>FL Studio</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>Logic Pro</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>Pro Tools</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>Cubase</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>Studio One</span>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24">
        <div className="mb-14 text-center">
          <p className="section-label mb-3">Features</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">A cleaner workflow from prompt to piano roll</h2>
        </div>
        <div className="surface-grid grid gap-px sm:grid-cols-3">
          {[
            { title: "AI Inspiration", desc: "Describe a mood in plain language and get musical starting points you can still edit, reject, or expand in your own way." },
            { title: "Instant Playback", desc: "Preview your progression in the browser with a built-in synthesizer. Hear the chords as they play on the piano roll." },
            { title: "MIDI Export", desc: "Download your progression as a standard MIDI file. Drag and drop directly into any DAW." },
            { title: "Multiple Variations", desc: "Generate up to 4 variations at once. Compare options side by side and pick the one that fits." },
            { title: "Genre-Aware", desc: "Select from 16+ genres. The AI adapts harmonic conventions, voicings, and complexity to match your style." },
            { title: "Creative Control", desc: "Control key, scale, tempo, bars, and complexity — or let the AI decide first, then reshape the outcome however you want." },
          ].map((f) => (
            <div key={f.title} className="surface-cell p-8">
              <h3 className="mb-3 text-lg font-medium">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="page-shell">
          <div className="mb-14 text-center">
            <p className="section-label mb-3">Simple workflow</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Three steps to your next progression</h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { step: "01", title: "Set your parameters", desc: "Choose key, scale, tempo, genre, and complexity — or leave it to the AI." },
              { step: "02", title: "Describe the vibe", desc: "Write a creative prompt like 'dreamy lo-fi sunset' or 'dark cinematic build-up' and let AI propose ideas worth reacting to." },
              { step: "03", title: "Export & produce", desc: "Preview with playback, keep the parts that inspire you, and download the MIDI file for your DAW." },
            ].map((item) => (
              <div key={item.step} className="surface-card-muted p-6">
                <p className="mb-4 font-mono text-xs text-[var(--text-faint)]">{item.step}</p>
                <h3 className="mb-2 text-lg font-medium">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="page-shell">
          <div className="surface-card grid gap-8 px-6 py-8 text-center sm:grid-cols-4 sm:px-8">
            {[
              { value: "16+", label: "Genres" },
              { value: "12", label: "Scales" },
              { value: "4", label: "Variations at once" },
              { value: "∞", label: "Possibilities" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold tracking-[-0.04em]">{s.value}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="page-shell">
          <div className="mb-14 text-center">
            <p className="section-label mb-3">Use cases</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Built for every kind of producer</h2>
          </div>
          <div className="surface-grid grid gap-px sm:grid-cols-2">
            {[
              { title: "Beat Makers", desc: "Quickly generate chord loops for hip-hop, trap, and R&B beats, then layer your own toplines, bass, and drums on top." },
              { title: "Film Composers", desc: "Create cinematic progressions for scores and soundtracks. Use AI to discover tension, then refine pacing and orchestration yourself." },
              { title: "Singer-Songwriters", desc: "Find fresh harmonic ideas when you're stuck. Keep the emotion of your writing while using AI as a fast sketchpad." },
              { title: "Electronic Producers", desc: "Generate EDM, ambient, and lo-fi chord patterns. Drag MIDI clips into Ableton or FL Studio and keep iterating with your own sound design." },
            ].map((c) => (
              <div key={c.title} className="surface-cell p-8">
                <h3 className="mb-3 text-lg font-medium">{c.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="page-shell text-center">
          <div className="surface-card px-6 py-12 sm:px-10">
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Ready to start creating?</h2>
            <p className="mx-auto mb-8 max-w-md text-[var(--text-soft)]">
            Generate your first chord progression in under 30 seconds. Use AI to spark the idea, then take it wherever your track needs to go.
            </p>
            <Link href="/generate" className="button-primary inline-flex h-11 items-center justify-center px-8 text-sm font-medium">
              Start generating — it&apos;s free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
