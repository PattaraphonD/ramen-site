import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type BlogPost = {
  id: number
  title: string
  slug: string
  content: string
  published_at: string
}

async function getPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data as BlogPost[]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

function excerpt(content: string, length = 150) {
  return content.length > length ? content.slice(0, length) + '...' : content
}

export default async function BlogPage() {
  const posts = await getPosts()

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
          富裕 Fuyou Ramen House
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

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 3rem' }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem' }}>
          FROM OUR KITCHEN
        </p>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Story</h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '420px', margin: '0 auto' }}>
          Behind the bowls — stories, updates and the philosophy behind our ramen.
        </p>
      </section>

      {/* Posts */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginTop: '4rem' }}>
            Stories coming soon — check back shortly!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{
                padding: '2rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
            }}>
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                    {formatDate(post.published_at)}
                  </p>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {post.title}
                  </h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {excerpt(post.content)}
                  </p>
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '1rem' }}>
                    Read more →
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}