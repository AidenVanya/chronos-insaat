# Chronos İnşaat — Kurumsal Web Sitesi, Backend API & Yönetim Paneli

**Chronos İnşaat**, 1987'den bu yana konut, ticari yapı ve kentsel dönüşüm alanlarında faaliyet gösteren kurgusal bir mimarlık ve inşaat şirketi için tasarlanmış; **Node.js REST API**, **kurumsal güvenlik katmanı** ve **şifre korumalı kapsamlı Yönetim & Analitik Paneli (`#/panel`)** içeren tam yığın (full-stack) web uygulamasıdır.

---

## Yönetim Paneli (`#/panel`) ve Giriş Bilgileri

Site alt bilgisindeki (Footer) **"Yönetim Paneli"** bağlantısına tıklayarak veya tarayıcıdan doğrudan `/#/panel` (veya `/#/admin`) adresine giderek yönetim merkezine erişebilirsiniz:

- **Varsayılan Kullanıcı Adı:** `admin`
- **Varsayılan Şifre:** `Chronos2026!`
- *(Yönetim panelindeki **Güvenlik & Kayıtlar** sekmesinden kullanıcı adınızı ve şifrenizi istediğiniz zaman değiştirebilirsiniz.)*

### Yönetim Paneli Modülleri (10 Sekme)
1. **İstatistikler & Analitik**: Toplam görüntülenme, tekil ziyaretçi, dönüşüm oranı, son 14 günlük interaktif trafik grafiği, sayfa bazlı performans dağılımı, en çok incelenen projeler, trafik kaynakları ve cihaz dağılımı.
2. **Projeler Yönetimi (CRUD)**: Yeni proje ekleme, mevcut projelerin tüm detaylarını (*başlık, şehir, yıl, durum, kategori, m², kat, ünite, açıklama, görsel URL, anasayfada öne çıkarma*) düzenleme ve silme.
3. **Anasayfa & Vitrin**: Hero başlıkları, üst etiket, açıklama metni, Hero arka plan slaytları, *Sayılarla Chronos* sayaçları ve *Felsefemiz* değerleri yönetimi.
4. **Hizmetler & Süreç**: 6 ana uzmanlık alanını (ikon seçimi dahil) ve 5 adımlı çalışma sürecini düzenleme/ekleme/silme.
5. **Hakkımızda & Ekip**: Kurumsal hikaye, Vizyon/Misyon/Söz metinleri, *Zaman Çizelgesi* (1987–2024+) ve *Yönetim Kurulu* üyeleri yönetimi.
6. **Sürdürülebilirlik & Yorumlar**: Mühendislik KPI kartları (`−42%`, `NZEB`, `LEED`, `BIM 7D`), yeşil malzeme yüzdelik barları ve müşteri referans yorumları yönetimi.
7. **Kariyer & Başvurular**: Açık iş pozisyonlarını yönetme ve siteden gönderilen **iş/staj başvurularını** inceleme, durum değiştirme (*Yeni*, *İnceleniyor*, *Mülakat*, *Kabul*, *Red*) veya silme.
8. **İletişim Mesajları (Gelen Kutusu)**: İletişim formundan gelen teklif ve mesajları okuma, okundu/yanıtlandı olarak işaretleme ve silme.
9. **Genel Ayarlar & Tema**: Sitenin renk temasını (*Gece Mavisi & Altın*, *Kömür Grisi & Turuncu*, *Derin Siyah & Bronz*) canlı olarak değiştirme, marka adı, telefon, e-posta, adres, koordinatlar, bölge ofisleri ve **Fabrika Ayarlarına Sıfırlama**.
10. **Güvenlik & Denetim Kayıtları**: Yönetici şifresi değiştirme, aktif güvenlik protokolleri durumu ve tüm giriş/işlem hareketlerini IP ve zaman damgasıyla kaydeden **Denetim İzi (Audit Log)** tablosu.

---

## Güvenlik Mimarisi (`server/security.js`)

- **PBKDF2-HMAC-SHA512 Şifre Özetleme**: Yönetici şifresi düz metin (plaintext) olarak saklanmaz; `node:crypto` ile 100.000 iterasyon ve kriptografik tuz (salt) kullanılarak özetlenir (`timingSafeEqual` ile zamanlama saldırılarına karşı korumalı doğrulama).
- **HMAC-SHA256 İmzalı Oturum Jetonları**: Süreli (`12 saat TTL`) ve oturum kapatıldığında sunucu tarafında iptal edilen (token revocation) imzalı Bearer jetonları.
- **Brute-Force & Rate Limiting**: Yönetici girişinde 15 dakika içinde 5 başarısız denemeden sonra otomatik IP kilitleme ve genel API hız sınırlaması.
- **XSS & Prototip Kirliliği (Prototype Pollution) Temizliği**: Gelen tüm JSON gövdelerinde `<script>`, `<iframe>`, `javascript:`, olay dinleyicileri (`onerror=`, `onload=`) ve `__proto__`/`constructor` anahtarlarını temizleyen derin (recursive) girdi arındırıcı.
- **HTTP Güvenlik Başlıkları**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- **Honeypot Anti-Bot Koruması**: İletişim ve kariyer başvuru formlarında otomatik spam botlarını yakalayan gizli tuzak alanları.

---

## Kullanılan Teknolojiler

| Kategori | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Ön Yüz (Frontend)** | **React 18** (`^18.3.1`) | Bileşen tabanlı UI mimarisi, `SiteContext` ile canlı veri senkronizasyonu |
| **Arka Uç (Backend)** | **Node.js HTTP & Connect API** | `/api/*` REST uç noktaları, hem Vite geliştirme sunucusuna entegre hem de bağımsız (`server/index.js`) çalışabilir mimari |
| **Veritabanı** | **Atomik JSON Veri Deposu** | `server/data/db.json` üzerinde geçici dosya yeniden adlandırma (`tmp -> rename`) ile bozulmaya dayanıklı kalıcı depolama |
| **Güvenlik** | **Node `crypto` Modülü** | PBKDF2-SHA512, HMAC-SHA256, `timingSafeEqual`, Rate Limiter, XSS Sanitizer |
| **Derleyici** | **Vite 5** (`^5.4.10`) | Özel `chronosBackendPlugin` ara katmanı ile tek komutta tam yığın (full-stack) çalışma |
| **Stil & Tasarım** | **Modern CSS3** | CSS Custom Properties, CSS Grid, Flexbox, `clamp()` akışkan tipografi, 3 dinamik renk teması |

---

## Proje Dizin Yapısı

```text
Chronos-insaat/
├── index.html                  # Giriş HTML dosyası ve Google Fonts
├── package.json                # Proje bağımlılıkları ve betikler
├── vite.config.js              # Vite + Chronos Backend API ara katman eklentisi
├── server/
│   ├── index.js                # Bağımsız üretim (production) HTTP + API sunucusu
│   ├── api.js                  # Tüm /api/* REST uç noktaları ve yetkilendirme kontrolleri
│   ├── db.js                   # Kalıcı veritabanı yönetimi (server/data/db.json) ve varsayılan veriler
│   └── security.js             # PBKDF2, HMAC Token, Rate Limiter, XSS Sanitizer, Güvenlik Başlıkları
└── src/
    ├── main.jsx                # React DOM başlangıç noktası
    ├── App.jsx                 # Ana uygulama bileşeni, rota eşleştirmeleri ve analitik izleyici
    ├── data.js                 # Varsayılan başlangıç verileri
    ├── styles.css              # Tasarım token'ları, duyarlı (responsive) grid ve yönetim paneli stilleri
    ├── context/
    │   └── SiteContext.jsx     # Canlı site verisi, tema yönetimi ve analitik takip sağlayıcısı
    ├── components/             # Ortak UI bileşenleri (NavBar, Footer, ProjectCard, Parallax, vb.)
    └── routes/
        ├── AdminPage.jsx       # Şifre korumalı 10 sekmeli Yönetim ve Analitik Paneli
        ├── HomePage.jsx        # Anasayfa
        ├── AboutPage.jsx       # Hakkımızda
        ├── ProjectsPage.jsx    # Projeler
        ├── ServicesPage.jsx    # Hizmetler
        ├── SustainPage.jsx     # Sürdürülebilirlik & Teknoloji
        ├── CareersPage.jsx     # Kariyer & Başvuru Formu
        └── ContactPage.jsx     # İletişim & İnteraktif Harita
```

---

## Kurulum ve Çalıştırma

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme ortamını başlatın (Frontend + Backend API birlikte çalışır):**
   ```bash
   npm run dev
   ```

3. **Üretim (Production) derlemesi alın ve bağımsız Node sunucusunu başlatın:**
   ```bash
   npm run build
   npm start
   ```
