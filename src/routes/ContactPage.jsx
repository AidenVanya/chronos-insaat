import { useState } from 'react';
import { Reveal } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Icon } from '../components/Icon.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { apiRequest } from '../services/apiClient.js';

export function ContactPage() {
  const { site } = useSiteData();
  const settings = site.settings || {};
  const offices = site.offices || [];

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', website_hp: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = 'Adınızı yazın';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Geçerli bir e-posta girin';
    if (!form.message) errs.message = 'Mesaj alanı boş';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await apiRequest('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setSent(true);
  };

  return (
    <main>
      <PageHeader num="07" eyebrow="İletişim"
        title={["Konuşalım."]}
        intro="Yatırımcı, mimar, paydaş, gazeteci — kim olursanız olun, bir Chronos çalışanı 48 saat içinde size geri döner."
      />

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="split-grid">
            {/* contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                { ico: 'map',   t: 'Genel Merkez', l1: settings.addressLine1 || 'Büyükdere Cd. No:209',      l2: settings.addressLine2 || 'Levent / İstanbul 34394' },
                { ico: 'phone', t: 'Telefon',      l1: settings.phone || '+90 212 999 14 87',                 l2: settings.workHours || 'Hafta içi 09:00 — 18:30' },
                { ico: 'mail',  t: 'E-posta',      l1: settings.email || 'info@chronosinsaat.com.tr',         l2: settings.pressEmail || 'basin@chronosinsaat.com.tr' },
              ].map((c, i) => (
                <Reveal key={c.t} delay={i * 100}>
                  <div style={{ display: 'flex', gap: 18, paddingBottom: 26, borderBottom: '1px solid var(--line)', minWidth: 0 }}>
                    <div className="ico" style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                      <Icon name={c.ico} size={22} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="label-mono" style={{ marginBottom: 8 }}>{c.t}</div>
                      <div style={{ fontSize: 'clamp(16px, 1.8vw, 18px)', marginBottom: 4, overflowWrap: 'anywhere' }}>{c.l1}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: 14, overflowWrap: 'anywhere' }}>{c.l2}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={400}>
                <div style={{ paddingTop: 8 }}>
                  <div className="label-mono" style={{ marginBottom: 14 }}>Diğer ofisler</div>
                  <div className="offices-grid">
                    {offices.map(o => (
                      <div key={o.id || o.c}>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{o.c}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{o.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* form */}
            <Reveal delay={200}>
              {sent ? (
                <div className="surface" style={{ padding: 'clamp(36px, 5vw, 56px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', color: 'var(--accent-ink)' }}>
                    <Icon name="check" size={26} />
                  </div>
                  <h3 style={{ fontSize: 32 }}>Mesajınız iletildi.</h3>
                  <p style={{ color: 'var(--text-dim)', maxWidth: 420 }}>Mesajınız yönetim paneline kaydedildi. 48 saat içinde size geri dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="surface form-grid" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
                  {/* Honeypot anti-bot field */}
                  <input
                    type="text"
                    name="website_hp"
                    value={form.website_hp}
                    onChange={(e) => set('website_hp', e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <div className={`field ${errors.name ? 'error' : ''}`}>
                    <label>Ad Soyad</label>
                    <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className={`field ${errors.email ? 'error' : ''}`}>
                    <label>E-posta</label>
                    <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="field">
                    <label>Telefon</label>
                    <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Konu</label>
                    <select className="select input" value={form.subject} onChange={e => set('subject', e.target.value)}>
                      <option value="" style={{ background: 'var(--surface)' }}>Seçiniz</option>
                      <option style={{ background: 'var(--surface)' }}>Yeni proje görüşmesi</option>
                      <option style={{ background: 'var(--surface)' }}>Yatırım fırsatı</option>
                      <option style={{ background: 'var(--surface)' }}>Tedarikçi başvurusu</option>
                      <option style={{ background: 'var(--surface)' }}>Basın & medya</option>
                      <option style={{ background: 'var(--surface)' }}>Diğer</option>
                    </select>
                  </div>
                  <div className={`field field-full ${errors.message ? 'error' : ''}`}>
                    <label>Mesajınız</label>
                    <textarea className="textarea" rows={6} value={form.message} onChange={e => set('message', e.target.value)} />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>
                  <div className="field-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <span className="label-mono" style={{ color: 'var(--text-faint)' }}>KVKK kapsamında saklanır</span>
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                      {submitting ? 'Gönderiliyor...' : 'Mesajı gönder'}
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dark map */}
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <Reveal scale>
            <DarkMap coordinates={settings.coordinates} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function DarkMap({ coordinates }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid var(--line)',
      background: 'var(--bg-soft)', height: 'clamp(320px, 48vw, 520px)',
    }}>
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          transform: `scale(${zoom})`,
          transformOrigin: '29% 41%',
          transition: 'transform .45s var(--ease-out)',
        }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line-soft)" strokeWidth="1" />
          </pattern>
          <linearGradient id="water" x1="0" x2="1">
            <stop offset="0" stopColor="var(--bg)" />
            <stop offset="1" stopColor="var(--bg-soft)" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="var(--surface)" />
        <rect width="800" height="500" fill="url(#grid)" />
        {/* Bosphorus water */}
        <path d="M380,0 C370,80 430,140 410,220 C390,300 460,360 430,430 C420,460 410,490 415,500 L500,500 L500,0 Z" fill="url(#water)" opacity="0.7" />
        {/* roads */}
        {[
          'M0,140 Q200,160 360,150 T800,200',
          'M0,260 Q220,240 380,280 T800,300',
          'M0,380 Q200,360 360,400 T800,360',
          'M120,0 Q140,200 130,500',
          'M620,0 Q650,180 640,500',
        ].map((d, i) => (
          <path key={i} d={d} stroke="var(--line)" strokeWidth="1.5" fill="none" opacity="0.55" />
        ))}
        {/* district names */}
        {[
          { x: 180, y: 100, t: 'MASLAK' },
          { x: 230, y: 245, t: 'LEVENT' },
          { x: 260, y: 320, t: 'BEŞİKTAŞ' },
          { x: 620, y: 240, t: 'ÜSKÜDAR' },
          { x: 660, y: 360, t: 'KADIKÖY' },
        ].map((d, i) => (
          <text key={i} x={d.x} y={d.y} fill="var(--text-faint)" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2">{d.t}</text>
        ))}
        {/* Chronos HQ marker */}
        <g transform="translate(232,205)">
          <circle r="36" fill="var(--accent)" opacity="0.12" />
          <circle r="22" fill="var(--accent)" opacity="0.22" style={{ animation: 'pulse2 2.4s ease-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
          <circle r="8"  fill="var(--accent)" />
          <text x="14" y="4" fill="var(--accent)" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="500">CHRONOS HQ</text>
        </g>
      </svg>

      <div style={{
        position: 'absolute', left: 'clamp(14px, 2.5vw, 24px)', top: 'clamp(14px, 2.5vw, 24px)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        padding: '8px 14px', borderRadius: 100, border: '1px solid var(--line)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
        <span className="label-mono" style={{ color: 'var(--text)' }}>{coordinates || '41.0789°N · 29.0124°E'}</span>
      </div>
      <div style={{ position: 'absolute', right: 'clamp(14px, 2.5vw, 24px)', bottom: 'clamp(14px, 2.5vw, 24px)', display: 'flex', gap: 8 }}>
        <button type="button" className="nav-arrow" onClick={() => setZoom(z => Math.min(1.8, +(z + 0.25).toFixed(2)))} aria-label="Yakınlaştır">+</button>
        <button type="button" className="nav-arrow" onClick={() => setZoom(z => Math.max(1, +(z - 0.25).toFixed(2)))} aria-label="Uzaklaştır">−</button>
      </div>
      <style>{`@keyframes pulse2 { 0%{transform:scale(0.8);opacity:.5} 100%{transform:scale(2.2);opacity:0} }`}</style>
    </div>
  );
}
