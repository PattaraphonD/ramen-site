import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category')

  if (error) {
    console.error('Error fetching menu:', error)
    return []
  }
  return data as MenuItem[]
}

export default async function MenuPage() {
  const items = await getMenuItems()

  const categories = [...new Set(items.map(item => item.category))]

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
          <Link href="/menu" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Menu</Link>
          <Link href="/blog" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Our Story</Link>
          <Link href="/reservations" style={{
            color: 'var(--color-bg)', background: 'var(--color-primary)',
            padding: '0.4rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 500
          }}>Reserve</Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 3rem' }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem' }}>
          WHAT WE SERVE
        </p>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Menu</h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto' }}>
          Everything made fresh daily. Ask your server about allergens.
        </p>
      </section>

      {/* Menu sections by category */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {categories.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginTop: '4rem' }}>
            Menu coming soon — check back shortly!
          </p>
        ) : (
          categories.map(category => (
            <div key={category} style={{ marginBottom: '3.5rem' }}>

              {/* Category heading */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem' }}>{category}</h2>
                <div style={{ flex: 1, height: '1px', background: 'rgba(200,146,42,0.2)' }} />
              </div>

              {/* Items in this category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {items
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: '2rem',
                      padding: '1.25rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.3rem', fontSize: '1rem' }}>
                          {item.name}
                        </p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                          {item.description}
                        </p>
                      </div>
                      <p style={{
                        color: 'var(--color-primary)', fontWeight: 700,
                        fontSize: '1rem', flexShrink: 0, marginTop: '2px'
                      }}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}

        {/* Reserve CTA */}
        <div style={{
          marginTop: '3rem', padding: '2.5rem',
          background: 'var(--color-surface)',
          borderRadius: '8px', textAlign: 'center',
          border: '1px solid rgba(200,146,42,0.15)'
        }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Ready to visit?</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Book your table online and we'll have everything ready for you.
          </p>
          <Link href="/reservations" style={{
            background: 'var(--color-primary)', color: 'var(--color-bg)',
            padding: '0.85rem 2rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
          }}>
            Reserve a Table
          </Link>
        </div>
      </div>

    </main>
  )
}