import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/content/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found — GenChords",
    };
  }

  return {
    title: `${post.title} — GenChords`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="mb-6 inline-flex text-sm text-[var(--text-muted)]">
          Back to blog
        </Link>

        <div className="surface-card p-7 sm:p-9">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="chip px-3 py-1">{post.category}</span>
            <span className="text-[var(--text-faint)]">{post.date}</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-faint)]">{post.readTime}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl sm:leading-[1.02]">{post.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-soft)]">{post.excerpt}</p>

          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-5 py-5 text-sm leading-relaxed text-[var(--text-soft)]">
            {post.featured}
          </div>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--text-soft)]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}