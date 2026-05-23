import { MaskLines, Reveal } from './animations.jsx';

export function PageHeader({ eyebrow, title, intro, num }) {
  return (
    <section className="section" style={{ paddingTop: 180, paddingBottom: 60 }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 28 }}>
          <span className="num">{num}</span>{eyebrow}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 8vw, 128px)' }}>
          <MaskLines lines={Array.isArray(title) ? title : [title]} step={120} />
        </h1>
        {intro && (
          <Reveal delay={400}>
            <p style={{ marginTop: 36, maxWidth: 620, color: 'var(--text-dim)', fontSize: 17, lineHeight: 1.65 }}>{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
