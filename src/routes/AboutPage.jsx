import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Parallax } from '../components/Parallax.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { IMG } from '../data.js';

export function AboutPage() {
  const { site } = useSiteData();
  const settings = site.settings || {};
  const timeline = site.timeline || [];
  const leadership = site.leadership || [];

  return (
    <main>
      <PageHeader
        num="02"
        eyebrow="Hakkımızda"
        title={settings.aboutTitle?.length ? settings.aboutTitle : ["1987'den bu yana", "aynı disiplinle."]}
        intro={settings.aboutIntro}
      />

      {/* big atmospheric image */}
      <section style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal scale>
            <Parallax src={settings.aboutHeroImg || IMG('1486325212027-8081e485255e', 2000)} height="clamp(320px, 60vh, 640px)" style={{ borderRadius: 18 }}>
              <div style={{
                position: 'absolute',
                left: 'clamp(16px, 3vw, 28px)',
                right: 'clamp(16px, 3vw, 28px)',
                bottom: 'clamp(16px, 3vw, 24px)',
                color: '#fff',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                {settings.aboutHeroCaption || 'Karaköy Loft No.7 / Restorasyon kazısı, 2022'}
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* vision / mission */}
      <section className="section">
        <div className="container">
          <div className="grid-3-wide">
            {[
              { tag: 'Vizyon', t: settings.visionText || 'Yarının şehirlerinde de iz bırakan, kalıcı yapılar inşa etmek.' },
              { tag: 'Misyon', t: settings.missionText || 'Estetik, mühendislik ve zaman disiplinini uzlaşmaz biçimde bir araya getirmek.' },
              { tag: 'Söz',    t: settings.promiseText || '38 yıllık tarihimiz boyunca tek bir teslim tarihi kaçırmadık.' },
            ].map((v, i) => (
              <Reveal key={v.tag} delay={i * 150}>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
                  <div className="eyebrow" style={{ marginBottom: 18 }}>{v.tag}</div>
                  <h3 style={{ fontSize: 'clamp(22px, 2.4vw, 34px)', lineHeight: 1.22 }}>{v.t}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <Timeline timeline={timeline} />

      {/* leadership tease */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 32 }}><span className="num">04</span>Yönetim</div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 68px)', maxWidth: 1080 }}>
              <MaskLines lines={["Ortalama 22 yıllık deneyime", "sahip 12 kişilik bir yönetim."]} />
            </h2>
          </Reveal>
          <div className="grid-4" style={{ marginTop: 56 }}>
            {leadership.map((p, i) => (
              <Reveal key={p.id || p.n} delay={i * 100}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    aspectRatio: '4/5',
                    backgroundImage: `url(${p.img})`,
                    backgroundPosition: 'center 20%',
                    backgroundSize: 'cover',
                    borderRadius: 10,
                    marginBottom: 14,
                    filter: 'grayscale(1) contrast(1.05)',
                  }} />
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>{p.n}</div>
                  <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '0.06em' }}>{p.r}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Timeline({ timeline }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">03</span>Zaman Çizelgesi</div>
        </Reveal>
        <div className="timeline-wrap">
          <div className="timeline-line" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(44px, 6vw, 64px)' }}>
            {timeline.map((e, i) => (
              <Reveal key={e.id || e.year} delay={i * 120}>
                <div className="timeline-row">
                  <div className="timeline-year">{e.year}</div>
                  <div className="timeline-body">
                    <span className="timeline-dot" />
                    <h3 style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', marginBottom: 10 }}>{e.title}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.65, maxWidth: 640 }}>{e.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
