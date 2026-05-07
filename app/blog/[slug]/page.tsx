import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type BlogPost = {
  id: number
  title: string
  slug: string
  content: string
  published_at: string
}

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data as BlogPost
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1.25rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,14,12,0.85)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(200,146,42,0.15)'
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
          麺 Ramen House
        </Link>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <Link href="/menu" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Menu</Link>
          <Link href="/blog" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Our Story</Link>
          <Link href="/reservations" style={{
            color: 'var(--color-bg)', background: 'var(--color-primary)',
            padding: '0.4rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 500
          }}>Reserve</Link>
        </div>
      </nav>

      {/* Post content */}
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        <Link href="/blog" style={{
          color: 'var(--color-muted)', fontSize: '0.85rem',
          textDecoration: 'none', display: 'inline-block', marginBottom: '2.5rem'
        }}>
          ← Back to all stories
        </Link>

        <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          {formatDate(post.published_at)}
        </p>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.2, marginBottom: '2.5rem' }}>
          {post.title}
        </h1>

        <div style={{
          color: 'var(--color-muted)', fontSize: '1.05rem',
          lineHeight: 1.9, whiteSpace: 'pre-wrap'
        }}>
          {post.content}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '4rem', paddingTop: '2.5rem',
          borderTop: '1px solid rgba(200,146,42,0.15)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
            Come experience it for yourself.
          </p>
          <Link href="/reservations" style={{
            background: 'var(--color-primary)', color: 'var(--color-bg)',
            padding: '0.85rem 2rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
          }}>
            Reserve a Table
          </Link>
        </div>

      </article>

    </main>
  )
}