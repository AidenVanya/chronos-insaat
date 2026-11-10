import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Icon } from '../components/Icon.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { useRouter } from '../components/Router.jsx';

export function ServicesPage() {
  const { go } = useRouter();
  const { site } = useSiteData();
  const services = site.services || [];
  const processSteps = site.processSteps || [];

  return (
    <main>
      <PageHeader num="04" eyebrow="Hizmetler"
        title={["Konseptten anahtara,", "tek bir ekiple."]}
        intro="Mimari tasarımdan teslim sonrası bakıma kadar tüm değer zincirini kendi bünyemizde tutuyoruz — bu, sorumluluğun bölünmediği anlamına geliyor."
      />

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid-3">
            {services.map((s, i) => (
              <Reveal key={s.id || s.num} delay={i * 80} style={{ height: '100%' }}>
                <article
                  className="svc-card surface"
                  onClick={() => go('/iletisim')}
                  style={{
                    padding: 'clamp(26px, 3vw, 36px)', height: '100%', display: 'flex', flexDirection: 'column', gap: 22,
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
                  <h3 style={{ fontSize: 'clamp(23px, 2.2vw, 28px)', lineHeight: 1.18, marginTop: 8 }}>{s.name}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 4 }}>{s.desc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
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
            <div className="eyebrow" style={{ marginBottom: 40 }}><span className="num">02</span>Sürecimiz</div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.2vw, 64px)', marginBottom: 56 }}>
              <MaskLines lines={["Beş adım,", "tek bir söz."]} />
            </h2>
          </Reveal>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <Reveal key={step.id || step.n} delay={i * 80}>
                <div className="bordered-cell" style={{ gap: 18 }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(42px, 4.5vw, 56px)', color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>{step.n}</span>
                  <h4 style={{ fontSize: 21 }}>{step.t}</h4>
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
