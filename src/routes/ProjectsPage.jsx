import { useMemo, useState } from 'react';
import { Reveal } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { PROJECTS } from '../data.js';

export function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all',          label: 'Tümü' },
    { id: 'devam-eden',   label: 'Devam Eden' },
    { id: 'tamamlanan',   label: 'Tamamlanan' },
    { id: 'konut',        label: 'Konut' },
    { id: 'ticari',       label: 'Ticari' },
    { id: 'donusum',      label: 'Kentsel Dönüşüm' },
  ];
  const list = useMemo(() => {
    if (filter === 'all') return PROJECTS;
    return PROJECTS.filter(p => p.status === filter || p.type === filter);
  }, [filter]);

  return (
    <main>
      <PageHeader num="03" eyebrow="Projeler"
        title={["10 proje, dört şehir,", "ortak bir disiplin."]}
        intro="142 tamamlanmış ve 28 devam eden projeden bir seçki. Filtrelerle bölge, tip veya statüye göre keşfedin." />

      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '20px 0' }}>
            <span className="label-mono" style={{ marginRight: 16 }}>Filtre /</span>
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding: '8px 16px', borderRadius: 100, border: '1px solid var(--line)',
                  background: filter === f.id ? 'var(--accent)' : 'transparent',
                  color: filter === f.id ? 'var(--accent-ink)' : 'var(--text-dim)',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'var(--sans)', letterSpacing: '0.01em',
                  transition: 'all .35s var(--ease-out)',
                }}>
                {f.label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {String(list.length).padStart(2, '0')} proje
            </span>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 24 }}>
            {list.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 60, 480)}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
          {list.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 80 }}>Bu filtreye uygun proje bulunamadı.</p>
          )}
        </div>
      </section>
    </main>
  );
}
