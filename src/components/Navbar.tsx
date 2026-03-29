"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/generate", label: "Generate" },
    { href: "/library", label: "Library" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ];

  const dashboardLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/generate", label: "Generate" },
    { href: "/dashboard/history", label: "History" },
  ];

  return (
    <nav className="sticky top-4 z-50">
      <div className="page-shell">
        <div className="surface-card grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <Image
              src="/icon.png"
              alt="GenChords logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span>GenChords</span>
          </Link>

          <div className="hidden items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-self-end gap-3">
            {user ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/dashboard"
                  className="button-primary px-4 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/auth/login"
                  className="text-sm text-[var(--text-soft)] hover:text-[var(--foreground)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/login"
                  className="button-primary px-4 py-2 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-full border border-[var(--border)] p-2 text-[var(--text-soft)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)] md:hidden"
              aria-label="Toggle navigation"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="page-shell mt-3 md:hidden">
          <div className="surface-card space-y-3 rounded-3xl px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[var(--text-soft)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] pt-3 mt-1" />
            {user ? (
              <>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-[var(--text-soft)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm text-[var(--text-faint)] hover:text-[var(--foreground)]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Sign in / Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
