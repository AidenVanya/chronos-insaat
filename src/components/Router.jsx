import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BrandMark } from './BrandMark.jsx';

const RouterCtx = createContext({ path: '/', go: () => {} });
export const useRouter = () => useContext(RouterCtx);

function getPathFromHash() {
  const h = window.location.hash || '';
  if (!h.startsWith('#')) return '/';
  return h.slice(1) || '/';
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(getPathFromHash());
  const [curtain, setCurtain] = useState('idle'); // idle | entering | exiting
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const onHash = () => setPath(getPathFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((to) => {
    if (to === path) return;
    setPending(to);
    setCurtain('entering');
  }, [path]);

  useEffect(() => {
    if (curtain === 'entering') {
      const t = setTimeout(() => {
        if (pending) {
          window.location.hash = pending;
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        setCurtain('exiting');
      }, 720);
      return () => clearTimeout(t);
    }
    if (curtain === 'exiting') {
      const t = setTimeout(() => {
        setCurtain('idle');
        setPending(null);
      }, 720);
      return () => clearTimeout(t);
    }
  }, [curtain, pending]);

  return (
    <RouterCtx.Provider value={{ path, go }}>
      {children}
      <Curtain phase={curtain} />
    </RouterCtx.Provider>
  );
}

function Curtain({ phase }) {
  const cls = phase === 'idle' ? '' : (phase === 'entering' ? 'entering' : 'exiting');
  return (
    <div className={`curtain ${cls}`} aria-hidden="true">
      <div className="panel"></div>
      <div className="panel"></div>
      <div className="panel"></div>
      <div className="panel"></div>
      <div className="panel"></div>
      <div className="center-mark">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <BrandMark size={72} radius={14} plate="var(--accent-ink)" ink="var(--accent)" hoverable={false} />
          <span className="c-logo">Chronos</span>
        </div>
      </div>
    </div>
  );
}
