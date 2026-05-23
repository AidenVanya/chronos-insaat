// data.js — Chronos İnşaat content & data (Turkish)

export const ROUTES = [
  { id: 'home',     path: '/',                 label: 'Anasayfa',     num: '01' },
  { id: 'about',    path: '/hakkimizda',       label: 'Hakkımızda',   num: '02' },
  { id: 'projects', path: '/projeler',         label: 'Projeler',     num: '03' },
  { id: 'services', path: '/hizmetler',        label: 'Hizmetler',    num: '04' },
  { id: 'sustain',  path: '/surdurulebilirlik',label: 'Sürdürülebilirlik', num: '05' },
  { id: 'careers',  path: '/kariyer',          label: 'Kariyer',      num: '06' },
  { id: 'contact',  path: '/iletisim',         label: 'İletişim',     num: '07' },
];

// Architectural / construction photography from Unsplash (public photo IDs).
export const IMG = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HERO_SLIDES = [
  { img: IMG('1487958449943-2429e8be8625', 2000), label: 'Maslak 1453 / 2024' },
  { img: IMG('1486325212027-8081e485255e', 2000), label: 'Karaköy Loft / 2023' },
  { img: IMG('1545324418-cc1a3fa10c00',    2000), label: 'Bebek Rezidans / 2025' },
  { img: IMG('1600585154340-be6161a56a0c', 2000), label: 'Çeşme Villaları / 2024' },
];

export const PROJECTS = [
  { id: 'p1', name: 'Maslak Vertikal',     loc: 'İstanbul',  year: 2024, status: 'tamamlanan', type: 'konut',
    img: IMG('1487958449943-2429e8be8625'), area: '74.000 m²', floors: 42, units: 188,
    note: '42 katlı premium rezidans — Boğaz manzaralı 188 ünite, LEED Platinum sertifikalı.' },
  { id: 'p2', name: 'Karaköy Loft No.7',    loc: 'İstanbul',  year: 2023, status: 'tamamlanan', type: 'konut',
    img: IMG('1486325212027-8081e485255e'), area: '12.400 m²', floors: 7, units: 38,
    note: 'Tarihi yapının özüne dokunmadan modern bir mimariye taşınması — restorasyon ve rezidans birlikteliği.' },
  { id: 'p3', name: 'Levent İş Kulesi',    loc: 'İstanbul',  year: 2025, status: 'devam-eden', type: 'ticari',
    img: IMG('1486406146926-c627a92ad1ab'), area: '108.000 m²', floors: 38, units: 0,
    note: '38 katlı A+ ofis kulesi — NZEB (neredeyse sıfır enerjili bina) standardında inşa ediliyor.' },
  { id: 'p4', name: 'Bebek Cliff Residences', loc: 'İstanbul', year: 2025, status: 'devam-eden', type: 'konut',
    img: IMG('1545324418-cc1a3fa10c00'),    area: '22.000 m²', floors: 9, units: 24,
    note: 'Boğaz yamacında 24 ultra-lüks daire — özel iskele ve helikopter pisti.' },
  { id: 'p5', name: 'Çeşme Marina Villas',  loc: 'İzmir',     year: 2024, status: 'tamamlanan', type: 'konut',
    img: IMG('1600585154340-be6161a56a0c'), area: '38.500 m²', floors: 3, units: 31,
    note: 'Ege kıyısında 31 mimari villa — taş, ahşap ve cam ile yerel dokuya tutkulu bir cevap.' },
  { id: 'p6', name: 'Esenyurt Dönüşüm Bloğu', loc: 'İstanbul', year: 2024, status: 'tamamlanan', type: 'donusum',
    img: IMG('1502005229762-cf1b2da7c5d6'), area: '146.000 m²', floors: 18, units: 612,
    note: 'Kentsel dönüşüm — 612 hane, 18 katlı 6 blok, sosyal donatı alanlarıyla mahalle ölçeğinde yenileme.' },
  { id: 'p7', name: 'Eskişehir Tech Park', loc: 'Eskişehir', year: 2025, status: 'devam-eden', type: 'ticari',
    img: IMG('1496307653780-42ee777d4833'), area: '54.000 m²', floors: 6, units: 0,
    note: 'Teknopark kampüsü — yedi blok arasında yarı kapalı bir avlu sistemi.' },
  { id: 'p8', name: 'Ankara Civic Plaza',  loc: 'Ankara',    year: 2026, status: 'devam-eden', type: 'ticari',
    img: IMG('1518709268805-4e9042af2176'), area: '92.000 m²', floors: 12, units: 0,
    note: 'Kamu hizmet binası — ışık ve şeffaflığı temel ilke alan bir tasarım.' },
  { id: 'p9', name: 'Fikirtepe Yeni Mahalle', loc: 'İstanbul', year: 2023, status: 'tamamlanan', type: 'donusum',
    img: IMG('1564540583246-934409427776'), area: '215.000 m²', floors: 16, units: 980,
    note: '980 hanelik kentsel dönüşüm — bölgenin en büyük entegre yenileme projesi.' },
  { id: 'p10', name: 'Bodrum Cove Hotel',  loc: 'Muğla',     year: 2025, status: 'devam-eden', type: 'ticari',
    img: IMG('1582719508461-905c673771fd'), area: '28.000 m²', floors: 4, units: 96,
    note: '96 odalı butik otel — denizle bütünleşik teraslı bir kompozisyon.' },
];

export const STATS = [
  { num: 38,  suffix: '+', label: 'yıllık deneyim' },
  { num: 142, suffix: '',  label: 'tamamlanan proje' },
  { num: 2.4, suffix: 'M m²', label: 'inşa edilen alan', decimals: 1 },
  { num: 16,  suffix: '',  label: 'şehirde aktif' },
];

export const SERVICES = [
  { num: '01', name: 'Mimari Tasarım',
    desc: 'Konsept geliştirmeden uygulama projelerine kadar tüm tasarım sürecini bünyemizdeki 38 kişilik tasarım ekibimizle yönetiyoruz.',
    icon: 'pen' },
  { num: '02', name: 'Genel Müteahhitlik',
    desc: 'Anahtar teslim inşaat — temel atımdan ince işlere, kalite kontrolden teslim sonrası garantiye tüm sorumluluk bizde.',
    icon: 'crane' },
  { num: '03', name: 'Kentsel Dönüşüm',
    desc: 'Hak sahibi vatandaşlardan belediyelere uzanan paydaş yönetimi ile şehir ölçeğinde dönüşüm projeleri.',
    icon: 'city' },
  { num: '04', name: 'Proje & İnşaat Yönetimi',
    desc: 'Üçüncü taraf projelerinizde maliyet, zaman ve kalite üçgenini bir PMI sertifikalı ekip ile garanti altına alıyoruz.',
    icon: 'chart' },
  { num: '05', name: 'Restorasyon',
    desc: 'Tarihi yapıların özünü koruyarak modern yaşama dahil edilmesi — Vakıflar Genel Müdürlüğü onaylı uygulamalar.',
    icon: 'arch' },
  { num: '06', name: 'BIM & Dijital İkiz',
    desc: 'LOD-400 BIM modelleri ve sahaya senkron dijital ikiz yaklaşımı ile sıfır revizyon hedefliyoruz.',
    icon: 'cube' },
];

export const TIMELINE = [
  { year: 1987, title: 'Kuruluş',
    text: 'Mehmet Doğan, beş kişilik bir mimari ofis olarak Chronos\'u Ankara\'da kuruyor.' },
  { year: 1994, title: 'İlk büyük ölçekli proje',
    text: 'Bilkent Plaza\'nın inşaatı tamamlanıyor — şirket için bir dönüm noktası.' },
  { year: 2003, title: 'İstanbul ofisi açılıyor',
    text: 'Levent\'te yeni genel merkez. Şirket 80 kişilik bir ekibe ulaşıyor.' },
  { year: 2011, title: 'Uluslararası açılım',
    text: 'Tiflis ve Bakü\'de iki ofis ve dört aktif proje. İlk LEED Gold sertifikalı bina.' },
  { year: 2018, title: 'Dijital dönüşüm',
    text: 'Tüm projeler BIM Level 2 standardında. Saha-ofis senkron çalışan dijital ikiz sistemi devreye giriyor.' },
  { year: 2024, title: 'Sürdürülebilirlik öncelikli',
    text: 'Tüm yeni projelerde NZEB hedefi. Beton karışımında %60 azaltılmış karbon ayak izi.' },
];

export const TESTIMONIALS = [
  { name: 'Ayşe Kuzu', role: 'CEO, Kuzu Grup',
    quote: '"Chronos\'la 11 yıllık ortaklığımız sırasında tek bir teslim tarihi kaçırılmadı. Bu sektörde duyulmuş bir şey değil."' },
  { name: 'Doğan Arıkan', role: 'Mimar, AAA Studio',
    quote: '"Tasarım dilimize saygılı, mühendislik anlamında uzlaşmaz. Birlikte çalışmak, projeyi olduğundan iyi yapar."' },
  { name: 'Selin Yılmaz', role: 'Yatırım Direktörü, Argon Capital',
    quote: '"Yatırımcı tarafında en çok aradığımız şey öngörülebilirlik. Chronos\'un raporlama disiplini sektörde fark yaratıyor."' },
  { name: 'Erkan Demir', role: 'Belediye Başkanı, Eskişehir',
    quote: '"Tech Park projesinde belediye paydaşlığını gerçek anlamda yaşadık. Bürokratik değil, ortak çözen bir ekip."' },
];

export const TECH_FEATURES = [
  { kpi: '−42%', title: 'CO₂ Ayak İzi',
    text: 'Düşük karbonlu çimento ve geri dönüştürülmüş agrega kullanımı ile geleneksel betona kıyasla 42% emisyon azaltımı.' },
  { kpi: 'NZEB', title: 'Neredeyse Sıfır Enerji',
    text: 'Çatı ve cephe entegre PV panelleri, jeotermal ısı pompaları ve akıllı bina yönetim sistemleri.' },
  { kpi: 'LEED', title: 'Platinum Sertifikasyon',
    text: 'Tüm yeni projelerimiz LEED Platinum hedefiyle başlatılıyor; 14 projemiz şu anda Platinum sahibi.' },
  { kpi: 'BIM 7D', title: 'Dijital İkiz',
    text: 'Tasarımdan teslim sonrası bakıma uzanan 7D BIM modelleri — gerçek zamanlı sensör verisi ile beslenir.' },
];

export const POSITIONS = [
  { team: 'Tasarım', title: 'Kıdemli Mimar', loc: 'İstanbul', type: 'Tam zamanlı' },
  { team: 'İnşaat', title: 'Şantiye Şefi', loc: 'Ankara',   type: 'Tam zamanlı' },
  { team: 'BIM',    title: 'BIM Koordinatörü', loc: 'İstanbul', type: 'Tam zamanlı' },
  { team: 'Mühendislik', title: 'Statik Mühendisi', loc: 'İzmir', type: 'Tam zamanlı' },
  { team: 'Sürdürülebilirlik', title: 'LEED Danışmanı', loc: 'İstanbul', type: 'Tam zamanlı' },
  { team: 'Operasyon', title: 'Satınalma Uzmanı', loc: 'Ankara', type: 'Tam zamanlı' },
  { team: 'Tasarım', title: 'Stajyer Mimar', loc: 'İstanbul', type: 'Staj' },
  { team: 'Pazarlama', title: 'İçerik Üreticisi', loc: 'İstanbul', type: 'Yarı zamanlı' },
];

export const VALUES = [
  { num: '01', title: 'Zamana saygı',
    text: 'Söz verdiğimiz tarih, yatırımcının planıdır. 38 yılda söz verdiğimiz tek bir teslimi kaçırmadık.' },
  { num: '02', title: 'Uzlaşmaz mühendislik',
    text: 'Estetik ile statiği birbirinin alternatifi değil, bir bütünün iki yarısı olarak görürüz.' },
  { num: '03', title: 'Yere ait olmak',
    text: 'Her projeyi bulunduğu coğrafyanın, iklimin ve kültürün sözcüsü olarak tasarlarız.' },
  { num: '04', title: 'Şeffaf hesap',
    text: 'Yatırımcılarımıza her hafta —istisnasız her hafta— ilerleme raporu sunarız.' },
];
