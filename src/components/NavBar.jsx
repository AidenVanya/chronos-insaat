import { useEffect, useState } from 'react';
import { ROUTES } from '../data.js';
import { useRouter } from './Router.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { BrandMark } from './BrandMark.jsx';

export function NavBar() {
  const { path, go } = useRouter();
  const { site } = useSiteData();
  const settings = site.settings || {};

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleGo = (to) => { setMobileOpen(false); setTimeout(() => go(to), 50); };

  return (
    <>
      <nav className={`nav ${scrolled || path === '/panel' || path === '/admin' ? 'scrolled' : ''}`}>
        <div className="brand" onClick={() => handleGo('/')}>
          <BrandMark size={38} />
          <div className="brand-text">
            <span className="b1">{settings.brandName || 'Chronos'}</span>
            <span className="b2">{settings.brandSub || 'İnşaat / EST.1987'}</span>
          </div>
        </div>

        <div className="nav-links">
          {ROUTES.map((r) => (
            <a key={r.id}
               className={`nav-link ${path === r.path ? 'active' : ''}`}
               onClick={() => handleGo(r.path)}>
              {r.label}
            </a>
          ))}
        </div>

        <div className="nav-cta">
          <button className="btn btn-primary" onClick={() => handleGo('/iletisim')}>
            Teklif al
            <span className="btn-arrow">→</span>
          </button>
        </div>

        <button className={`nav-burger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(v => !v)} aria-label="Menü">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <MobileMenu open={mobileOpen} onGo={handleGo} onClose={() => setMobileOpen(false)} settings={settings} />
    </>
  );
}

function MobileMenu({ open, onGo, onClose, settings }) {
  return (
    <div className={`mobile-menu ${open ? 'open' : ''}`}>
      <button className="mm-close" aria-label="Menüyü kapat" onClick={onClose}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {ROUTES.map((r, i) => (
        <a key={r.id}
           className="mm-link"
           onClick={() => onGo(r.path)}
           style={{ transitionDelay: open ? `${180 + i * 70}ms` : '0ms' }}>
          <span>{r.label}</span>
          <span className="mm-num">{r.num}</span>
        </a>
      ))}
      <div className="mm-foot" style={{ transitionDelay: open ? '900ms' : '0ms', opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity .6s, transform .6s' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>İletişim</span>
        <span>{settings.phone || '+90 212 999 14 87'}</span>
        <span>{settings.email || 'info@chronosinsaat.com.tr'}</span>
        <span>{settings.addressLine1 || 'Büyükdere Cd. No:209'} {settings.addressLine2 || 'Levent / İstanbul'}</span>
      </div>
    </div>
  );
}
