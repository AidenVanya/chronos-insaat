import { MaskLines, Reveal } from './animations.jsx';

export function PageHeader({ eyebrow, title, intro, num }) {
  return (
    <section className="section page-header">
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          <span className="num">{num}</span>{eyebrow}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(38px, 7.2vw, 114px)' }}>
          <MaskLines lines={Array.isArray(title) ? title : [title]} step={120} />
        </h1>
        {intro && (
          <Reveal delay={400}>
            <p style={{ marginTop: 'clamp(24px, 3vw, 36px)', maxWidth: 640, color: 'var(--text-dim)', fontSize: 'clamp(15.5px, 1.5vw, 17px)', lineHeight: 1.65 }}>{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
