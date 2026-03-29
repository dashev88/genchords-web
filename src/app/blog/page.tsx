import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog — GenChords",
  description: "Guides on AI-assisted chord writing, creative workflows, music theory, and exporting better MIDI ideas into your DAW.",
};

export default function BlogPage() {
  const [featuredPost, ...secondaryPosts] = BLOG_POSTS;

  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-12">
        <p className="section-label mb-3">Blog</p>
        <h1 className="mb-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">AI chord writing, MIDI workflow, and creative production notes</h1>
        <p className="max-w-2xl text-[var(--text-soft)]">
          Three practical reads on using AI as a musical sketch tool, protecting your creative identity, and getting better harmony into your DAW faster.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <article className="surface-card p-7 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="chip px-3 py-1">Featured</span>
            <span className="text-[var(--text-faint)]">{featuredPost.date}</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-muted)]">{featuredPost.category}</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-faint)]">{featuredPost.readTime}</span>
          </div>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{featuredPost.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">{featuredPost.excerpt}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">{featuredPost.featured}</p>
          <Link href={`/blog/${featuredPost.slug}`} className="button-primary mt-8 inline-flex h-11 items-center justify-center px-6 text-sm font-medium">
            Read article
          </Link>
        </article>

        <div className="surface-grid grid gap-px">
          {secondaryPosts.map((post) => (
            <article key={post.slug} className="surface-cell p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--text-faint)]">{post.date}</span>
                <span className="text-[var(--border-strong)]">&middot;</span>
                <span className="text-[var(--text-muted)]">{post.category}</span>
                <span className="text-[var(--border-strong)]">&middot;</span>
                <span className="text-[var(--text-faint)]">{post.readTime}</span>
              </div>
              <h2 className="mb-3 text-lg font-medium leading-snug">{post.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-medium text-[var(--foreground)]">
                Read article
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="surface-card mt-16 p-10 text-center">
        <h3 className="mb-2 text-xl font-semibold">Stay in the loop</h3>
        <p className="mb-6 text-sm text-[var(--text-soft)]">Get notified about new articles, workflow ideas, and feature updates.</p>
        <div className="flex max-w-sm mx-auto gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="ui-field h-10 flex-1 px-3 text-sm placeholder:text-[var(--text-faint)]"
          />
          <button className="button-primary h-10 px-4 text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
