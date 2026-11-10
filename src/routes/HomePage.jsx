import { useEffect, useRef, useState } from 'react';
import { useRouter } from '../components/Router.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { Reveal, MaskLines, CountUp } from '../components/animations.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { IMG } from '../data.js';

export function HomePage() {
  const { go } = useRouter();
  const { site } = useSiteData();
  const settings = site.settings || {};
  const heroSlides = site.heroSlides?.length ? site.heroSlides : [{ img: IMG('1487958449943-2429e8be8625', 2000), label: 'Maslak 1453 / 2024' }];
  const projects = site.projects || [];
  const stats = site.stats || [];
  const values = site.values || [];
  const testimonials = site.testimonials || [];

  /* hero slideshow cross-fade */
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5200);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  const safeSlide = slide % heroSlides.length;

  /* subtle background image parallax — clamped so it never shifts out of bounds */
  const heroRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const img = heroRef.current.querySelector('.hero-image-wrap');
      if (!img) return;
      const maxOffset = heroRef.current.offsetHeight * 0.08;
      const offset = Math.min(maxOffset, Math.max(0, window.scrollY * 0.14));
      img.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div className="hero-image-wrap">
          {heroSlides.map((s, i) => (
            <div
              key={s.id || i}
              className={`hero-img ${i === safeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.img})` }}
            />
          ))}
        </div>

        {/* hero content */}
        <div className="container" style={{
          position: 'relative', zIndex: 2,
          paddingTop: 'clamp(116px, 16vh, 180px)',
          paddingBottom: 'clamp(88px, 12vh, 120px)',
          flex: 1, display: 'flex', flexDirection: 'column', gap: 28,
        }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span className="num">01</span>{settings.heroEyebrow || 'EST. 1987 / İSTANBUL — ANKARA — İZMİR'}
          </div>

          <div>
            <h1 className="display" style={{ fontSize: 'clamp(44px, 8.8vw, 140px)', color: '#fff' }}>
              <MaskLines lines={settings.heroTitle?.length ? settings.heroTitle : ["Zamana", "dayanan", "yapılar."]} step={180} />
            </h1>
          </div>

          <Reveal delay={900} style={{ maxWidth: 480, marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(15.5px, 1.5vw, 17px)', lineHeight: 1.65 }}>
              {settings.heroDesc}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => go('/projeler')}>
                Projeleri gör
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn" onClick={() => go('/iletisim')} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                Bizimle çalışın
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* hero footer strip — current project marker + scroll hint */}
        <div className="hero-strip">
          <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span style={{ width: 24, height: 1, background: 'var(--accent)', flexShrink: 0 }}></span>
            <span>
              {String(safeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')} —{' '}
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>{heroSlides[safeSlide]?.label}</span>
            </span>
          </span>
          <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {heroSlides.map((_, i) => (
              <button key={i}
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setSlide(i)}
                style={{
                  width: i === safeSlide ? 28 : 18, height: 2, border: 0, padding: 0,
                  background: i === safeSlide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'width .4s, background .4s',
                }} />
            ))}
          </span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderBottom: '1px solid var(--line)', borderTop: '1px solid var(--line)', padding: '26px 0', background: 'var(--bg-soft)' }}>
        <div className="marquee">
          <div className="marquee-track">
            {[...projects, ...projects].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.8vw, 46px)', color: 'var(--text)' }}>
                <span>{p.name}</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.16em' }}>{p.year}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INTRO STORY ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 24 }}><span className="num">02</span>Felsefemiz</div>
          </Reveal>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 84px)', marginBottom: 56, maxWidth: 1100 }}>
            <MaskLines lines={settings.philosophyTitle?.length ? settings.philosophyTitle : ["İnşaat;", "zamana, malzemeye ve", "insana verilen sözdür."]} step={120} />
          </h2>
          <div className="grid-4">
            {values.map((v, i) => (
              <Reveal key={v.id || v.num} delay={i * 120}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                  <span className="label-mono" style={{ color: 'var(--accent)' }}>{v.num}</span>
                  <h3 style={{ fontSize: 22, lineHeight: 1.2 }}>{v.title}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.6 }}>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container"><hr className="section-divider" /></div>

      {/* ── FEATURED PROJECTS ── */}
      <FeaturedProjects projects={projects} />

      {/* ── STATS ── */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">04</span>Sayılarla Chronos</div>
          </Reveal>
          <div className="grid-4" style={{ alignItems: 'start' }}>
            {stats.map((s, i) => (
              <Reveal key={s.id || i} delay={i * 120}>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                  <CountUp to={s.num} decimals={s.decimals || 0} suffix={s.suffix} />
                  <div style={{ marginTop: 14, color: 'var(--text-dim)', fontSize: 14, letterSpacing: '0.02em' }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && <TestimonialsSlider testimonials={testimonials} />}

      {/* ── BIG CTA ── */}
      <CtaBlock ctaTitle={settings.ctaTitle} />
    </main>
  );
}

function FeaturedProjects({ projects }) {
  const { go } = useRouter();
  const featured = projects.filter((p) => p.featured).length > 0
    ? projects.filter((p) => p.featured).slice(0, 6)
    : projects.slice(0, 6);

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap', marginBottom: 48 }}>
          <Reveal>
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}><span className="num">03</span>Öne çıkan projeler</div>
              <h2 className="display" style={{ fontSize: 'clamp(34px, 5vw, 78px)' }}>
                <MaskLines lines={["İz bırakan", "yapılar."]} />
              </h2>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <button className="btn" onClick={() => go('/projeler')}>
              Tüm projeler
              <span className="btn-arrow">→</span>
            </button>
          </Reveal>
        </div>

        <div className="projects-grid">
          {featured.map((p, i) => {
            const isLarge = i === 0 || (featured.length >= 6 && i === 5);
            return (
              <Reveal key={p.id} delay={i * 80} className={isLarge ? 'proj-span-full' : ''}>
                <ProjectCard p={p} large={isLarge} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSlider({ testimonials }) {
  const [idx, setIdx] = useState(0);
  const safeIdx = idx % testimonials.length;
  const t = testimonials[safeIdx];
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">05</span>Müşterilerimizden</div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 36 }}>
          <div key={safeIdx} style={{ animation: 'fadeQuote .7s var(--ease-out)' }}>
            <blockquote className="display" style={{ fontSize: 'clamp(24px, 3.8vw, 52px)', lineHeight: 1.2, margin: 0, maxWidth: 1080 }}>
              {t.quote}
            </blockquote>
            <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 54, height: 54, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--accent)', flexShrink: 0,
              }}>
                {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '0.06em', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {testimonials.map((_, i) => (
                <button key={i} aria-label={`Yorum ${i + 1}`}
                  onClick={() => setIdx(i)}
                  style={{
                    width: i === safeIdx ? 36 : 16, height: 2, padding: 0, border: 0,
                    background: i === safeIdx ? 'var(--accent)' : 'var(--line)', cursor: 'pointer',
                    transition: 'width .4s, background .4s',
                  }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="nav-arrow" onClick={() => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)} aria-label="Önceki">←</button>
              <button className="nav-arrow" onClick={() => setIdx(i => (i + 1) % testimonials.length)} aria-label="Sonraki">→</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeQuote { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </section>
  );
}

function CtaBlock({ ctaTitle }) {
  const { go } = useRouter();
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <Reveal scale>
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 18,
            padding: 'clamp(40px, 7.5vw, 110px) clamp(24px, 5.5vw, 92px)',
            background: `linear-gradient(180deg, rgba(14,16,19,0.45), rgba(14,16,19,0.85)), url(${IMG('1503387762-592deb58ef4e', 1600)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.68)', marginBottom: 24 }}>
              <span className="num" style={{ color: 'var(--accent)' }}>06</span>Birlikte inşa edelim
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(34px, 6vw, 108px)', color: '#fff', maxWidth: 1100 }}>
              <MaskLines lines={ctaTitle?.length ? ctaTitle : ["Bir sonraki", "kalıcı yapı,", "sizinki olsun."]} />
            </h2>
            <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => go('/iletisim')}>Görüşme planla<span className="btn-arrow">→</span></button>
              <button className="btn" onClick={() => go('/hizmetler')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Hizmetlerimiz<span className="btn-arrow">→</span></button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
