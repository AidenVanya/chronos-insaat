import { useEffect, useRef, useState } from 'react';
import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Icon } from '../components/Icon.jsx';
import { useSiteData } from '../context/SiteContext.jsx';

export function SustainPage() {
  const { site } = useSiteData();
  const techFeatures = site.techFeatures || [];
  const materials = site.materials || [];

  return (
    <main>
      <PageHeader num="05" eyebrow="Sürdürülebilirlik & Teknoloji"
        title={["Yarının binası,", "bugünün taahhüdü."]}
        intro="Yapı sektörü küresel emisyonların %38'inden sorumlu. Bunu sözle değil, mühendislikle değiştiriyoruz: düşük karbonlu beton, NZEB hedefli enerji, BIM 7D dijital ikiz."
      />

      {/* Hero KPI strip */}
      <section style={{ padding: '24px 0 80px' }}>
        <div className="container">
          <div className="bordered-grid-4">
            {techFeatures.map((f, i) => (
              <Reveal key={f.id || f.title} delay={i * 120}>
                <div className="bordered-cell">
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 4.2vw, 60px)', color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: 20 }}>{f.kpi}</div>
                  <h3 style={{ fontSize: 22, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14.5, lineHeight: 1.6 }}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Carbon diagram */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="split-grid align-center">
            <div>
              <Reveal>
                <div className="eyebrow" style={{ marginBottom: 24 }}><span className="num">02</span>Karbon Şeması</div>
              </Reveal>
              <Reveal delay={150}>
                <h2 className="display" style={{ fontSize: 'clamp(32px, 4.6vw, 64px)', marginBottom: 28 }}>
                  <MaskLines lines={["Bir binanın ömrü", "boyunca üç karbon."]} />
                </h2>
              </Reveal>
              <Reveal delay={400}>
                <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.7, maxWidth: 520 }}>
                  Yerleşik (gömülü), operasyonel ve teslim sonrası karbon. Üçünü birden ölçüyor, her birini ayrı ayrı azaltıyoruz. 2024'ten itibaren tüm projelerimiz LCA (yaşam döngüsü analizi) ile başlatılıyor.
                </p>
              </Reveal>
            </div>
            <Reveal delay={300}>
              <CarbonDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Materials grid */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 32 }}><span className="num">03</span>Malzeme Disiplini</div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 60px)', marginBottom: 56, maxWidth: 1100 }}>
              <MaskLines lines={["Sürdürülebilirlik bir etiket değil,", "tedarik zincirinin tamamı."]} />
            </h2>
          </Reveal>
          <div className="grid-4">
            {materials.map((m, i) => (
              <Reveal key={m.id || m.t} delay={i * 100} style={{ height: '100%' }}>
                <article className="surface" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div className="ico" style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                      <Icon name={m.ico} size={22} />
                    </div>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 38, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 0.9 }}>{m.pct}%</span>
                  </div>
                  <h4 style={{ fontSize: 19 }}>{m.t}</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 4 }}>{m.s}</p>
                  <div style={{ marginTop: 'auto', height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${m.pct}%`, borderRadius: 2 }} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech narrative */}
      <section className="section">
        <div className="container">
          <div className="sidebar-grid">
            <Reveal>
              <div className="eyebrow"><span className="num">04</span>Teknoloji</div>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 68px)', marginBottom: 36 }}>
                  <MaskLines lines={["Dijital ikiz, sahanın", "ofise verdiği gerçek cevap."]} />
                </h2>
              </Reveal>
              <Reveal delay={300}>
                <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(15.5px, 1.5vw, 17px)', lineHeight: 1.7, maxWidth: 720, marginBottom: 36 }}>
                  Tasarım sırasında ürettiğimiz BIM modeli, şantiyede sensör verisiyle senkron çalışan bir "ikiz"e dönüşüyor. Teslimden sonra da binanın işletme ömrü boyunca yaşayan bu modeli, bakım ve enerji optimizasyonu için yatırımcıya devrediyoruz.
                </p>
              </Reveal>
              <Reveal delay={500}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--line)' }}>
                  {[
                    'LOD-400 BIM modelleri — tüm disiplinler tek dosyada',
                    'Saha sensörleri — beton mukavemeti, ısıl köprüler, ses ve toz',
                    'Drone fotogrametri ile haftalık ilerleme raporlaması',
                    'Müşteri portalı — gerçek zamanlı bütçe, ilerleme ve fotoğraf akışı',
                  ].map((t, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}>
                        <Icon name="check" size={18} />
                      </span>
                      <span style={{ fontSize: 16, lineHeight: 1.5 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CarbonDiagram() {
  const segments = [
    { label: 'Yerleşik karbon', value: 52, color: 'var(--accent)' },
    { label: 'Operasyonel',     value: 36, color: '#7a8794' },
    { label: 'Teslim sonrası',  value: 12, color: '#3a4250' },
  ];
  const total = segments.reduce((a, s) => a + s.value, 0);
  const radius = 130; const stroke = 28;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const reveal = () => { if (!done) { done = true; setVisible(true); } };
    const fallback = setTimeout(reveal, 700);
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { reveal(); io.unobserve(el); } });
      }, { threshold: 0.3 });
      io.observe(el);
      return () => { io.disconnect(); clearTimeout(fallback); };
    }
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div ref={ref} style={{ maxWidth: 420, margin: '0 auto', width: '100%' }}>
      <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%' }}>
        <svg viewBox="-150 -150 300 300" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx="0" cy="0" r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
          {segments.map((s, i) => {
            const length = (s.value / total) * circumference;
            const dash = visible ? `${length} ${circumference}` : `0 ${circumference}`;
            const el = (
              <circle key={s.label} cx="0" cy="0" r={radius} fill="none"
                      stroke={s.color} strokeWidth={stroke}
                      strokeDasharray={dash}
                      strokeDashoffset={-offset}
                      style={{ transition: `stroke-dasharray 1.4s var(--ease-out) ${i * 0.18}s` }} />
            );
            offset += length;
            return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="label-mono" style={{ marginBottom: 6 }}>Toplam azaltım</div>
            <div className="display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: 'var(--accent)' }}>−42<span style={{ fontSize: '0.5em' }}>%</span></div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: '12px 20px', flexWrap: 'wrap' }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, background: s.color, flexShrink: 0, borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{s.label} · {s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
