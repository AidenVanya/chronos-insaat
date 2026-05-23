import { useEffect, useRef, useState } from 'react';

// Shared helper: respect prefers-reduced-motion across all primitives below.
function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─────────────────────────────────────────────────────────────────────
   Reveal — fades + slides children in when they enter the viewport.
   Hard safety fallback: always reveals within 700ms regardless of IO.
   ───────────────────────────────────────────────────────────────────── */
export function Reveal({ as: As = 'div', children, delay = 0, dir = 'up', scale, className = '', style, once = true, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setSeen(true); return; }

    let done = false;
    const reveal = () => { if (!done) { done = true; setSeen(true); } };
    const fallback = setTimeout(reveal, 700);

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            if (once) io.unobserve(el);
          } else if (!once && done) {
            setSeen(false);
            done = false;
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      io.observe(el);
      return () => { io.disconnect(); clearTimeout(fallback); };
    }

    return () => clearTimeout(fallback);
  }, [once]);
  const dirCls = dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : '';
  const scaleCls = scale ? 'reveal-scale' : '';
  return (
    <As
      ref={ref}
      className={`reveal ${dirCls} ${scaleCls} ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </As>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MaskLines — multi-line masked text reveal with stagger.
   Hard safety fallback: always reveals within 600ms.
   ───────────────────────────────────────────────────────────────────── */
export function MaskLines({ lines, delay = 0, step = 140, className = '', style }) {
  const containerRef = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (prefersReducedMotion()) { setSeen(true); return; }

    let done = false;
    const reveal = () => { if (!done) { done = true; setSeen(true); } };
    const fallback = setTimeout(reveal, 600);

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { reveal(); io.unobserve(el); } });
      }, { threshold: 0.2 });
      io.observe(el);
      return () => { io.disconnect(); clearTimeout(fallback); };
    }

    return () => clearTimeout(fallback);
  }, []);
  return (
    <span ref={containerRef} className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className={`mask-line ${seen ? 'in' : ''}`}>
          <span style={{ transitionDelay: `${delay + i * step}ms` }}>{line}</span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   CountUp — eases a number from 0 to `to` when it enters view.
   Safety fallback: kicks the animation after 1500ms even if IO is silent.
   ───────────────────────────────────────────────────────────────────── */
export function CountUp({ to, decimals = 0, duration = 1600, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf, started = false;
    const start = (ts) => {
      const animate = (now) => {
        const t = Math.min(1, (now - ts) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(to * eased);
        if (t < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    };
    const kick = () => { if (!started) { started = true; start(performance.now()); } };

    if (typeof IntersectionObserver === 'undefined') { kick(); return () => cancelAnimationFrame(raf); }

    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    if (inView) { kick(); }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { kick(); io.unobserve(el); } });
    }, { threshold: 0.3 });
    io.observe(el);

    const fallback = setTimeout(kick, 1500);

    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(fallback); };
  }, [to, duration]);
  return (
    <span ref={ref} className="counter">
      {val.toFixed(decimals)}
      <span className="suffix">{suffix}</span>
    </span>
  );
}
