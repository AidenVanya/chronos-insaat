// server/db.js — Persistent JSON Database with atomic write-through & rich initial seed
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const DEFAULT_FIREBASE_DB_URL = process.env.VITE_FIREBASE_DB_URL || 'https://test1-ad80c-default-rtdb.firebaseio.com';

export function toFirebaseSafe(val) {
  if (Array.isArray(val)) return val.map(toFirebaseSafe);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      const safeKey =
        k === '/'
          ? 'route_home'
          : k.startsWith('/')
          ? `route_${k.slice(1).replace(/[.#$[\]/]/g, '_')}`
          : k.replace(/[.#$[\]/]/g, '_');
      out[safeKey] = toFirebaseSafe(v);
    }
    return out;
  }
  return val;
}

async function syncNodeDbToFirebase(data) {
  if (!DEFAULT_FIREBASE_DB_URL) return;
  try {
    await fetch(`${DEFAULT_FIREBASE_DB_URL.replace(/\/+$/, '')}/chronos_db.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toFirebaseSafe(data)),
    });
  } catch (err) {
    console.error('[Chronos Firebase Sync] Hata:', err.message);
  }
}

const IMG = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

function buildDefaultDates() {
  const days = [];
  const baseViews = [184, 210, 195, 248, 276, 312, 289, 334, 360, 342, 398, 425, 461, 492];
  const baseUniques = [118, 134, 121, 160, 179, 204, 188, 219, 241, 226, 264, 285, 312, 338];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
    const idx = 13 - i;
    days.push({
      date: key,
      label,
      views: baseViews[idx] || 300,
      visitors: baseUniques[idx] || 200,
    });
  }
  return days;
}

export function createInitialSeed() {
  const defaultCreds = hashPassword('Chronos2026!');
  return {
    admin: {
      username: 'admin',
      salt: defaultCreds.salt,
      passwordHash: defaultCreds.hash,
      updatedAt: new Date().toISOString(),
    },
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
    heroSlides: [
      { id: 'hs1', img: IMG('1487958449943-2429e8be8625', 2000), label: 'Maslak 1453 / 2024' },
      { id: 'hs2', img: IMG('1486325212027-8081e485255e', 2000), label: 'Karaköy Loft / 2023' },
      { id: 'hs3', img: IMG('1545324418-cc1a3fa10c00',    2000), label: 'Bebek Rezidans / 2025' },
      { id: 'hs4', img: IMG('1600585154340-be6161a56a0c', 2000), label: 'Çeşme Villaları / 2024' },
    ],
    projects: [
      { id: 'p1', name: 'Maslak Vertikal',        loc: 'İstanbul',  year: 2024, status: 'tamamlanan', type: 'konut',   featured: true,
        img: IMG('1487958449943-2429e8be8625'), area: '74.000 m²',  floors: 42, units: 188,
        note: '42 katlı premium rezidans — Boğaz manzaralı 188 ünite, LEED Platinum sertifikalı.' },
      { id: 'p2', name: 'Karaköy Loft No.7',      loc: 'İstanbul',  year: 2023, status: 'tamamlanan', type: 'konut',   featured: true,
        img: IMG('1486325212027-8081e485255e'), area: '12.400 m²',  floors: 7,  units: 38,
        note: 'Tarihi yapının özüne dokunmadan modern bir mimariye taşınması — restorasyon ve rezidans birlikteliği.' },
      { id: 'p3', name: 'Levent İş Kulesi',       loc: 'İstanbul',  year: 2025, status: 'devam-eden', type: 'ticari',  featured: true,
        img: IMG('1486406146926-c627a92ad1ab'), area: '108.000 m²', floors: 38, units: 0,
        note: '38 katlı A+ ofis kulesi — NZEB (neredeyse sıfır enerjili bina) standardında inşa ediliyor.' },
      { id: 'p4', name: 'Bebek Cliff Residences', loc: 'İstanbul',  year: 2025, status: 'devam-eden', type: 'konut',   featured: true,
        img: IMG('1545324418-cc1a3fa10c00'),    area: '22.000 m²',  floors: 9,  units: 24,
        note: 'Boğaz yamacında 24 ultra-lüks daire — özel iskele ve helikopter pisti.' },
      { id: 'p5', name: 'Çeşme Marina Villas',    loc: 'İzmir',     year: 2024, status: 'tamamlanan', type: 'konut',   featured: true,
        img: IMG('1600585154340-be6161a56a0c'), area: '38.500 m²',  floors: 3,  units: 31,
        note: 'Ege kıyısında 31 mimari villa — taş, ahşap ve cam ile yerel dokuya tutkulu bir cevap.' },
      { id: 'p6', name: 'Esenyurt Dönüşüm Bloğu', loc: 'İstanbul',  year: 2024, status: 'tamamlanan', type: 'donusum', featured: true,
        img: IMG('1502005229762-cf1b2da7c5d6'), area: '146.000 m²', floors: 18, units: 612,
        note: 'Kentsel dönüşüm — 612 hane, 18 katlı 6 blok, sosyal donatı alanlarıyla mahalle ölçeğinde yenileme.' },
      { id: 'p7', name: 'Eskişehir Tech Park',    loc: 'Eskişehir', year: 2025, status: 'devam-eden', type: 'ticari',  featured: false,
        img: IMG('1496307653780-42ee777d4833'), area: '54.000 m²',  floors: 6,  units: 0,
        note: 'Teknopark kampüsü — yedi blok arasında yarı kapalı bir avlu sistemi.' },
      { id: 'p8', name: 'Ankara Civic Plaza',     loc: 'Ankara',    year: 2026, status: 'devam-eden', type: 'ticari',  featured: false,
        img: IMG('1479839672679-a46483c0e7c8'), area: '92.000 m²',  floors: 12, units: 0,
        note: 'Kamu hizmet binası — ışık ve şeffaflığı temel ilke alan bir tasarım.' },
      { id: 'p9', name: 'Fikirtepe Yeni Mahalle', loc: 'İstanbul',  year: 2023, status: 'tamamlanan', type: 'donusum', featured: false,
        img: IMG('1564540583246-934409427776'), area: '215.000 m²', floors: 16, units: 980,
        note: '980 hanelik kentsel dönüşüm — bölgenin en büyük entegre yenileme projesi.' },
      { id: 'p10', name: 'Bodrum Cove Hotel',     loc: 'Muğla',     year: 2025, status: 'devam-eden', type: 'ticari',  featured: false,
        img: IMG('1582719508461-905c673771fd'), area: '28.000 m²',  floors: 4,  units: 96,
        note: '96 odalı butik otel — denizle bütünleşik teraslı bir kompozisyon.' },
    ],
    stats: [
      { id: 'st1', num: 38,  suffix: '+',    label: 'yıllık deneyim',   decimals: 0 },
      { id: 'st2', num: 142, suffix: '',     label: 'tamamlanan proje', decimals: 0 },
      { id: 'st3', num: 2.4, suffix: 'M m²', label: 'inşa edilen alan', decimals: 1 },
      { id: 'st4', num: 16,  suffix: '',     label: 'şehirde aktif',    decimals: 0 },
    ],
    services: [
      { id: 'sv1', num: '01', name: 'Mimari Tasarım',          icon: 'pen',
        desc: 'Konsept geliştirmeden uygulama projelerine kadar tüm tasarım sürecini bünyemizdeki 38 kişilik tasarım ekibimizle yönetiyoruz.' },
      { id: 'sv2', num: '02', name: 'Genel Müteahhitlik',      icon: 'crane',
        desc: 'Anahtar teslim inşaat — temel atımdan ince işlere, kalite kontrolden teslim sonrası garantiye tüm sorumluluk bizde.' },
      { id: 'sv3', num: '03', name: 'Kentsel Dönüşüm',         icon: 'city',
        desc: 'Hak sahibi vatandaşlardan belediyelere uzanan paydaş yönetimi ile şehir ölçeğinde dönüşüm projeleri.' },
      { id: 'sv4', num: '04', name: 'Proje & İnşaat Yönetimi', icon: 'chart',
        desc: 'Üçüncü taraf projelerinizde maliyet, zaman ve kalite üçgenini bir PMI sertifikalı ekip ile garanti altına alıyoruz.' },
      { id: 'sv5', num: '05', name: 'Restorasyon',             icon: 'arch',
        desc: 'Tarihi yapıların özünü koruyarak modern yaşama dahil edilmesi — Vakıflar Genel Müdürlüğü onaylı uygulamalar.' },
      { id: 'sv6', num: '06', name: 'BIM & Dijital İkiz',      icon: 'cube',
        desc: 'LOD-400 BIM modelleri ve sahaya senkron dijital ikiz yaklaşımı ile sıfır revizyon hedefliyoruz.' },
    ],
    processSteps: [
      { id: 'ps1', n: '01', t: 'Keşif',            d: 'Yatırımcı ile bir araya gelir, ihtiyacı, parsel kısıtlarını ve hedefleri tanımlarız.' },
      { id: 'ps2', n: '02', t: 'Konsept',          d: 'Üç farklı mimari konsept ve ön maliyet senaryosu hazırlarız.' },
      { id: 'ps3', n: '03', t: 'Uygulama Projesi', d: 'BIM ortamında tüm disiplinlerle koordineli bir LOD-400 model üretiriz.' },
      { id: 'ps4', n: '04', t: 'İnşaat',           d: 'Dijital ikiz destekli saha — haftalık raporlama ve canlı izleme.' },
      { id: 'ps5', n: '05', t: 'Teslim & Bakım',   d: '10 yıllık yapısal garanti, 2 yıllık tüm sistem bakımı.' },
    ],
    timeline: [
      { id: 'tl1', year: 1987, title: 'Kuruluş',                     text: "Mehmet Doğan, beş kişilik bir mimari ofis olarak Chronos'u Ankara'da kuruyor." },
      { id: 'tl2', year: 1994, title: 'İlk büyük ölçekli proje',     text: "Bilkent Plaza'nın inşaatı tamamlanıyor — şirket için bir dönüm noktası." },
      { id: 'tl3', year: 2003, title: 'İstanbul ofisi açılıyor',     text: "Levent'te yeni genel merkez. Şirket 80 kişilik bir ekibe ulaşıyor." },
      { id: 'tl4', year: 2011, title: 'Uluslararası açılım',         text: "Tiflis ve Bakü'de iki ofis ve dört aktif proje. İlk LEED Gold sertifikalı bina." },
      { id: 'tl5', year: 2018, title: 'Dijital dönüşüm',             text: 'Tüm projeler BIM Level 2 standardında. Saha-ofis senkron çalışan dijital ikiz sistemi devreye giriyor.' },
      { id: 'tl6', year: 2024, title: 'Sürdürülebilirlik öncelikli', text: 'Tüm yeni projelerde NZEB hedefi. Beton karışımında %60 azaltılmış karbon ayak izi.' },
    ],
    leadership: [
      { id: 'ld1', n: 'Mehmet Doğan',   r: 'Kurucu / Yönetim Kurulu Başkanı', img: IMG('1568602471122-7832951cc4c5', 900) },
      { id: 'ld2', n: 'Defne Aksu',     r: 'CEO',                             img: IMG('1494790108377-be9c29b29330', 900) },
      { id: 'ld3', n: 'Tolga Yıldırım', r: 'Tasarım Direktörü',               img: IMG('1500648767791-00dcc994a43e', 900) },
      { id: 'ld4', n: 'Selin Erkan',    r: 'Sürdürülebilirlik Direktörü',     img: IMG('1573496359142-b8d87734a5a2', 900) },
    ],
    testimonials: [
      { id: 'tm1', name: 'Ayşe Kuzu',    role: 'CEO, Kuzu Grup',
        quote: '"Chronos\'la 11 yıllık ortaklığımız sırasında tek bir teslim tarihi kaçırılmadı. Bu sektörde duyulmuş bir şey değil."' },
      { id: 'tm2', name: 'Doğan Arıkan', role: 'Mimar, AAA Studio',
        quote: '"Tasarım dilimize saygılı, mühendislik anlamında uzlaşmaz. Birlikte çalışmak, projeyi olduğundan iyi yapar."' },
      { id: 'tm3', name: 'Selin Yılmaz', role: 'Yatırım Direktörü, Argon Capital',
        quote: '"Yatırımcı tarafında en çok aradığımız şey öngörülebilirlik. Chronos\'un raporlama disiplini sektörde fark yaratıyor."' },
      { id: 'tm4', name: 'Erkan Demir',  role: 'Belediye Başkanı, Eskişehir',
        quote: '"Tech Park projesinde belediye paydaşlığını gerçek anlamda yaşadık. Bürokratik değil, ortak çözen bir ekip."' },
    ],
    techFeatures: [
      { id: 'tf1', kpi: '−42%',   title: 'CO₂ Ayak İzi',            text: 'Düşük karbonlu çimento ve geri dönüştürülmüş agrega kullanımı ile geleneksel betona kıyasla 42% emisyon azaltımı.' },
      { id: 'tf2', kpi: 'NZEB',   title: 'Neredeyse Sıfır Enerji',  text: 'Çatı ve cephe entegre PV panelleri, jeotermal ısı pompaları ve akıllı bina yönetim sistemleri.' },
      { id: 'tf3', kpi: 'LEED',   title: 'Platinum Sertifikasyon',  text: 'Tüm yeni projelerimiz LEED Platinum hedefiyle başlatılıyor; 14 projemiz şu anda Platinum sahibi.' },
      { id: 'tf4', kpi: 'BIM 7D', title: 'Dijital İkiz',            text: 'Tasarımdan teslim sonrası bakıma uzanan 7D BIM modelleri — gerçek zamanlı sensör verisi ile beslenir.' },
    ],
    materials: [
      { id: 'mt1', ico: 'leaf',    t: 'Düşük Karbonlu Çimento',    s: 'CEM III/B sınıfı, %60 daha az CO₂',   pct: 62 },
      { id: 'mt2', ico: 'recycle', t: 'Geri Dönüştürülmüş Agrega', s: 'İnşaat moloz atığından %35',          pct: 35 },
      { id: 'mt3', ico: 'solar',   t: 'Çatı + Cephe PV',           s: "Yıllık tüketimin %48'i",              pct: 48 },
      { id: 'mt4', ico: 'sensor',  t: 'IoT Sensör Ağı',            s: 'Tüm yeni binalarda BMS entegrasyonu', pct: 100 },
    ],
    positions: [
      { id: 'pos1', team: 'Tasarım',           title: 'Kıdemli Mimar',     loc: 'İstanbul', type: 'Tam zamanlı' },
      { id: 'pos2', team: 'İnşaat',            title: 'Şantiye Şefi',      loc: 'Ankara',   type: 'Tam zamanlı' },
      { id: 'pos3', team: 'BIM',               title: 'BIM Koordinatörü',  loc: 'İstanbul', type: 'Tam zamanlı' },
      { id: 'pos4', team: 'Mühendislik',       title: 'Statik Mühendisi',  loc: 'İzmir',    type: 'Tam zamanlı' },
      { id: 'pos5', team: 'Sürdürülebilirlik', title: 'LEED Danışmanı',    loc: 'İstanbul', type: 'Tam zamanlı' },
      { id: 'pos6', team: 'Operasyon',         title: 'Satınalma Uzmanı',  loc: 'Ankara',   type: 'Tam zamanlı' },
      { id: 'pos7', team: 'Tasarım',           title: 'Stajyer Mimar',     loc: 'İstanbul', type: 'Staj' },
      { id: 'pos8', team: 'Pazarlama',         title: 'İçerik Üreticisi',  loc: 'İstanbul', type: 'Yarı zamanlı' },
    ],
    values: [
      { id: 'vl1', num: '01', title: 'Zamana saygı',         text: 'Söz verdiğimiz tarih, yatırımcının planıdır. 38 yılda söz verdiğimiz tek bir teslimi kaçırmadık.' },
      { id: 'vl2', num: '02', title: 'Uzlaşmaz mühendislik', text: 'Estetik ile statiği birbirinin alternatifi değil, bir bütünün iki yarısı olarak görürüz.' },
      { id: 'vl3', num: '03', title: 'Yere ait olmak',       text: 'Her projeyi bulunduğu coğrafyanın, iklimin ve kültürün sözcüsü olarak tasarlarız.' },
      { id: 'vl4', num: '04', title: 'Şeffaf hesap',         text: 'Yatırımcılarımıza her hafta —istisnasız her hafta— ilerleme raporu sunarız.' },
    ],
    offices: [
      { id: 'of1', c: 'Ankara', a: 'Bilkent Plaza A2' },
      { id: 'of2', c: 'İzmir',  a: 'Alsancak No:88' },
      { id: 'of3', c: 'Bodrum', a: 'Yalıkavak Şantiyesi' },
    ],
    messages: [
      {
        id: 'msg1',
        name: 'Kemal Soylu',
        email: 'k.soylu@soyluholding.com.tr',
        phone: '+90 532 410 88 12',
        subject: 'Yeni proje görüşmesi',
        message: 'Maslak bölgesindeki 18.000 m² arsamız üzerinde planladığımız A+ ofis ve ticari karma proje için anahtar teslim müteahhitlik teklifinizi almak istiyoruz.',
        status: 'unread',
        createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
      {
        id: 'msg2',
        name: 'Zeynep Karahan',
        email: 'zeynep@karahanmimarlik.com',
        phone: '+90 544 812 34 09',
        subject: 'Yatırım fırsatı',
        message: 'Çeşme Marina Villas etabında kalan son 2 villa için kurumsal portföyümüz adına yerinde sunum randevusu rica ediyoruz.',
        status: 'unread',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      },
      {
        id: 'msg3',
        name: 'Murat Özdemir',
        email: 'm.ozdemir@eko-yapi.com.tr',
        phone: '+90 216 390 21 44',
        subject: 'Tedarikçi başvurusu',
        message: 'CEM III/B düşük karbonlu çimento ve EPD belgeli prefabrik cephe panelleri tedarikçisi olarak onaylı tedarikçi havuzunuza başvurmak isteriz.',
        status: 'read',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
      },
    ],
    applications: [
      {
        id: 'app1',
        name: 'Elif Çelik',
        email: 'elif.celik@itu.edu.tr',
        phone: '+90 533 619 40 22',
        team: 'Kıdemli Mimar (İstanbul)',
        portfolio: 'https://behance.net/elifcelik-arch',
        message: '11 yıldır yüksek katlı konut ve karma kullanım projelerinde tasarım yürütücüsü olarak görev alıyorum. Revit ve BIM Level 2 süreçlerine tam hakimim.',
        status: 'new',
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'app2',
        name: 'Barış Kaya',
        email: 'bariskaya.bim@gmail.com',
        phone: '+90 505 741 92 10',
        team: 'BIM Koordinatörü (İstanbul)',
        portfolio: 'https://linkedin.com/in/bariskaya-bim',
        message: 'LOD-400 koordinasyon, Navisworks çakışma analizleri ve 4D/5D şantiye planlaması üzerine 7 yıllık saha ve merkez ofis deneyimim bulunuyor.',
        status: 'reviewing',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ],
    analytics: {
      totalViews: 4426,
      uniqueVisitors: 2989,
      avgSessionDurationSec: 214,
      bounceRatePct: 26.4,
      pageViews: {
        '/':                  1680,
        '/projeler':          1120,
        '/hakkimizda':         540,
        '/hizmetler':          430,
        '/surdurulebilirlik':  290,
        '/kariyer':            210,
        '/iletisim':           156,
      },
      projectClicks: {
        'p1': 412,
        'p2': 285,
        'p3': 340,
        'p4': 389,
        'p5': 260,
        'p6': 198,
        'p7': 142,
        'p8': 176,
        'p9': 164,
        'p10': 231,
      },
      devices: {
        desktop: 54,
        mobile: 38,
        tablet: 8,
      },
      sources: [
        { source: 'Organik Arama (Google)', visits: 1420, pct: 47.5 },
        { source: 'Doğrudan Trafik',        visits: 810,  pct: 27.1 },
        { source: 'LinkedIn Kurumsal',      visits: 430,  pct: 14.4 },
        { source: 'Instagram & Mimari Basın', visits: 329, pct: 11.0 },
      ],
      daily: buildDefaultDates(),
    },
    securityLogs: [
      {
        id: 'log1',
        type: 'SYSTEM_INIT',
        severity: 'info',
        ip: '127.0.0.1',
        detail: 'Güvenlik duvarı, PBKDF2-SHA512 kimlik doğrulama ve XSS filtreleme katmanı başlatıldı.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  };
}

let dbCache = null;

export function getDb() {
  if (dbCache) return dbCache;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      dbCache = JSON.parse(raw);
      return dbCache;
    }
  } catch (err) {
    console.error('[Chronos DB] Okuma hatası, varsayılan veritabanı oluşturuluyor:', err.message);
  }
  dbCache = createInitialSeed();
  saveDb(dbCache);
  return dbCache;
}

export function saveDb(nextDb = dbCache) {
  if (!nextDb) return;
  dbCache = nextDb;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(dbCache, null, 2), 'utf8');
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('[Chronos DB] Yazma hatası:', err.message);
  }
  syncNodeDbToFirebase(dbCache);
}

export function resetDbToDefault() {
  const currentAdmin = dbCache?.admin;
  const fresh = createInitialSeed();
  if (currentAdmin) {
    fresh.admin = currentAdmin;
  }
  saveDb(fresh);
  return fresh;
}

export function addSecurityLog(type, detail, ip = '127.0.0.1', severity = 'info') {
  const db = getDb();
  db.securityLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    severity,
    ip,
    detail,
    createdAt: new Date().toISOString(),
  });
  if (db.securityLogs.length > 100) {
    db.securityLogs = db.securityLogs.slice(0, 100);
  }
  saveDb(db);
}
