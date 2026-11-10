import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  HERO_SLIDES,
  IMG,
  POSITIONS,
  PROJECTS,
  SERVICES,
  STATS,
  TECH_FEATURES,
  TESTIMONIALS,
  TIMELINE,
  VALUES,
} from '../data.js';

const DEFAULT_SITE_DATA = {
  settings: {
    brandName: 'Chronos',
    brandSub: 'İnşaat / EST.1987',
    theme: 'midnight-gold',
    heroEyebrow: 'EST. 1987 / İSTANBUL — ANKARA — İZMİR',
    heroTitle: ['Zamana', 'dayanan', 'yapılar.'],
    heroDesc: 'Konut, ticari ve kentsel dönüşümde 38 yıllık disiplin. İstanbul başta olmak üzere 16 şehirde 142 proje teslim ettik — söz verdiğimiz tarihte, söz verdiğimiz kalitede.',
    philosophyTitle: ['İnşaat;', 'zamana, malzemeye ve', 'insana verilen sözdür.'],
    ctaTitle: ['Bir sonraki', 'kalıcı yapı,', 'sizinki olsun.'],
    aboutTitle: ["1987'den bu yana", 'aynı disiplinle.'],
    aboutIntro: "Mehmet Doğan'ın beş kişilik bir mimari ofis olarak Ankara'da kurduğu Chronos, bugün 380 kişilik bir ekibe sahip — ama söz verdiğimiz tarihi tutma disiplinimizi ilk günden bu yana değiştirmedik.",
    aboutHeroCaption: 'Karaköy Loft No.7 / Restorasyon kazısı, 2022',
    aboutHeroImg: IMG('1486325212027-8081e485255e', 2000),
    visionText: 'Yarının şehirlerinde de iz bırakan, kalıcı yapılar inşa etmek.',
    missionText: 'Estetik, mühendislik ve zaman disiplinini uzlaşmaz biçimde bir araya getirmek.',
    promiseText: '38 yıllık tarihimiz boyunca tek bir teslim tarihi kaçırmadık.',
    phone: '+90 212 999 14 87',
    workHours: 'Hafta içi 09:00 — 18:30',
    email: 'info@chronosinsaat.com.tr',
    pressEmail: 'basin@chronosinsaat.com.tr',
    addressLine1: 'Büyükdere Cd. No:209',
    addressLine2: 'Levent / İstanbul 34394',
    coordinates: '41.0789°N · 29.0124°E',
    footerDesc: "Zamana, malzemeye ve insana saygılı bir inşaat pratiği. 1987'den bu yana 142 projeyi söz verdiğimiz tarihte teslim ettik.",
    certNo: 'Yapı Müteahhitliği Yetki Belgesi No: 0034/01142',
  },
  heroSlides: HERO_SLIDES.map((s, i) => ({ id: `hs${i + 1}`, ...s })),
  projects: PROJECTS.map((p, i) => ({ featured: i < 6, ...p })),
  stats: STATS.map((s, i) => ({ id: `st${i + 1}`, decimals: 0, ...s })),
  services: SERVICES.map((s, i) => ({ id: `sv${i + 1}`, ...s })),
  processSteps: [
    { id: 'ps1', n: '01', t: 'Keşif',            d: 'Yatırımcı ile bir araya gelir, ihtiyacı, parsel kısıtlarını ve hedefleri tanımlarız.' },
    { id: 'ps2', n: '02', t: 'Konsept',          d: 'Üç farklı mimari konsept ve ön maliyet senaryosu hazırlarız.' },
    { id: 'ps3', n: '03', t: 'Uygulama Projesi', d: 'BIM ortamında tüm disiplinlerle koordineli bir LOD-400 model üretiriz.' },
    { id: 'ps4', n: '04', t: 'İnşaat',           d: 'Dijital ikiz destekli saha — haftalık raporlama ve canlı izleme.' },
    { id: 'ps5', n: '05', t: 'Teslim & Bakım',   d: '10 yıllık yapısal garanti, 2 yıllık tüm sistem bakımı.' },
  ],
  timeline: TIMELINE.map((t, i) => ({ id: `tl${i + 1}`, ...t })),
  leadership: [
    { id: 'ld1', n: 'Mehmet Doğan',   r: 'Kurucu / Yönetim Kurulu Başkanı', img: IMG('1568602471122-7832951cc4c5', 900) },
    { id: 'ld2', n: 'Defne Aksu',     r: 'CEO',                             img: IMG('1494790108377-be9c29b29330', 900) },
    { id: 'ld3', n: 'Tolga Yıldırım', r: 'Tasarım Direktörü',               img: IMG('1500648767791-00dcc994a43e', 900) },
    { id: 'ld4', n: 'Selin Erkan',    r: 'Sürdürülebilirlik Direktörü',     img: IMG('1573496359142-b8d87734a5a2', 900) },
  ],
  testimonials: TESTIMONIALS.map((t, i) => ({ id: `tm${i + 1}`, ...t })),
  techFeatures: TECH_FEATURES.map((f, i) => ({ id: `tf${i + 1}`, ...f })),
  materials: [
    { id: 'mt1', ico: 'leaf',    t: 'Düşük Karbonlu Çimento',    s: 'CEM III/B sınıfı, %60 daha az CO₂',   pct: 62 },
    { id: 'mt2', ico: 'recycle', t: 'Geri Dönüştürülmüş Agrega', s: 'İnşaat moloz atığından %35',          pct: 35 },
    { id: 'mt3', ico: 'solar',   t: 'Çatı + Cephe PV',           s: "Yıllık tüketimin %48'i",              pct: 48 },
    { id: 'mt4', ico: 'sensor',  t: 'IoT Sensör Ağı',            s: 'Tüm yeni binalarda BMS entegrasyonu', pct: 100 },
  ],
  positions: POSITIONS.map((p, i) => ({ id: `pos${i + 1}`, ...p })),
  values: VALUES.map((v, i) => ({ id: `vl${i + 1}`, ...v })),
  offices: [
    { id: 'of1', c: 'Ankara', a: 'Bilkent Plaza A2' },
    { id: 'of2', c: 'İzmir',  a: 'Alsancak No:88' },
    { id: 'of3', c: 'Bodrum', a: 'Yalıkavak Şantiyesi' },
  ],
};

const SiteCtx = createContext({
  site: DEFAULT_SITE_DATA,
  refreshPublicData: async () => {},
  updateLocalSection: () => {},
  trackVisit: () => {},
});

export const useSiteData = () => useContext(SiteCtx);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(DEFAULT_SITE_DATA);

  const refreshPublicData = useCallback(async () => {
    try {
      const res = await fetch('/api/public');
      if (res.ok) {
        const data = await res.json();
        setSite((prev) => ({
          ...prev,
          ...data,
          settings: { ...prev.settings, ...(data.settings || {}) },
        }));
      }
    } catch {
      // Offline / static fallback
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  // Apply theme dynamically to <html data-theme="...">
  useEffect(() => {
    const theme = site.settings?.theme || 'midnight-gold';
    if (theme === 'default' || theme === 'charcoal-orange') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [site.settings?.theme]);

  const updateLocalSection = useCallback((section, data) => {
    setSite((prev) => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  const trackVisit = useCallback(({ path, projectId }) => {
    let isNewSession = false;
    try {
      if (!sessionStorage.getItem('chronos_session_tracked')) {
        sessionStorage.setItem('chronos_session_tracked', '1');
        isNewSession = true;
      }
    } catch {}
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, projectId, isNewSession }),
    }).catch(() => {});
  }, []);

  return (
    <SiteCtx.Provider value={{ site, refreshPublicData, updateLocalSection, trackVisit }}>
      {children}
    </SiteCtx.Provider>
  );
}
