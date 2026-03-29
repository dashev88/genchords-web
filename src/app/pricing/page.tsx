import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — GenChords",
  description: "GenChords pricing plans for music producers. Generate chord progressions with AI.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI chord generation",
    features: [
      "10 generations per day",
      "1 variation per generation",
      "All keys & scales",
      "All genres",
      "MIDI export",
      "In-browser playback",
    ],
    cta: "Get started",
    href: "/generate",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious producers who need more",
    features: [
      "Unlimited generations",
      "Up to 4 variations per generation",
      "Priority AI processing",
      "Save unlimited progressions",
      "Advanced complexity controls",
      "Early access to new features",
    ],
    cta: "Coming soon",
    href: "#",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For studios and production teams",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared progression library",
      "API access",
      "Priority support",
      "Custom genre training",
    ],
    cta: "Coming soon",
    href: "#",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-14 text-center">
        <p className="section-label mb-3">Pricing</p>
        <h1 className="mb-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Simple, transparent pricing</h1>
        <p className="mx-auto max-w-md text-[var(--text-soft)]">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      <div className="surface-grid mx-auto grid max-w-4xl gap-px sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.name} className="surface-cell flex flex-col p-8">
            {plan.highlight && (
              <span className="chip mb-5 w-fit px-3 py-1 text-[11px]">Most requested</span>
            )}
            <p className="mb-1 text-sm text-[var(--text-soft)]">{plan.name}</p>
            <div className="mb-4">
              <span className="text-3xl font-semibold tracking-[-0.04em]">{plan.price}</span>
              <span className="text-sm text-[var(--text-faint)]">{plan.period}</span>
            </div>
            <p className="mb-6 text-sm text-[var(--text-muted)]">{plan.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                  <span className="mt-0.5 text-[var(--text-faint)]">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`inline-flex h-10 items-center justify-center px-4 text-sm font-medium ${
                plan.highlight
                  ? "button-primary"
                  : "button-secondary"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-[var(--text-soft)]">
          Have questions? Check our{" "}
          <Link href="/faq" className="text-[var(--foreground)] underline underline-offset-4 hover:opacity-80">
            FAQ
          </Link>
        </p>
      </div>
    </div>
  );
}
