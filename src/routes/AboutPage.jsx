import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Parallax } from '../components/Parallax.jsx';
import { IMG, TIMELINE } from '../data.js';

export function AboutPage() {
  return (
    <main>
      <PageHeader
        num="02"
        eyebrow="Hakkımızda"
        title={["1987'den bu yana", "aynı disiplinle."]}
        intro="Mehmet Doğan'ın beş kişilik bir mimari ofis olarak Ankara'da kurduğu Chronos, bugün 380 kişilik bir ekibe sahip — ama söz verdiğimiz tarihi tutma disiplinimizi ilk günden bu yana değiştirmedik."
      />

      {/* big atmospheric image */}
      <section style={{ paddingTop: 40 }}>
        <div className="container">
          <Reveal scale>
            <Parallax src={IMG('1486325212027-8081e485255e', 2000)} height="68vh" style={{ borderRadius: 18 }}>
              <div style={{ position: 'absolute', left: 28, bottom: 24, color: '#fff', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Karaköy Loft No.7 / Restorasyon kazısı, 2022
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* vision / mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 60 }}>
            {[
              { tag: 'Vizyon', t: 'Yarının şehirlerinde de iz bırakan, kalıcı yapılar inşa etmek.' },
              { tag: 'Misyon', t: 'Estetik, mühendislik ve zaman disiplinini uzlaşmaz biçimde bir araya getirmek.' },
              { tag: 'Söz', t: '38 yıllık tarihimiz boyunca tek bir teslim tarihi kaçırmadık.' },
            ].map((v, i) => (
              <Reveal key={v.tag} delay={i * 150}>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
                  <div className="eyebrow" style={{ marginBottom: 18 }}>{v.tag}</div>
                  <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 36px)', lineHeight: 1.2 }}>{v.t}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <Timeline />

      {/* leadership tease */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 36 }}><span className="num">04</span>Yönetim</div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.6vw, 72px)', maxWidth: 1100 }}>
              <MaskLines lines={["Ortalama 22 yıllık deneyime", "sahip 12 kişilik bir yönetim."]} />
            </h2>
          </Reveal>
          <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { n: 'Mehmet Doğan',    r: 'Kurucu / Yönetim Kurulu Başkanı' },
              { n: 'Defne Aksu',     r: 'CEO' },
              { n: 'Tolga Yıldırım', r: 'Tasarım Direktörü' },
              { n: 'Selin Erkan',     r: 'Sürdürülebilirlik Direktörü' },
            ].map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ aspectRatio: '4/5', background: `url(${IMG(['1568602471122-7832951cc4c5','1494790108377-be9c29b29330','1500648767791-00dcc994a43e','1573496359142-b8d87734a5a2'][i])}) center/cover`, borderRadius: 10, marginBottom: 14, filter: 'grayscale(1) contrast(1.05)' }} />
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

function Timeline() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 48 }}><span className="num">03</span>Zaman Çizelgesi</div>
        </Reveal>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 'clamp(80px, 12vw, 180px)', top: 0, bottom: 0, width: 1, background: 'var(--line)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {TIMELINE.map((e, i) => (
              <Reveal key={e.year} delay={i * 120}>
                <div style={{ display: 'grid', gridTemplateColumns: 'clamp(80px, 12vw, 180px) 1fr', gap: 'clamp(24px, 5vw, 80px)', alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', paddingRight: 24 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--accent)', letterSpacing: '-0.02em' }}>{e.year}</div>
                  </div>
                  <div style={{ position: 'relative', paddingLeft: 32 }}>
                    <span style={{ position: 'absolute', left: -7, top: 18, width: 14, height: 14, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 6px var(--bg)' }} />
                    <h3 style={{ fontSize: 'clamp(24px, 2.4vw, 32px)', marginBottom: 12 }}>{e.title}</h3>
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
