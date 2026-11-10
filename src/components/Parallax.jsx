import { useEffect, useRef } from 'react';

export function Parallax({ src, height = 480, speed = 0.14, children, style }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; const img = imgRef.current;
      if (!el || !img) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const maxOffset = rect.height * 0.12;
      const rawOffset = (window.innerHeight / 2 - center) * speed;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', height, ...style }}>
      <div ref={imgRef}
           style={{
             position: 'absolute', inset: '-15%',
             backgroundImage: `url(${src})`,
             backgroundSize: 'cover', backgroundPosition: 'center',
             willChange: 'transform',
             transform: 'scale(1.12)',
           }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.68))' }} />
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  );
}
