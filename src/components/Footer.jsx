import { useEffect, useState } from 'react';
import { ROUTES } from '../data.js';
import { useRouter } from './Router.jsx';
import { useSiteData } from '../context/SiteContext.jsx';
import { BrandMark } from './BrandMark.jsx';
import { Icon } from './Icon.jsx';

export function Footer() {
  const { go } = useRouter();
  const { site } = useSiteData();
  const settings = site.settings || {};

  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Istanbul' }));
    };
    tick();
    const id = setInterval(tick, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 24 }} onClick={() => go('/')}>
              <BrandMark size={42} />
              <div className="brand-text">
                <span className="b1" style={{ fontSize: 22 }}>{settings.brandName || 'Chronos'}</span>
                <span className="b2">{settings.brandSub || 'İnşaat / EST.1987'}</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-dim)', maxWidth: 360, fontSize: 14, lineHeight: 1.6 }}>
              {settings.footerDesc || "Zamana, malzemeye ve insana saygılı bir inşaat pratiği. 1987'den bu yana 142 projeyi söz verdiğimiz tarihte teslim ettik."}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center', color: 'var(--text-faint)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s ease-in-out infinite' }}></span>
              İstanbul · {time}
            </div>
          </div>
          <div>
            <h4>Sayfalar</h4>
            <ul>
              {ROUTES.slice(0, 4).map((r) => (
                <li key={r.id}><a onClick={() => go(r.path)} style={{ cursor: 'pointer' }}>{r.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Şirket</h4>
            <ul>
              {ROUTES.slice(4).map((r) => (
                <li key={r.id}><a onClick={() => go(r.path)} style={{ cursor: 'pointer' }}>{r.label}</a></li>
              ))}
              <li>
                <a onClick={() => go('/panel')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)' }}>
                  <Icon name="lock" size={14} /> Yönetim Paneli
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>İletişim</h4>
            <ul>
              <li>{settings.phone || '+90 212 999 14 87'}</li>
              <li>{settings.email || 'info@chronosinsaat.com.tr'}</li>
              <li>{settings.addressLine1 || 'Büyükdere Cd. No:209'}<br />{settings.addressLine2 || 'Levent / İstanbul'}</li>
            </ul>
          </div>
        </div>

        <div className="footer-wordmark">{(settings.brandName || 'CHRONOS').toUpperCase()}</div>

        <div className="footer-bottom">
          <span>© 1987 — 2026 {settings.brandName || 'Chronos'} İnşaat A.Ş. Tüm hakları saklıdır.</span>
          <span>{settings.certNo || 'Yapı Müteahhitliği Yetki Belgesi No: 0034/01142'}</span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.5); opacity: .6 } }`}</style>
    </footer>
  );
}
