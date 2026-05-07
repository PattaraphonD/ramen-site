import Link from 'next/link'

export default function HomePage() {
  return (
    <main>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1.25rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,14,12,0.85)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(200,146,42,0.15)'
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-primary)' }}>
          麺 Ramen House
        </span>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <Link href="/menu" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Menu</Link>
          <Link href="/blog" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Our Story</Link>
          <Link href="/reservations" style={{
            color: 'var(--color-bg)', background: 'var(--color-primary)',
            padding: '0.4rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 500
          }}>Reserve</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '2rem',
        background: `linear-gradient(rgba(15,14,12,0.6) 0%, rgba(15,14,12,0.85) 100%),
                     url('https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1600') center/cover`
      }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          AUTHENTIC JAPANESE RAMEN
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          A Bowl Full<br />of Soul
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '480px', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          Slow-simmered broths, hand-pulled noodles, and flavours
          passed down through three generations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/reservations" style={{
            background: 'var(--color-primary)', color: 'var(--color-bg)',
            padding: '0.85rem 2rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
          }}>
            Reserve a Table
          </Link>
          <Link href="/menu" style={{
            border: '1px solid var(--color-primary)', color: 'var(--color-primary)',
            padding: '0.85rem 2rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
          }}>
            View Menu
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: '6rem 2rem', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem' }}>
          OUR STORY
        </p>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>
          Born from a lifetime of ramen
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: 1.9 }}>
          What started as a family recipe in a tiny kitchen in Fukuoka
          has grown into a restaurant devoted to one thing — the perfect bowl.
          Every broth is simmered for 18 hours. Every noodle is made fresh daily.
          We don't cut corners because you deserve the real thing.
        </p>
      </section>

      {/* Featured dishes */}
      <section style={{ padding: '4rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
          SIGNATURE BOWLS
        </p>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '3rem', textAlign: 'center' }}>
          Where to start
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Tonkotsu Classic', price: '$14', desc: 'Rich pork bone broth, chashu pork, soft egg, bamboo shoots', img: '12827295802_c4df588c-c0d9-437c-b492-cc23ea32582f_900x_tf1o9x' },
            { name: 'Spicy Miso', price: '$15', desc: 'Fermented miso base, chilli oil, corn, ground pork, spring onion', img: 'R02843-Spicy-Miso-Ramen-619x412_wperaf' },
            { name: 'Shio Tori', price: '$13', desc: 'Clear chicken broth, delicate salt seasoning, yuzu zest, nori', img: 'shiotori_pavy5g' },
          ].map((dish) => (
            <div key={dish.name} style={{
              background: 'var(--color-surface)',
              borderRadius: '8px', overflow: 'hidden',
              border: '1px solid rgba(200,146,42,0.1)'
            }}>
              <img
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_600,h_200,c_fill/${dish.img}`}
                alt={dish.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{dish.name}</h3>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{dish.price}</span>
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{dish.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/menu" style={{
            border: '1px solid var(--color-primary)', color: 'var(--color-primary)',
            padding: '0.85rem 2rem', borderRadius: '4px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
          }}>
            See Full Menu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(200,146,42,0.15)',
        padding: '3rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>麺 Ramen House</p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Authentic Japanese ramen,<br />made with love and patience.</p>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Hours</p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Mon–Fri: 11am – 10pm<br />Sat–Sun: 10am – 11pm</p>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Find us</p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>123 Noodle Street<br />Your City, 00000</p>
        </div>
      </footer>

    </main>
  )
}