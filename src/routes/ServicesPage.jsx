import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Icon } from '../components/Icon.jsx';
import { SERVICES } from '../data.js';

export function ServicesPage() {
  return (
    <main>
      <PageHeader num="04" eyebrow="Hizmetler"
        title={["Konseptten anahtara,", "tek bir ekiple."]}
        intro="Mimari tasarımdan teslim sonrası bakıma kadar tüm değer zincirini kendi bünyemizde tutuyoruz — bu, sorumluluğun bölünmediği anlamına geliyor."
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.num} delay={i * 80}>
                <article className="svc-card surface" style={{
                  padding: 36, height: '100%', display: 'flex', flexDirection: 'column', gap: 24,
                  position: 'relative', overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform .5s var(--ease-out), border-color .5s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="ico"><Icon name={s.icon} size={24} /></div>
                    <span className="label-mono" style={{ color: 'var(--text-faint)' }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontSize: 28, lineHeight: 1.15, marginTop: 'auto' }}>{s.name}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.6 }}>{s.desc}</p>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    Detay <Icon name="arrow" size={14} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">02</span>Sürecimiz</div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.2vw, 64px)', marginBottom: 64 }}>
              <MaskLines lines={["Beş adım,", "tek bir söz."]} />
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 0, borderTop: '1px solid var(--line)' }}>
            {[
              { n: '01', t: 'Keşif', d: 'Yatırımcı ile bir araya gelir, ihtiyacı, parsel kısıtlarını ve hedefleri tanımlarız.' },
              { n: '02', t: 'Konsept', d: 'Üç farklı mimari konsept ve ön maliyet senaryosu hazırlarız.' },
              { n: '03', t: 'Uygulama Projesi', d: 'BIM ortamında tüm disiplinlerle koordineli bir LOD-400 model üretiriz.' },
              { n: '04', t: 'İnşaat', d: 'Dijital ikiz destekli saha — haftalık raporlama ve canlı izleme.' },
              { n: '05', t: 'Teslim & Bakım', d: '10 yıllık yapısal garanti, 2 yıllık tüm sistem bakımı.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div style={{
                  borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
                  padding: '36px 28px', height: '100%',
                  display: 'flex', flexDirection: 'column', gap: 18,
                }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 56, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 0.9 }}>{step.n}</span>
                  <h4 style={{ fontSize: 22 }}>{step.t}</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>{step.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
