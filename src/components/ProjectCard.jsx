import { useRouter } from './Router.jsx';

export function ProjectCard({ p, large }) {
  const { go } = useRouter();
  const statusLabel = { 'tamamlanan': 'Tamamlandı', 'devam-eden': 'Devam ediyor' }[p.status];
  return (
    <div className="proj-card" style={{ height: large ? 640 : 460, gridColumn: large ? '1 / -1' : 'auto' }}
         onClick={() => go('/projeler')}>
      <div className="proj-img" style={{ backgroundImage: `url(${p.img})` }} />
      <div className="proj-overlay" />
      <div style={{ position: 'absolute', left: 22, top: 22, display: 'flex', gap: 10 }}>
        <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
          <span className="dot" style={{ background: p.status === 'devam-eden' ? '#ffce4d' : 'var(--accent)' }}></span>
          {statusLabel}
        </span>
        <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
          {p.year}
        </span>
      </div>
      <div className="proj-meta">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 10 }}>
            {p.loc} · {p.type === 'donusum' ? 'Kentsel Dönüşüm' : p.type === 'konut' ? 'Konut' : 'Ticari'}
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: large ? 56 : 36, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {p.name}
          </div>
        </div>
      </div>
      <div className="proj-detail">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>
          {p.loc} · {p.year}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: large ? 48 : 32, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.04, marginBottom: 14 }}>
          {p.name}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{p.note}</p>
        <div style={{ display: 'flex', gap: 18, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
          <span>{p.area}</span>
          <span>· {p.floors} kat</span>
          {p.units > 0 && <span>· {p.units} ünite</span>}
        </div>
      </div>
    </div>
  );
}
