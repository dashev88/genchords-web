import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="page-shell py-14">
        <div className="surface-card px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-10 sm:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-3 text-lg font-semibold">
                <Image
                  src="/icon.png"
                  alt="GenChords logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg object-cover"
                />
                <p>GenChords</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                AI-powered chord progression generator for music producers.
              </p>
              <div className="chip mt-5 px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]/70" />
                Built for fast sketching
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--text-soft)]">Product</p>
              <div className="space-y-2">
                <Link href="/generate" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Generate</Link>
                <Link href="/library" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Library</Link>
                <Link href="/pricing" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Pricing</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--text-soft)]">Resources</p>
              <div className="space-y-2">
                <Link href="/blog" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Blog</Link>
                <Link href="/faq" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">FAQ</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--text-soft)]">Legal</p>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Terms</Link>
                <Link href="#" className="block text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} GenChords. All rights reserved.</p>
            <p>Minimal tools for modern music workflows</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
