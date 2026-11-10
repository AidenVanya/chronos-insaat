import { useRouter } from './Router.jsx';

export function ProjectCard({ p, large }) {
  const { go } = useRouter();
  const statusLabel = { 'tamamlanan': 'Tamamlandı', 'devam-eden': 'Devam ediyor' }[p.status];
  return (
    <div className={`proj-card ${large ? 'large' : ''}`} onClick={() => go('/projeler')}>
      <div className="proj-img" style={{ backgroundImage: `url(${p.img})` }} />
      <div className="proj-overlay" />
      <div className="proj-tags">
        <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <span className="dot" style={{ background: p.status === 'devam-eden' ? '#ffce4d' : 'var(--accent)' }}></span>
          {statusLabel}
        </span>
        <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          {p.year}
        </span>
      </div>
      <div className="proj-meta">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', marginBottom: 8 }}>
            {p.loc} · {p.type === 'donusum' ? 'Kentsel Dönüşüm' : p.type === 'konut' ? 'Konut' : 'Ticari'}
          </div>
          <div className="proj-title">
            {p.name}
          </div>
        </div>
      </div>
      <div className="proj-detail">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>
          {p.loc} · {p.year}
        </div>
        <div className="proj-detail-title">
          {p.name}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>{p.note}</p>
        <div style={{ display: 'flex', gap: '8px 16px', flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' }}>
          <span>{p.area}</span>
          <span>· {p.floors} kat</span>
          {p.units > 0 && <span>· {p.units} ünite</span>}
        </div>
      </div>
    </div>
  );
}
