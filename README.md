# Chronos İnşaat — Kurumsal Web Sitesi

**Chronos İnşaat**, 1987'den bu yana konut, ticari yapı ve kentsel dönüşüm alanlarında faaliyet gösteren kurgusal bir mimarlık ve inşaat şirketi için tasarlanmış modern, çok sayfalı ve tam duyarlı (responsive) kurumsal web uygulamasıdır.

---

## Öne Çıkan Özellikler

- **7 Tam Kapsamlı Sayfa**:
  - **Anasayfa (`/`)**: Otomatik geçişli (Ken Burns efektli) tam ekran hero vitrini, kayan proje şeridi (marquee), kurumsal değerler, öne çıkan projeler, animasyonlu sayaçlar, müşteri yorumları ve çağrı alanı.
  - **Hakkımızda (`/hakkimizda`)**: Paralaks görsel vitrini, vizyon/misyon/söz ilkeleri, dikey zaman çizelgesi (1987–2024) ve yönetim kurulu tanıtımı.
  - **Projeler (`/projeler`)**: Durum (*Devam Eden*, *Tamamlanan*) ve kategori (*Konut*, *Ticari*, *Kentsel Dönüşüm*) bazlı anlık proje filtreleme ve cam efektli (glassmorphism) detay kartları.
  - **Hizmetler (`/hizmetler`)**: 6 ana uzmanlık alanı ve 5 adımlı uçtan uca inşaat/BIM süreç akışı.
  - **Sürdürülebilirlik & Teknoloji (`/surdurulebilirlik`)**: NZEB & LEED metrikleri, animasyonlu SVG yaşam döngüsü karbon şeması, malzeme disiplini oranları ve 7D BIM dijital ikiz altyapısı.
  - **Kariyer (`/kariyer`)**: Departman bazlı açık pozisyon filtreleme, pozisyon seçimiyle otomatik doldurulan ve doğrulamalı (validation) başvuru formu.
  - **İletişim (`/iletisim`)**: İletişim bilgileri, bölge ofisleri, doğrulamalı iletişim formu ve yakınlaştırılabilir (`+`/`−`) özel SVG karanlık mod İstanbul haritası.
- **Perde (Curtain) Sayfa Geçişleri**: Sayfalar arasında 5 panelli akıcı perde animasyonu ve özel SVG marka monogramı.
- **Scroll Tabanlı Animasyonlar**: `IntersectionObserver` tabanlı maskeli başlık açılışları (`MaskLines`), görünürlük geçişleri (`Reveal`) ve sayı saydırma (`CountUp`) bileşenleri (`prefers-reduced-motion` destekli).
- **Tüm Cihazlarla Tam Uyumluluk**: Mobil (`320px+`), tablet, dizüstü ve geniş ekran masaüstü cihazlar için optimize edilmiş CSS Grid ve akışkan tipografi (`clamp()`) mimarisi.
- **Tema Altyapısı**: CSS değişkenleri (`custom properties`) ile kurgulanan `midnight-gold` (Gece Mavisi & Altın), varsayılan Kömür Grisi & İnşaat Turuncusu ve `black-bronze` (Derin Siyah & Bronz) renk temaları.

---

## Kullanılan Teknolojiler

| Kategori | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Arayüz Kütüphanesi** | **React 18** (`^18.3.1`) | Bileşen tabanlı UI mimarisi, React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`, `useContext`) |
| **Derleyici & Geliştirme Sunucusu** | **Vite 5** (`^5.4.10`) | Hızlı HMR (Hot Module Replacement) ve optimize edilmiş üretim (production) paketlemesi |
| **Yönlendirme (Routing)** | **Özel Hash Router** | Harici bağımlılık gerektirmeyen, perde animasyonlu Context API + `window.location.hash` yönlendiricisi |
| **Stil & Tasarım Sistemi** | **Modern CSS3** | CSS Custom Properties (Design Tokens), CSS Grid, Flexbox, `clamp()` akışkan tipografi, `backdrop-filter` |
| **Tipografi** | **Google Fonts** | Başlıklar için *Fraunces* (Variable Serif), metinler için *Hanken Grotesk*, teknik etiketler için *JetBrains Mono* |
| **Grafik & İkonlar** | **Özel SVG** | Sıfır harici ikon paketi; özel çizim mimari ikon seti, karbon diyagramı, interaktif vektörel harita ve monogram logo |

---

## Proje Dizin Yapısı

```text
Chronos-insaat/
├── index.html                  # Giriş HTML dosyası, Google Fonts ve tema tanımı
├── package.json                # Proje bağımlılıkları ve betikler (scripts)
├── vite.config.js              # Vite yapılandırması
└── src/
    ├── main.jsx                # React DOM başlangıç noktası
    ├── App.jsx                 # Ana uygulama bileşeni ve rota eşleştirmeleri
    ├── data.js                 # Tüm proje, istatistik, hizmet, zaman çizelgesi ve kariyer verileri
    ├── styles.css              # Tasarım token'ları, global stiller ve duyarlı (responsive) grid sistemi
    ├── components/
    │   ├── animations.jsx      # Reveal, MaskLines ve CountUp animasyon bileşenleri
    │   ├── BrandMark.jsx       # Özel SVG Chronos monogram logosu
    │   ├── Footer.jsx          # Canlı İstanbul saati içeren kurumsal alt bilgi alanı
    │   ├── Icon.jsx            # Vektörel mimari ve arayüz ikonları
    │   ├── NavBar.jsx          # Sabit üst menü ve tam ekran mobil navigasyon
    │   ├── PageHeader.jsx      # Alt sayfalar için ortak üst başlık bileşeni
    │   ├── Parallax.jsx        # Sınırlandırılmış (clamped) kaydırma paralaks bileşeni
    │   ├── ProjectCard.jsx     # Hover/detay katmanlı proje tanıtım kartı
    │   └── Router.jsx          # Hash tabanlı yönlendirici ve perde geçiş animasyonu
    └── routes/
        ├── HomePage.jsx        # Anasayfa
        ├── AboutPage.jsx       # Hakkımızda sayfası
        ├── ProjectsPage.jsx    # Projeler ve filtreleme sayfası
        ├── ServicesPage.jsx    # Hizmetler ve süreç sayfası
        ├── SustainPage.jsx     # Sürdürülebilirlik & Teknoloji sayfası
        ├── CareersPage.jsx     # Kariyer ve başvuru sayfası
        └── ContactPage.jsx     # İletişim ve interaktif harita sayfası
```

---

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için **Node.js** (v18 veya üzeri önerilir) kurulu olmalıdır.

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/AidenVanya/chronos-insaat.git
   cd chronos-insaat
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

4. **Üretim (Production) derlemesi alın:**
   ```bash
   npm run build
   ```

5. **Üretim derlemesini önizleyin:**
   ```bash
   npm run preview
   ```

---

## Lisans

Bu proje eğitim ve portföy amaçlı geliştirilmiştir. Tüm hakları saklıdır © Chronos İnşaat.
