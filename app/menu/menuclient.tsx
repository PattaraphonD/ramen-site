'use client'

import Link from 'next/link'
import { useState } from 'react'

type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
  badge?: string
}

const CATEGORY_META: Record<string, { emoji: string; tagline: string }> = {
  Ramen: { emoji:'',  tagline: 'Crafted bowls of comfort inspired by the soul of Japanese ramen culture.' },
  Katsu: { emoji:'', tagline: 'Golden-crispy cutlets served with satisfying flavors and timeless Japanese comfort.' },
  Tempura: { emoji:'', tagline: 'Light, delicate, and perfectly crisp — a celebration of traditional Japanese frying artistry.' },
  Sides: { emoji:'', tagline: 'Small plates designed to complete the ramen experience with bold flavor and balance.' },
  Drinks: { emoji:'', tagline: 'Refreshing selections crafted to complement every bowl, bite, and moment.' },
}

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  'Fan Favourite': { bg: 'rgba(200,146,42,0.15)',  color: '#c8922a' },
  'Spicy':         { bg: 'rgba(217,79,61,0.15)',   color: '#d94f3d' },
  'Vegan':         { bg: 'rgba(74,146,104,0.15)',  color: '#4a9268' },
  "Chef's Pick":   { bg: 'rgba(124,111,205,0.15)', color: '#7c6fcd' },
  'New':           { bg: 'rgba(42,143,200,0.15)',  color: '#2a8fc8' },
  'Popular':       { bg: 'rgba(200,146,42,0.15)',  color: '#c8922a' },
}

// Category display order — any category in Supabase not listed here
// will still appear, appended after these in alphabetical order.
const CATEGORY_ORDER = ['Ramen', 'Katsu', 'Tempura', 'Sides', 'Drinks']

export default function MenuClient({ items }: { items: MenuItem[] }) {
  // Build ordered category list from actual data
  const categories = [
    ...CATEGORY_ORDER.filter(c => items.some(i => i.category === c)),
    ...Array.from(new Set(items.map(i => i.category)))
      .filter(c => !CATEGORY_ORDER.includes(c))
      .sort(),
  ]

  const [active, setActive] = useState(categories[0] ?? 'Ramen')
  const activeItems = items.filter(i => i.category === active)
  const isSides = active === 'Sides'
  const meta = CATEGORY_META[active]

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1.25rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,14,12,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(200,146,42,0.15)',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
          富裕 Fuyou Ramen House
        </Link>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <Link href="/menu" style={{ color: 'var(--color-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-primary)', paddingBottom: '2px' }}>Menu</Link>
          <Link href="/blog" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Our Story</Link>
          <Link href="/reservations" style={{ color: 'var(--color-bg)', background: 'var(--color-primary)', padding: '0.4rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>Reserve</Link>
        </div>
      </nav>

      {/* Page header */}
      <section style={{
        paddingTop: '7rem', paddingBottom: '2.5rem', textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(200,146,42,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(200,146,42,0.08)',
      }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.75rem', marginBottom: '1rem' }}>WHAT WE SERVE</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '0.6rem' }}>Our Menu</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
          Everything made fresh daily. Ask your server about allergens.
        </p>
      </section>

      {/* Sticky category tabs */}
      <div style={{
        position: 'sticky', top: '65px', zIndex: 90,
        background: 'rgba(15,14,12,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(200,146,42,0.12)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', display: 'flex' }}>
          {categories.map(cat => {
            const isActive = active === cat
            const catMeta = CATEGORY_META[cat]
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'color 0.18s, border-color 0.18s',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '-1px',
                }}
              >
                {catMeta && <span style={{ fontSize: '1rem' }}>{catMeta.emoji}</span>}
                {cat}
                <span style={{
                  fontSize: '0.72rem',
                  background: isActive ? 'rgba(200,146,42,0.15)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                  padding: '0.1rem 0.45rem', borderRadius: '20px', fontWeight: 500,
                  transition: 'all 0.18s',
                }}>
                  {items.filter(i => i.category === cat).length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 6rem' }}>

        {/* Category heading */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(200,146,42,0.12)',
          marginBottom: '0.25rem',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {meta ? `${meta.emoji} ` : ''}{active}
            </h2>
            {meta && <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{meta.tagline}</p>}
          </div>
          {active === 'Katsu' && (
            <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', fontStyle: 'italic', maxWidth: '200px', textAlign: 'right' }}>
              All katsu served with steamed rice & shredded cabbage
            </p>
          )}
        </div>

        {/* Empty state */}
        {activeItems.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginTop: '4rem' }}>
            Nothing here yet — check back shortly!
          </p>
        )}

        {/* Items — 2-col grid for Sides, full-width rows otherwise */}
        <div style={{
          display: isSides ? 'grid' : 'block',
          gridTemplateColumns: isSides ? 'repeat(auto-fill, minmax(360px, 1fr))' : undefined,
          columnGap: isSides ? '2rem' : undefined,
        }}>
          {activeItems.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '1.25rem',
                padding: '1.4rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                opacity: 0,
                animation: 'fadeUp 0.28s ease forwards',
                animationDelay: `${i * 45}ms`,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.97rem' }}>{item.name}</span>
                  {item.badge && (() => {
                    const s = BADGE_STYLE[item.badge] ?? { bg: 'rgba(200,146,42,0.15)', color: '#c8922a' }
                    return (
                      <span style={{
                        fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.07em',
                        padding: '0.18rem 0.5rem', borderRadius: '20px',
                        background: s.bg, color: s.color,
                      }}>
                        {item.badge.toUpperCase()}
                      </span>
                    )
                  })()}
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                  {item.description}
                </p>
              </div>
              <span style={{
                color: 'var(--color-primary)', fontWeight: 700,
                fontSize: '0.97rem', flexShrink: 0,
                fontFamily: 'var(--font-display)', paddingTop: '2px',
              }}>
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Legend — only show badges that exist in loaded data */}
        {Object.entries(BADGE_STYLE).some(([label]) => items.some(i => i.badge === label)) && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'rgba(200,146,42,0.03)',
            border: '1px solid rgba(200,146,42,0.08)',
            borderRadius: '6px', marginTop: '2rem', marginBottom: '2.5rem',
          }}>
            {Object.entries(BADGE_STYLE)
              .filter(([label]) => items.some(i => i.badge === label))
              .map(([label, s]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '0.77rem', color: 'var(--color-muted)' }}>{label}</span>
                </div>
              ))}
          </div>
        )}

        {/* Reserve CTA */}
        <div style={{
          padding: '2rem 2.5rem', background: 'var(--color-surface)',
          border: '1px solid rgba(200,146,42,0.14)', borderRadius: '8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1.25rem',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>Ready to visit?</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>
              Book your table and we'll have everything ready for you.
            </p>
          </div>
          <Link href="/reservations" style={{
            background: 'var(--color-primary)', color: 'var(--color-bg)',
            padding: '0.8rem 1.75rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.92rem', flexShrink: 0,
          }}>
            Reserve a Table →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  )
}