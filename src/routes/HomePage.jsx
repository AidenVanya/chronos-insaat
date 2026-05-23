import { useEffect, useRef, useState } from 'react';
import { useRouter } from '../components/Router.jsx';
import { Reveal, MaskLines, CountUp } from '../components/animations.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { HERO_SLIDES, PROJECTS, STATS, TESTIMONIALS, VALUES, IMG } from '../data.js';

export function HomePage() {
  const { go } = useRouter();

  /* hero slideshow cross-fade */
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(id);
  }, []);

  /* hero scroll parallax — title moves slower than image */
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (titleRef.current) {
        titleRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      }
      if (heroRef.current) {
        const img = heroRef.current.querySelector('.hero-image-wrap');
        if (img) img.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
      }
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
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className={`hero-img ${i === slide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.img})` }}
            />
          ))}
        </div>

        {/* hero content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 'clamp(140px, 22vh, 220px)', paddingBottom: 80, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow" style={{ marginBottom: 36, color: 'rgba(255,255,255,0.7)' }}>
            <span className="num">01</span>EST. 1987 / İSTANBUL — ANKARA — İZMİR
          </div>

          <div ref={titleRef}>
            <h1 className="display" style={{ fontSize: 'clamp(56px, 11vw, 184px)', color: '#fff' }}>
              <MaskLines lines={["Zamana", "dayanan", "yapılar."]} step={180} />
            </h1>
          </div>

          <Reveal delay={1000} style={{ maxWidth: 460, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16.5, lineHeight: 1.65 }}>
              Konut, ticari ve kentsel dönüşümde 38 yıllık disiplin. İstanbul başta olmak üzere 16 şehirde 142 proje teslim ettik — söz verdiğimiz tarihte, söz verdiğimiz kalitede.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => go('/projeler')}>
                Projeleri gör
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn" onClick={() => go('/iletisim')} style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                Bizimle çalışın
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* hero footer strip — current project marker + scroll hint */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.15)',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)',
          padding: '18px var(--gutter)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, color: '#fff',
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: 'var(--accent)' }}></span>
            {String(slide + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')} —&nbsp;
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>{HERO_SLIDES[slide].label}</span>
          </span>
          <span style={{ display: 'flex', gap: 8 }}>
            {HERO_SLIDES.map((_, i) => (
              <button key={i}
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? 28 : 18, height: 2, border: 0, padding: 0,
                  background: i === slide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'width .4s, background .4s',
                }} />
            ))}
          </span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderBottom: '1px solid var(--line)', borderTop: '1px solid var(--line)', padding: '28px 0', background: 'var(--bg-soft)' }}>
        <div className="marquee">
          <div className="marquee-track">
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--text)' }}>
                <span>{p.name}</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.16em' }}>{p.year}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INTRO STORY ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 28 }}><span className="num">02</span>Felsefemiz</div>
          </Reveal>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 5.2vw, 88px)', marginBottom: 56, maxWidth: 1100 }}>
            <MaskLines lines={["İnşaat;", "zamana, malzemeye ve", "insana verilen sözdür."]} step={120} />
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 36 }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.num} delay={i * 120}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
      <FeaturedProjects />

      {/* ── STATS ── */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">04</span>Sayılarla Chronos</div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, alignItems: 'end' }}>
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                  <CountUp to={s.num} decimals={s.decimals || 0} suffix={s.suffix} />
                  <div style={{ marginTop: 16, color: 'var(--text-dim)', fontSize: 14, letterSpacing: 0.2 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSlider />

      {/* ── BIG CTA ── */}
      <CtaBlock />
    </main>
  );
}

function FeaturedProjects() {
  const { go } = useRouter();
  const featured = PROJECTS.slice(0, 6);
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap', marginBottom: 56 }}>
          <Reveal>
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}><span className="num">03</span>Öne çıkan projeler</div>
              <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 80px)' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 24 }}>
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProjectCard p={p} large={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSlider() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 56 }}><span className="num">05</span>Müşterilerimizden</div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40 }}>
          <div key={idx} style={{ animation: 'fadeQuote .7s var(--ease-out)' }}>
            <blockquote className="display" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.15, margin: 0, maxWidth: 1100 }}>
              {t.quote}
            </blockquote>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--accent)' }}>
                {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>{t.role}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} aria-label={`Yorum ${i + 1}`}
                  onClick={() => setIdx(i)}
                  style={{
                    width: i === idx ? 36 : 16, height: 2, padding: 0, border: 0,
                    background: i === idx ? 'var(--accent)' : 'var(--line)', cursor: 'pointer',
                    transition: 'width .4s, background .4s',
                  }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="nav-arrow" onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Önceki">←</button>
              <button className="nav-arrow" onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)} aria-label="Sonraki">→</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeQuote { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .nav-arrow { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--text); cursor: pointer; transition: background .3s, color .3s, border-color .3s; }
        .nav-arrow:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
      `}</style>
    </section>
  );
}

function CtaBlock() {
  const { go } = useRouter();
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <Reveal scale>
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 18,
            padding: 'clamp(48px, 8vw, 120px) clamp(32px, 6vw, 100px)',
            background: `linear-gradient(180deg, rgba(14,16,19,0.4), rgba(14,16,19,0.8)), url(${IMG('1503387762-592deb58ef4e', 1600)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>
              <span className="num" style={{ color: 'var(--accent)' }}>06</span>Birlikte inşa edelim
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 6.5vw, 120px)', color: '#fff', maxWidth: 1200 }}>
              <MaskLines lines={["Bir sonraki", "kalıcı yapı,", "sizinki olsun."]} />
            </h2>
            <div style={{ marginTop: 48, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => go('/iletisim')}>Görüşme planla<span className="btn-arrow">→</span></button>
              <button className="btn" onClick={() => go('/hizmetler')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Hizmetlerimiz<span className="btn-arrow">→</span></button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
