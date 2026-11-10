import { useMemo, useState } from 'react';
import { Reveal } from '../components/animations.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { useSiteData } from '../context/SiteContext.jsx';

export function ProjectsPage() {
  const { site } = useSiteData();
  const projects = site.projects || [];

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
    if (filter === 'all') return projects;
    return projects.filter(p => p.status === filter || p.type === filter);
  }, [filter, projects]);

  return (
    <main>
      <PageHeader num="03" eyebrow="Projeler"
        title={[`${projects.length} proje, dört şehir,`, "ortak bir disiplin."]}
        intro="142 tamamlanmış ve 28 devam eden projeden bir seçki. Filtrelerle bölge, tip veya statüye göre keşfedin." />

      <section style={{ padding: '24px 0 40px' }}>
        <div className="container">
          <div style={{
            display: 'flex', gap: '12px 16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '20px 0',
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="label-mono" style={{ marginRight: 8 }}>Filtre /</span>
              {filters.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  style={{
                    padding: '8px 16px', borderRadius: 100,
                    border: `1px solid ${filter === f.id ? 'var(--accent)' : 'var(--line)'}`,
                    background: filter === f.id ? 'var(--accent)' : 'transparent',
                    color: filter === f.id ? 'var(--accent-ink)' : 'var(--text-dim)',
                    cursor: 'pointer', fontSize: 13, fontFamily: 'var(--sans)', letterSpacing: '0.01em',
                    transition: 'all .35s var(--ease-out)',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
            <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {String(list.length).padStart(2, '0')} proje
            </span>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(72px, 10vw, 120px)' }}>
        <div className="container">
          <div className="projects-grid">
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
