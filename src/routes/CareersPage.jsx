import { useEffect, useMemo, useState } from 'react';
import { Reveal, MaskLines } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Icon } from '../components/Icon.jsx';
import { POSITIONS } from '../data.js';

export function CareersPage() {
  const [teamFilter, setTeamFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const teams = useMemo(() => ['all', ...Array.from(new Set(POSITIONS.map(p => p.team)))], []);
  const list = teamFilter === 'all' ? POSITIONS : POSITIONS.filter(p => p.team === teamFilter);

  return (
    <main>
      <PageHeader num="06" eyebrow="Kariyer"
        title={["Yapıyı kuran", "insanlardır."]}
        intro="380 kişilik ekibimizin %42'si beş yıldan uzun süredir Chronos'ta. Bir Chronos kariyerinin nasıl göründüğünü merak ediyorsanız, aşağıdaki pozisyonlardan birine veya genel başvuru formuna ulaşın."
      />

      {/* Culture */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 0, borderTop: '1px solid var(--line)' }}>
            {[
              { kpi: '380', l: 'kişilik ekip' },
              { kpi: '%42', l: '5+ yıl kıdem' },
              { kpi: '%38', l: 'kadın çalışan' },
              { kpi: '24 gün', l: 'ortalama izin' },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 100}>
                <div style={{ padding: '32px 24px', borderRight: i < 3 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)' }}>
                  <div className="display" style={{ fontSize: 48, color: 'var(--accent)' }}>{s.kpi}</div>
                  <div style={{ marginTop: 12, color: 'var(--text-dim)', fontSize: 14 }}>{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
            <Reveal>
              <h2 className="display" style={{ fontSize: 'clamp(32px, 4.2vw, 56px)' }}>
                <MaskLines lines={["Açık pozisyonlar"]} />
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {teams.map(t => (
                  <button key={t} onClick={() => setTeamFilter(t)}
                    style={{
                      padding: '8px 14px', borderRadius: 100, border: '1px solid var(--line)',
                      background: teamFilter === t ? 'var(--accent)' : 'transparent',
                      color: teamFilter === t ? 'var(--accent-ink)' : 'var(--text-dim)',
                      cursor: 'pointer', fontSize: 12.5,
                      transition: 'all .35s',
                    }}>{t === 'all' ? 'Tümü' : t}</button>
                ))}
              </div>
            </Reveal>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--line)' }}>
            {list.map((p, i) => (
              <li key={i}>
                <Reveal delay={Math.min(i * 60, 480)}>
                  <button
                    onClick={() => setSelected({ ...p })}
                    style={{
                      width: '100%', display: 'grid',
                      gridTemplateColumns: '60px 1fr auto auto auto',
                      gap: 24, alignItems: 'center',
                      padding: '28px 0', borderBottom: '1px solid var(--line)',
                      background: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit',
                      transition: 'padding .4s var(--ease-out)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '20px'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}
                  >
                    <span className="label-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 2.4vw, 30px)', letterSpacing: '-0.01em' }}>{p.title}</span>
                    <span className="tag"><span className="dot"></span>{p.team}</span>
                    <span className="label-mono" style={{ color: 'var(--text-dim)' }}>{p.loc}</span>
                    <span className="label-mono" style={{ color: 'var(--text-dim)', textAlign: 'right' }}>{p.type} →</span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Application form */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)' }} id="apply">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 'clamp(40px, 8vw, 100px)' }}>
            <div>
              <Reveal>
                <div className="eyebrow" style={{ marginBottom: 24 }}><span className="num">03</span>Genel Başvuru</div>
              </Reveal>
              <Reveal delay={150}>
                <h2 className="display" style={{ fontSize: 'clamp(32px, 4.2vw, 56px)', marginBottom: 24 }}>
                  <MaskLines lines={["Uygun pozisyon", "göremediniz mi?"]} />
                </h2>
              </Reveal>
              <Reveal delay={300}>
                <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.7, maxWidth: 460 }}>
                  Aşağıdaki formu doldurun; uygun bir pozisyon açıldığında ekibimiz sizinle iletişime geçecek. Tüm başvurular 14 gün içinde yanıtlanır.
                </p>
              </Reveal>
            </div>
            <ApplicationForm preset={selected} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ApplicationForm({ preset }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', team: '', portfolio: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => { if (preset) setForm(f => ({ ...f, team: preset.title })); }, [preset]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = 'Ad ve soyad gerekli';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Geçerli bir e-posta girin';
    if (!form.message) errs.message = 'Lütfen birkaç cümle yazın';
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <Reveal>
        <div className="surface" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', color: 'var(--accent-ink)' }}>
            <Icon name="check" size={26} />
          </div>
          <h3 style={{ fontSize: 32 }}>Başvurunuz alındı.</h3>
          <p style={{ color: 'var(--text-dim)', maxWidth: 380 }}>Ekibimiz 14 gün içinde size dönecektir. Sabrınız için teşekkürler.</p>
        </div>
      </Reveal>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
      <div className={`field ${errors.name ? 'error' : ''}`} style={{ gridColumn: 'span 2' }}>
        <label>Ad Soyad</label>
        <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Mehmet Doğan" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className={`field ${errors.email ? 'error' : ''}`}>
        <label>E-posta</label>
        <input className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ornek@chronosinsaat.com.tr" />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      <div className="field">
        <label>Telefon</label>
        <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+90 5__ ___ __ __" />
      </div>
      <div className="field" style={{ gridColumn: 'span 2' }}>
        <label>Başvurulan pozisyon / departman</label>
        <input className="input" value={form.team} onChange={e => set('team', e.target.value)} placeholder="Örn. Kıdemli Mimar" />
      </div>
      <div className="field" style={{ gridColumn: 'span 2' }}>
        <label>Portföy / LinkedIn URL</label>
        <input className="input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://" />
      </div>
      <div className={`field ${errors.message ? 'error' : ''}`} style={{ gridColumn: 'span 2' }}>
        <label>Kendinizden bahsedin</label>
        <textarea className="textarea" rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Birkaç cümle yeterli — uzun yazmaya gerek yok." />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
        <span className="label-mono" style={{ color: 'var(--text-faint)' }}>* Bilgileriniz KVKK kapsamında saklanır.</span>
        <button className="btn btn-primary" type="submit">Başvuruyu gönder<span className="btn-arrow">→</span></button>
      </div>
    </form>
  );
}
