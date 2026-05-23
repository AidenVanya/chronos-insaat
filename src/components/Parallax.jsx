import { useEffect, useRef } from 'react';

export function Parallax({ src, height = 480, speed = 0.25, children, style }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; const img = imgRef.current;
      if (!el || !img) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * speed;
      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', height, ...style }}>
      <div ref={imgRef}
           style={{
             position: 'absolute', inset: '-15%',
             backgroundImage: `url(${src})`,
             backgroundSize: 'cover', backgroundPosition: 'center',
             willChange: 'transform',
             transform: 'scale(1.15)',
           }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65))' }} />
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  );
}
