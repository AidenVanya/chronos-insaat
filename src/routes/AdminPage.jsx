import { useCallback, useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteContext.jsx';
import { useRouter } from '../components/Router.jsx';
import { BrandMark } from '../components/BrandMark.jsx';
import { Icon } from '../components/Icon.jsx';

const TOKEN_KEY = 'chronos_admin_token';

const TABS = [
  { id: 'overview',  label: 'İstatistikler & Analitik', icon: 'chart' },
  { id: 'projects',  label: 'Projeler',                 icon: 'city' },
  { id: 'home',      label: 'Anasayfa & Vitrin',        icon: 'cube' },
  { id: 'services',  label: 'Hizmetler & Süreç',        icon: 'crane' },
  { id: 'about',     label: 'Hakkımızda & Ekip',        icon: 'arch' },
  { id: 'sustain',   label: 'Sürdürülebilirlik & Yorum', icon: 'leaf' },
  { id: 'careers',   label: 'Kariyer & Başvurular',     icon: 'users' },
  { id: 'messages',  label: 'İletişim Mesajları',       icon: 'mail' },
  { id: 'settings',  label: 'Genel Ayarlar & Tema',     icon: 'settings' },
  { id: 'security',  label: 'Güvenlik & Kayıtlar',      icon: 'shield' },
];

export function AdminPage() {
  const { go } = useRouter();
  const { site, refreshPublicData, updateLocalSection } = useSiteData();

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [authChecking, setAuthChecking] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchDashboard = useCallback(async (activeToken = token) => {
    if (!activeToken) {
      setAuthChecking(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setDashboard(null);
        setAuthChecking(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDashboard(data);
      }
    } catch {
      showToast('Sunucu bağlantısı kurulamadı.', 'error');
    } finally {
      setAuthChecking(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (token) {
      fetchDashboard(token);
    }
  }, [token, fetchDashboard]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setDashboard(null);
  };

  const saveSection = async (section, data, successMsg = 'Değişiklikler kaydedildi ve sitede yayına alındı.') => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || 'Kaydetme hatası oluştu.', 'error');
        return false;
      }
      setDashboard((prev) => (prev ? { ...prev, [section]: json.data } : prev));
      updateLocalSection(section, json.data);
      await refreshPublicData();
      showToast(successMsg, 'success');
      return true;
    } catch {
      showToast('Sunucuya bağlanılamadı.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (authChecking) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', paddingTop: 80 }}>
        <div className="label-mono">Güvenli oturum doğrulanıyor...</div>
      </main>
    );
  }

  if (!token || !dashboard) {
    return (
      <AdminLogin
        onSuccess={(newToken) => {
          localStorage.setItem(TOKEN_KEY, newToken);
          setToken(newToken);
          setAuthChecking(true);
        }}
        onBack={() => go('/')}
      />
    );
  }

  const unreadMsgCount = (dashboard.messages || []).filter((m) => m.status === 'unread').length;
  const newAppCount = (dashboard.applications || []).filter((a) => a.status === 'new').length;

  return (
    <main className="admin-shell">
      {toast && (
        <div className={`admin-toast ${toast.type === 'error' ? 'error' : ''}`}>
          <Icon name={toast.type === 'error' ? 'shield' : 'check'} size={18} />
          <span>{toast.text}</span>
        </div>
      )}

      <div className="container" style={{ paddingTop: 'clamp(104px, 12vw, 136px)', paddingBottom: 80 }}>
        {/* Admin Top Bar */}
        <div className="admin-topbar surface">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BrandMark size={40} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>Chronos Yönetim Merkezi</span>
                <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  <span className="dot"></span>Güvenli Oturum ({dashboard.adminUser?.username || 'admin'})
                </span>
              </div>
              <div className="label-mono" style={{ marginTop: 4 }}>
                PBKDF2-SHA512 · Canlı İçerik & Analitik Kontrol Paneli
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="btn" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => fetchDashboard(token)}>
              <Icon name="refresh" size={16} /> Verileri Yenile
            </button>
            <button type="button" className="btn" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => go('/')}>
              <Icon name="eye" size={16} /> Siteyi Gör
            </button>
            <button type="button" className="btn" style={{ padding: '10px 16px', fontSize: 13, borderColor: '#e44', color: '#ff8a8a' }} onClick={handleLogout}>
              <Icon name="logout" size={16} /> Çıkış Yap
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="admin-layout">
          <aside className="admin-sidebar surface">
            <div className="label-mono" style={{ padding: '6px 12px 12px', borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
              Modüller
            </div>
            <nav className="admin-nav">
              {TABS.map((t) => {
                const badge =
                  t.id === 'messages' ? unreadMsgCount :
                  t.id === 'careers'  ? newAppCount : 0;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`admin-nav-btn ${activeTab === t.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    <Icon name={t.icon} size={18} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{t.label}</span>
                    {badge > 0 && <span className="admin-badge">{badge}</span>}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="admin-content">
            {activeTab === 'overview' && (
              <OverviewTab dashboard={dashboard} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab
                projects={dashboard.projects || site.projects}
                saving={saving}
                onSave={(next) => saveSection('projects', next, 'Projeler listesi güncellendi.')}
              />
            )}
            {activeTab === 'home' && (
              <HomeContentTab
                dashboard={dashboard}
                saving={saving}
                onSaveSection={saveSection}
              />
            )}
            {activeTab === 'services' && (
              <ServicesContentTab
                dashboard={dashboard}
                saving={saving}
                onSaveSection={saveSection}
              />
            )}
            {activeTab === 'about' && (
              <AboutContentTab
                dashboard={dashboard}
                saving={saving}
                onSaveSection={saveSection}
              />
            )}
            {activeTab === 'sustain' && (
              <SustainContentTab
                dashboard={dashboard}
                saving={saving}
                onSaveSection={saveSection}
              />
            )}
            {activeTab === 'careers' && (
              <CareersAdminTab
                dashboard={dashboard}
                token={token}
                saving={saving}
                onSaveSection={saveSection}
                onUpdateApplications={(apps) => setDashboard((p) => ({ ...p, applications: apps }))}
                showToast={showToast}
              />
            )}
            {activeTab === 'messages' && (
              <MessagesAdminTab
                messages={dashboard.messages || []}
                token={token}
                onUpdateMessages={(msgs) => setDashboard((p) => ({ ...p, messages: msgs }))}
                showToast={showToast}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsAdminTab
                dashboard={dashboard}
                token={token}
                saving={saving}
                onSaveSection={saveSection}
                onResetSuccess={(fresh) => {
                  setDashboard((p) => ({ ...p, ...fresh }));
                  refreshPublicData();
                  showToast('Tüm site verileri fabrika ayarlarına döndürüldü.', 'success');
                }}
                showToast={showToast}
              />
            )}
            {activeTab === 'security' && (
              <SecurityAdminTab
                dashboard={dashboard}
                token={token}
                showToast={showToast}
                onLogsUpdated={(logs) => setDashboard((p) => ({ ...p, securityLogs: logs }))}
                onUserUpdated={(username) => setDashboard((p) => ({ ...p, adminUser: { ...p.adminUser, username } }))}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   LOGIN SCREEN
   ────────────────────────────────────────────────────────────────────────── */
function AdminLogin({ onSuccess, onBack }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Giriş başarısız.');
      } else if (data.token) {
        onSuccess(data.token);
      }
    } catch {
      setError('Sunucu ile bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '110px var(--gutter) 60px' }}>
      <div className="surface" style={{ width: '100%', maxWidth: 460, padding: 'clamp(28px, 5vw, 44px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <BrandMark size={42} />
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>Yönetim Paneli</div>
            <div className="label-mono">Chronos Güvenlik Katmanı</div>
          </div>
        </div>

        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          Site içeriklerini, projeleri, gelen mesajları ve canlı ziyaretçi istatistiklerini yönetmek için kimlik doğrulaması yapın.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="field">
            <label>Kullanıcı Adı</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Yönetici Şifresi</label>
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="label-mono"
                style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: 10 }}
              >
                {showPass ? 'Gizle' : 'Göster'}
              </button>
            </div>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(238,68,68,0.12)', border: '1px solid rgba(238,68,68,0.4)', color: '#ff8a8a', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Doğrulanıyor...' : 'Güvenli Giriş Yap'}
            <span className="btn-arrow">→</span>
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="label-mono" style={{ fontSize: 10 }}>
            Varsayılan: <strong style={{ color: 'var(--text)' }}>admin</strong> / <strong style={{ color: 'var(--accent)' }}>Chronos2026!</strong>
          </span>
          <button type="button" className="btn-ghost" onClick={onBack}>← Siteye Dön</button>
        </div>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 1: OVERVIEW & ANALYTICS
   ────────────────────────────────────────────────────────────────────────── */
function OverviewTab({ dashboard, onNavigateTab }) {
  const analytics = dashboard.analytics || {};
  const daily = analytics.daily || [];
  const pageViews = analytics.pageViews || {};
  const projectClicks = analytics.projectClicks || {};
  const projects = dashboard.projects || [];
  const messages = dashboard.messages || [];
  const applications = dashboard.applications || [];

  const maxDailyViews = Math.max(1, ...daily.map((d) => d.views || 0));
  const totalPageViewsSum = Math.max(1, Object.values(pageViews).reduce((a, b) => a + b, 0));

  const routeNames = {
    '/': 'Anasayfa',
    '/projeler': 'Projeler',
    '/hakkimizda': 'Hakkımızda',
    '/hizmetler': 'Hizmetler',
    '/surdurulebilirlik': 'Sürdürülebilirlik',
    '/kariyer': 'Kariyer',
    '/iletisim': 'İletişim',
  };

  const totalLeads = messages.length + applications.length;
  const conversionRate = analytics.uniqueVisitors
    ? ((totalLeads / analytics.uniqueVisitors) * 100).toFixed(2)
    : '1.85';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="surface" style={{ padding: 22 }}>
          <div className="label-mono">Toplam Görüntülenme</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--accent)', margin: '10px 0 6px' }}>
            {(analytics.totalViews || 0).toLocaleString('tr-TR')}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>Tüm sayfa gösterimleri</div>
        </div>

        <div className="surface" style={{ padding: 22 }}>
          <div className="label-mono">Tekil Ziyaretçi</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--text)', margin: '10px 0 6px' }}>
            {(analytics.uniqueVisitors || 0).toLocaleString('tr-TR')}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>Ort. süre: {analytics.avgSessionDurationSec || 214} sn</div>
        </div>

        <div className="surface" style={{ padding: 22, cursor: 'pointer' }} onClick={() => onNavigateTab('messages')}>
          <div className="label-mono">İletişim & Teklif</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--accent)', margin: '10px 0 6px' }}>
            {messages.length}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>
            {messages.filter((m) => m.status === 'unread').length} okunmamış mesaj →
          </div>
        </div>

        <div className="surface" style={{ padding: 22, cursor: 'pointer' }} onClick={() => onNavigateTab('careers')}>
          <div className="label-mono">İş Başvuruları & Dönüşüm</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--text)', margin: '10px 0 6px' }}>
            {applications.length} <span style={{ fontSize: 18, color: 'var(--accent)' }}>(%{conversionRate})</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>
            {projects.length} aktif proje yayında →
          </div>
        </div>
      </div>

      {/* 14-Day Traffic Bar Chart */}
      <div className="surface" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Ziyaretçi Trafiği</div>
            <h3 style={{ fontSize: 24, marginTop: 4 }}>Son 14 Günlük Sayfa Görüntülenme & Tekil Ziyaretçi</h3>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, fontFamily: 'var(--mono)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: 2 }} /> Görüntülenme
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'var(--line)', borderRadius: 2 }} /> Tekil Ziyaretçi
            </span>
          </div>
        </div>

        <div className="admin-chart-bars">
          {daily.map((d) => {
            const viewH = Math.max(8, Math.round(((d.views || 0) / maxDailyViews) * 160));
            const visH = Math.max(6, Math.round(((d.visitors || 0) / maxDailyViews) * 160));
            return (
              <div key={d.date} className="admin-chart-col" title={`${d.label}: ${d.views} görüntülenme, ${d.visitors} tekil ziyaretçi`}>
                <div className="admin-chart-val">{d.views}</div>
                <div className="admin-chart-pair">
                  <div style={{ height: viewH, background: 'var(--accent)', borderRadius: '4px 4px 0 0', flex: 1 }} />
                  <div style={{ height: visH, background: 'var(--line)', borderRadius: '4px 4px 0 0', flex: 1 }} />
                </div>
                <div className="admin-chart-lbl">{d.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Breakdown + Project Popularity */}
      <div className="grid-2">
        <div className="surface" style={{ padding: 24 }}>
          <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Sayfa Performansı</div>
          <h3 style={{ fontSize: 22, marginBottom: 20 }}>Sayfa Bazlı Görüntülenme</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(pageViews)
              .sort((a, b) => b[1] - a[1])
              .map(([route, count]) => {
                const pct = Math.round((count / totalPageViewsSum) * 100);
                return (
                  <div key={route}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                      <span>{routeNames[route] || route} <span className="label-mono" style={{ fontSize: 10 }}>({route})</span></span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{count.toLocaleString('tr-TR')} (%{pct})</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="surface" style={{ padding: 24 }}>
          <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Proje İlgi Analizi</div>
          <h3 style={{ fontSize: 22, marginBottom: 20 }}>En Çok İncelenen Projeler</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects
              .map((p) => ({ ...p, clicks: projectClicks[p.id] || 120 }))
              .sort((a, b) => b.clicks - a.clicks)
              .slice(0, 6)
              .map((p, idx) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <span className="label-mono" style={{ color: 'var(--accent)' }}>0{idx + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{p.loc} · {p.area}</div>
                    </div>
                  </div>
                  <span className="tag">{p.clicks} etkileşim</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Device & Traffic Sources */}
      <div className="grid-2">
        <div className="surface" style={{ padding: 24 }}>
          <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Trafik Kaynakları</div>
          <h3 style={{ fontSize: 22, marginBottom: 18 }}>Ziyaretçi Kazanım Kanalları</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(analytics.sources || []).map((s) => (
              <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: 14 }}>{s.source}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>
                  {s.visits} ziyaret (%{s.pct})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface" style={{ padding: 24 }}>
          <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Cihaz Dağılımı & Kalite</div>
          <h3 style={{ fontSize: 22, marginBottom: 18 }}>Platform Oranları</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            {[
              { l: 'Masaüstü', v: analytics.devices?.desktop ?? 54 },
              { l: 'Mobil',    v: analytics.devices?.mobile ?? 38 },
              { l: 'Tablet',   v: analytics.devices?.tablet ?? 8 },
            ].map((d) => (
              <div key={d.l} style={{ flex: 1, padding: 14, borderRadius: 10, border: '1px solid var(--line)', textAlign: 'center' }}>
                <div className="display" style={{ fontSize: 32, color: 'var(--accent)' }}>%{d.v}</div>
                <div className="label-mono" style={{ marginTop: 6 }}>{d.l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Hemen çıkma oranı (Bounce Rate): <strong style={{ color: 'var(--text)' }}>%{analytics.bounceRatePct || 26.4}</strong> · Tüm cihazlarda duyarlı (responsive) ızgara sistemi aktif.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 2: PROJECTS CRUD
   ────────────────────────────────────────────────────────────────────────── */
function ProjectsTab({ projects, saving, onSave }) {
  const [list, setList] = useState(projects || []);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { setList(projects || []); }, [projects]);

  const addNewProject = () => {
    const newProj = {
      id: `p_${Date.now()}`,
      name: 'Yeni Chronos Projesi',
      loc: 'İstanbul',
      year: 2026,
      status: 'devam-eden',
      type: 'konut',
      featured: true,
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      area: '45.000 m²',
      floors: 20,
      units: 120,
      note: 'Yeni nesil mimari ve yüksek mühendislik standartlarıyla geliştirilen prestij projesi.',
    };
    const next = [newProj, ...list];
    setList(next);
    setEditingId(newProj.id);
  };

  const updateItem = (id, field, value) => {
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deleteItem = (id) => {
    const next = list.filter((p) => p.id !== id);
    setList(next);
    onSave(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="surface" style={{ padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="label-mono" style={{ color: 'var(--accent)' }}>Portföy Yönetimi</div>
          <h3 style={{ fontSize: 24, marginTop: 4 }}>Projeler ({list.length})</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={addNewProject}>
            <Icon name="plus" size={16} /> Yeni Proje Ekle
          </button>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSave(list)}>
            {saving ? 'Kaydediliyor...' : 'Tüm Projeleri Kaydet'}
            <span className="btn-arrow">✓</span>
          </button>
        </div>
      </div>

      {list.map((p) => {
        const isEditing = editingId === p.id;
        return (
          <div key={p.id} className="surface" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                <div style={{
                  width: 72, height: 52, borderRadius: 8, flexShrink: 0,
                  backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  border: '1px solid var(--line)',
                }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: 20 }}>{p.name}</h4>
                    {p.featured && <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Öne Çıkan</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>
                    {p.loc} · {p.year} · {p.area} · {p.status === 'tamamlanan' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '8px 14px', fontSize: 12.5 }}
                  onClick={() => setEditingId(isEditing ? null : p.id)}
                >
                  {isEditing ? 'Kapat' : 'Düzenle'}
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '8px 14px', fontSize: 12.5, borderColor: '#e44', color: '#ff8a8a' }}
                  onClick={() => deleteItem(p.id)}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="form-grid" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                <div className="field">
                  <label>Proje Adı</label>
                  <input className="input" value={p.name} onChange={(e) => updateItem(p.id, 'name', e.target.value)} />
                </div>
                <div className="field">
                  <label>Şehir / Konum</label>
                  <input className="input" value={p.loc} onChange={(e) => updateItem(p.id, 'loc', e.target.value)} />
                </div>
                <div className="field">
                  <label>Yıl</label>
                  <input className="input" type="number" value={p.year} onChange={(e) => updateItem(p.id, 'year', Number(e.target.value))} />
                </div>
                <div className="field">
                  <label>Durum</label>
                  <select className="select input" value={p.status} onChange={(e) => updateItem(p.id, 'status', e.target.value)}>
                    <option value="tamamlanan" style={{ background: 'var(--surface)' }}>Tamamlanan</option>
                    <option value="devam-eden" style={{ background: 'var(--surface)' }}>Devam Eden</option>
                  </select>
                </div>
                <div className="field">
                  <label>Kategori / Tip</label>
                  <select className="select input" value={p.type} onChange={(e) => updateItem(p.id, 'type', e.target.value)}>
                    <option value="konut" style={{ background: 'var(--surface)' }}>Konut</option>
                    <option value="ticari" style={{ background: 'var(--surface)' }}>Ticari</option>
                    <option value="donusum" style={{ background: 'var(--surface)' }}>Kentsel Dönüşüm</option>
                  </select>
                </div>
                <div className="field">
                  <label>İnşaat Alanı (Örn: 74.000 m²)</label>
                  <input className="input" value={p.area} onChange={(e) => updateItem(p.id, 'area', e.target.value)} />
                </div>
                <div className="field">
                  <label>Kat Sayısı</label>
                  <input className="input" type="number" value={p.floors} onChange={(e) => updateItem(p.id, 'floors', Number(e.target.value))} />
                </div>
                <div className="field">
                  <label>Ünite / Bağımsız Bölüm Sayısı</label>
                  <input className="input" type="number" value={p.units} onChange={(e) => updateItem(p.id, 'units', Number(e.target.value))} />
                </div>
                <div className="field field-full">
                  <label>Görsel URL (Unsplash veya harici bağlantı)</label>
                  <input className="input" value={p.img} onChange={(e) => updateItem(p.id, 'img', e.target.value)} />
                </div>
                <div className="field field-full">
                  <label>Proje Açıklaması</label>
                  <textarea className="textarea" rows={3} value={p.note} onChange={(e) => updateItem(p.id, 'note', e.target.value)} />
                </div>
                <div className="field field-full" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    id={`feat_${p.id}`}
                    checked={Boolean(p.featured)}
                    onChange={(e) => updateItem(p.id, 'featured', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                  />
                  <label htmlFor={`feat_${p.id}`} style={{ cursor: 'pointer', color: 'var(--text)' }}>
                    Anasayfa "Öne Çıkan Projeler" vitrininde göster
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 3: HOMEPAGE, HERO SLIDES, STATS & VALUES
   ────────────────────────────────────────────────────────────────────────── */
function HomeContentTab({ dashboard, saving, onSaveSection }) {
  const [settings, setSettings] = useState(dashboard.settings || {});
  const [slides, setSlides] = useState(dashboard.heroSlides || []);
  const [stats, setStats] = useState(dashboard.stats || []);
  const [values, setValues] = useState(dashboard.values || []);

  useEffect(() => {
    setSettings(dashboard.settings || {});
    setSlides(dashboard.heroSlides || []);
    setStats(dashboard.stats || []);
    setValues(dashboard.values || []);
  }, [dashboard]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Texts */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Anasayfa Metinleri</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Hero & Felsefe Başlıkları</h3>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={saving}
            onClick={() => onSaveSection('settings', settings, 'Anasayfa başlık ve metinleri güncellendi.')}
          >
            Başlıkları Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="form-grid">
          <div className="field field-full">
            <label>Hero Üst Etiket (Eyebrow)</label>
            <input className="input" value={settings.heroEyebrow || ''} onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })} />
          </div>
          <div className="field">
            <label>Hero Ana Başlık (Her satırı virgülle ayırın)</label>
            <input
              className="input"
              value={(settings.heroTitle || []).join(', ')}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <div className="field">
            <label>Felsefemiz Başlığı (Virgülle satır ayırın)</label>
            <input
              className="input"
              value={(settings.philosophyTitle || []).join(', ')}
              onChange={(e) => setSettings({ ...settings, philosophyTitle: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <div className="field field-full">
            <label>Hero Açıklama Paragrafı</label>
            <textarea className="textarea" rows={3} value={settings.heroDesc || ''} onChange={(e) => setSettings({ ...settings, heroDesc: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Hero Slides */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Arka Plan Görselleri</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Hero Slaytları ({slides.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => setSlides([...slides, { id: `hs_${Date.now()}`, label: 'Yeni Proje / 2026', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80' }])}
            >
              + Slayt Ekle
            </button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('heroSlides', slides, 'Hero slaytları güncellendi.')}>
              Slaytları Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {slides.map((s, idx) => (
            <div key={s.id || idx} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 2fr auto', gap: 12, alignItems: 'center' }} className="admin-slide-row">
              <div style={{ width: 64, height: 44, borderRadius: 6, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--line)' }} />
              <input
                className="input"
                value={s.label}
                placeholder="Slayt etiketi"
                onChange={(e) => setSlides(slides.map((item, i) => (i === idx ? { ...item, label: e.target.value } : item)))}
              />
              <input
                className="input"
                value={s.img}
                placeholder="Görsel URL"
                onChange={(e) => setSlides(slides.map((item, i) => (i === idx ? { ...item, img: e.target.value } : item)))}
              />
              <button
                type="button"
                className="btn"
                style={{ padding: '8px 12px', borderColor: '#e44', color: '#ff8a8a' }}
                onClick={() => setSlides(slides.filter((_, i) => i !== idx))}
              >
                <Icon name="trash" size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Sayılarla Chronos</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Anasayfa Sayaçları</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('stats', stats, 'Sayaç istatistikleri güncellendi.')}>
            Sayaçları Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-2">
          {stats.map((st, idx) => (
            <div key={st.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Sayısal Değer</label>
                <input
                  className="input"
                  type="number"
                  step="0.1"
                  value={st.num}
                  onChange={(e) => setStats(stats.map((item, i) => (i === idx ? { ...item, num: parseFloat(e.target.value) || 0 } : item)))}
                />
              </div>
              <div className="field">
                <label>Sonek (+, M m² vb.)</label>
                <input
                  className="input"
                  value={st.suffix}
                  onChange={(e) => setStats(stats.map((item, i) => (i === idx ? { ...item, suffix: e.target.value } : item)))}
                />
              </div>
              <div className="field">
                <label>Etiket</label>
                <input
                  className="input"
                  value={st.label}
                  onChange={(e) => setStats(stats.map((item, i) => (i === idx ? { ...item, label: e.target.value } : item)))}
                />
              </div>
              <div className="field">
                <label>Ondalık Basamak</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="2"
                  value={st.decimals || 0}
                  onChange={(e) => setStats(stats.map((item, i) => (i === idx ? { ...item, decimals: parseInt(e.target.value, 10) || 0 } : item)))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Kurumsal İlkeler</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Felsefemiz (4 Değer)</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('values', values, 'Felsefemiz ilkeleri güncellendi.')}>
            Değerleri Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-2">
          {values.map((v, idx) => (
            <div key={v.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label>{v.num} — Başlık</label>
                <input
                  className="input"
                  value={v.title}
                  onChange={(e) => setValues(values.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))}
                />
              </div>
              <div className="field">
                <label>Açıklama</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={v.text}
                  onChange={(e) => setValues(values.map((item, i) => (i === idx ? { ...item, text: e.target.value } : item)))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 4: SERVICES & PROCESS
   ────────────────────────────────────────────────────────────────────────── */
function ServicesContentTab({ dashboard, saving, onSaveSection }) {
  const [services, setServices] = useState(dashboard.services || []);
  const [steps, setSteps] = useState(dashboard.processSteps || []);

  useEffect(() => {
    setServices(dashboard.services || []);
    setSteps(dashboard.processSteps || []);
  }, [dashboard]);

  const addService = () => {
    const num = String(services.length + 1).padStart(2, '0');
    setServices([...services, { id: `sv_${Date.now()}`, num, name: 'Yeni Hizmet Alanı', icon: 'cube', desc: 'Hizmet kapsamı ve mühendislik detayları.' }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Hizmetler Sayfası</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Uzmanlık Alanları ({services.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={addService}>+ Hizmet Ekle</button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('services', services, 'Hizmetler güncellendi.')}>
              Hizmetleri Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div className="grid-2">
          {services.map((s, idx) => (
            <div key={s.id || idx} style={{ padding: 18, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  className="input"
                  style={{ width: 60 }}
                  value={s.num}
                  onChange={(e) => setServices(services.map((item, i) => (i === idx ? { ...item, num: e.target.value } : item)))}
                />
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={s.name}
                  onChange={(e) => setServices(services.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item)))}
                />
                <select
                  className="select input"
                  style={{ width: 110 }}
                  value={s.icon}
                  onChange={(e) => setServices(services.map((item, i) => (i === idx ? { ...item, icon: e.target.value } : item)))}
                >
                  {['pen', 'crane', 'city', 'chart', 'arch', 'cube', 'leaf', 'solar'].map((ic) => (
                    <option key={ic} value={ic} style={{ background: 'var(--surface)' }}>{ic}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }}
                  onClick={() => setServices(services.filter((_, i) => i !== idx))}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
              <textarea
                className="textarea"
                rows={3}
                value={s.desc}
                onChange={(e) => setServices(services.map((item, i) => (i === idx ? { ...item, desc: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>5 Adımlı Süreç</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Çalışma Metodolojisi</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('processSteps', steps, 'Süreç adımları güncellendi.')}>
            Süreci Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-2">
          {steps.map((st, idx) => (
            <div key={st.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="field">
                <label>Adım {st.n} Başlığı</label>
                <input
                  className="input"
                  value={st.t}
                  onChange={(e) => setSteps(steps.map((item, i) => (i === idx ? { ...item, t: e.target.value } : item)))}
                />
              </div>
              <div className="field">
                <label>Açıklama</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={st.d}
                  onChange={(e) => setSteps(steps.map((item, i) => (i === idx ? { ...item, d: e.target.value } : item)))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 5: ABOUT, TIMELINE & LEADERSHIP
   ────────────────────────────────────────────────────────────────────────── */
function AboutContentTab({ dashboard, saving, onSaveSection }) {
  const [settings, setSettings] = useState(dashboard.settings || {});
  const [timeline, setTimeline] = useState(dashboard.timeline || []);
  const [leaders, setLeaders] = useState(dashboard.leadership || []);

  useEffect(() => {
    setSettings(dashboard.settings || {});
    setTimeline(dashboard.timeline || []);
    setLeaders(dashboard.leadership || []);
  }, [dashboard]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Kurumsal Hikaye</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Hakkımızda, Vizyon & Misyon</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('settings', settings, 'Hakkımızda metinleri güncellendi.')}>
            Metinleri Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="form-grid">
          <div className="field field-full">
            <label>Hakkımızda Giriş Paragrafı</label>
            <textarea className="textarea" rows={3} value={settings.aboutIntro || ''} onChange={(e) => setSettings({ ...settings, aboutIntro: e.target.value })} />
          </div>
          <div className="field">
            <label>Vizyon Metni</label>
            <textarea className="textarea" rows={2} value={settings.visionText || ''} onChange={(e) => setSettings({ ...settings, visionText: e.target.value })} />
          </div>
          <div className="field">
            <label>Misyon Metni</label>
            <textarea className="textarea" rows={2} value={settings.missionText || ''} onChange={(e) => setSettings({ ...settings, missionText: e.target.value })} />
          </div>
          <div className="field field-full">
            <label>Sözümüz Metni</label>
            <input className="input" value={settings.promiseText || ''} onChange={(e) => setSettings({ ...settings, promiseText: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Kilometre Taşları</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Zaman Çizelgesi ({timeline.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => setTimeline([...timeline, { id: `tl_${Date.now()}`, year: 2026, title: 'Yeni Dönüm Noktası', text: 'Chronos tarihinde yeni bir adım.' }])}
            >
              + Yıl Ekle
            </button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('timeline', timeline, 'Zaman çizelgesi güncellendi.')}>
              Çizelgeyi Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {timeline.map((t, idx) => (
            <div key={t.id || idx} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 2fr auto', gap: 12, alignItems: 'center' }} className="admin-slide-row">
              <input
                className="input"
                type="number"
                value={t.year}
                onChange={(e) => setTimeline(timeline.map((item, i) => (i === idx ? { ...item, year: Number(e.target.value) } : item)))}
              />
              <input
                className="input"
                value={t.title}
                onChange={(e) => setTimeline(timeline.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))}
              />
              <input
                className="input"
                value={t.text}
                onChange={(e) => setTimeline(timeline.map((item, i) => (i === idx ? { ...item, text: e.target.value } : item)))}
              />
              <button
                type="button"
                className="btn"
                style={{ padding: '8px 12px', borderColor: '#e44', color: '#ff8a8a' }}
                onClick={() => setTimeline(timeline.filter((_, i) => i !== idx))}
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Yönetim Kurulu</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Liderlik Ekibi ({leaders.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => setLeaders([...leaders, { id: `ld_${Date.now()}`, n: 'Yeni Yönetici', r: 'Yönetim Kurulu Üyesi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' }])}
            >
              + Yönetici Ekle
            </button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('leadership', leaders, 'Yönetim ekibi güncellendi.')}>
              Ekibi Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div className="grid-2">
          {leaders.map((l, idx) => (
            <div key={l.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 56, borderRadius: 6, backgroundImage: `url(${l.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    className="input"
                    value={l.n}
                    placeholder="Ad Soyad"
                    onChange={(e) => setLeaders(leaders.map((item, i) => (i === idx ? { ...item, n: e.target.value } : item)))}
                  />
                  <input
                    className="input"
                    value={l.r}
                    placeholder="Unvan"
                    onChange={(e) => setLeaders(leaders.map((item, i) => (i === idx ? { ...item, r: e.target.value } : item)))}
                  />
                </div>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }}
                  onClick={() => setLeaders(leaders.filter((_, i) => i !== idx))}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
              <input
                className="input"
                value={l.img}
                placeholder="Portre Görsel URL"
                onChange={(e) => setLeaders(leaders.map((item, i) => (i === idx ? { ...item, img: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 6: SUSTAINABILITY & TESTIMONIALS
   ────────────────────────────────────────────────────────────────────────── */
function SustainContentTab({ dashboard, saving, onSaveSection }) {
  const [tech, setTech] = useState(dashboard.techFeatures || []);
  const [materials, setMaterials] = useState(dashboard.materials || []);
  const [testimonials, setTestimonials] = useState(dashboard.testimonials || []);

  useEffect(() => {
    setTech(dashboard.techFeatures || []);
    setMaterials(dashboard.materials || []);
    setTestimonials(dashboard.testimonials || []);
  }, [dashboard]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tech KPIs */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Sürdürülebilirlik & Teknoloji</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Mühendislik KPI Kartları</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('techFeatures', tech, 'Sürdürülebilirlik metrikleri güncellendi.')}>
            KPI'ları Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-2">
          {tech.map((t, idx) => (
            <div key={t.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="input"
                  style={{ width: 110 }}
                  value={t.kpi}
                  onChange={(e) => setTech(tech.map((item, i) => (i === idx ? { ...item, kpi: e.target.value } : item)))}
                />
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={t.title}
                  onChange={(e) => setTech(tech.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))}
                />
              </div>
              <textarea
                className="textarea"
                rows={2}
                value={t.text}
                onChange={(e) => setTech(tech.map((item, i) => (i === idx ? { ...item, text: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Malzeme Disiplini</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Yeşil Malzeme Yüzdeleri</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('materials', materials, 'Malzeme disiplini oranları güncellendi.')}>
            Oranları Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-2">
          {materials.map((m, idx) => (
            <div key={m.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={m.t}
                  onChange={(e) => setMaterials(materials.map((item, i) => (i === idx ? { ...item, t: e.target.value } : item)))}
                />
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  style={{ width: 80 }}
                  value={m.pct}
                  onChange={(e) => setMaterials(materials.map((item, i) => (i === idx ? { ...item, pct: Number(e.target.value) } : item)))}
                />
              </div>
              <input
                className="input"
                value={m.s}
                onChange={(e) => setMaterials(materials.map((item, i) => (i === idx ? { ...item, s: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Müşteri Referansları</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Müşteri Yorumları ({testimonials.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => setTestimonials([...testimonials, { id: `tm_${Date.now()}`, name: 'Yeni Paydaş', role: 'Yönetim Kurulu Başkanı', quote: '"Chronos ile çalışmak güven ve mühendislik disiplini demektir."' }])}
            >
              + Yorum Ekle
            </button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('testimonials', testimonials, 'Müşteri yorumları güncellendi.')}>
              Yorumları Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div className="grid-2">
          {testimonials.map((t, idx) => (
            <div key={t.id || idx} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={t.name}
                  placeholder="İsim"
                  onChange={(e) => setTestimonials(testimonials.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item)))}
                />
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={t.role}
                  placeholder="Unvan / Kurum"
                  onChange={(e) => setTestimonials(testimonials.map((item, i) => (i === idx ? { ...item, role: e.target.value } : item)))}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }}
                  onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
              <textarea
                className="textarea"
                rows={3}
                value={t.quote}
                onChange={(e) => setTestimonials(testimonials.map((item, i) => (i === idx ? { ...item, quote: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 7: CAREERS & JOB APPLICATIONS
   ────────────────────────────────────────────────────────────────────────── */
function CareersAdminTab({ dashboard, token, saving, onSaveSection, onUpdateApplications, showToast }) {
  const [positions, setPositions] = useState(dashboard.positions || []);
  const applications = dashboard.applications || [];

  useEffect(() => { setPositions(dashboard.positions || []); }, [dashboard.positions]);

  const updateAppStatus = async (id, status) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      onUpdateApplications(data.applications);
      showToast('Başvuru durumu güncellendi.');
    }
  };

  const deleteApp = async (id) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      onUpdateApplications(data.applications);
      showToast('Başvuru silindi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Incoming Applications */}
      <div className="surface" style={{ padding: 24 }}>
        <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Gelen Kutusu</div>
        <h3 style={{ fontSize: 22, marginBottom: 20 }}>İş & Staj Başvuruları ({applications.length})</h3>
        {applications.length === 0 ? (
          <p style={{ color: 'var(--text-dim)' }}>Henüz başvuru bulunmuyor.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {applications.map((a) => (
              <div key={a.id} style={{ padding: 18, border: '1px solid var(--line)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: 17 }}>{a.name}</strong>
                      <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{a.team}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
                      {a.email} {a.phone && `· ${a.phone}`} · {new Date(a.createdAt).toLocaleString('tr-TR')}
                    </div>
                    {a.portfolio && (
                      <div style={{ fontSize: 12.5, marginTop: 4 }}>
                        Portföy: <a href={a.portfolio} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{a.portfolio}</a>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      className="select input"
                      style={{ width: 140, padding: '6px 24px 6px 8px', fontSize: 13 }}
                      value={a.status}
                      onChange={(e) => updateAppStatus(a.id, e.target.value)}
                    >
                      <option value="new" style={{ background: 'var(--surface)' }}>Yeni</option>
                      <option value="reviewing" style={{ background: 'var(--surface)' }}>İnceleniyor</option>
                      <option value="interview" style={{ background: 'var(--surface)' }}>Mülakat</option>
                      <option value="accepted" style={{ background: 'var(--surface)' }}>Kabul Edildi</option>
                      <option value="rejected" style={{ background: 'var(--surface)' }}>Reddedildi</option>
                    </select>
                    <button type="button" className="btn" style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }} onClick={() => deleteApp(a.id)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{a.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Positions */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Kariyer Sayfası</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Açık Pozisyonlar ({positions.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => setPositions([...positions, { id: `pos_${Date.now()}`, team: 'Mühendislik', title: 'Yeni Pozisyon', loc: 'İstanbul', type: 'Tam zamanlı' }])}
            >
              + Pozisyon Ekle
            </button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('positions', positions, 'Açık pozisyonlar güncellendi.')}>
              Pozisyonları Kaydet <span className="btn-arrow">✓</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {positions.map((p, idx) => (
            <div key={p.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 1fr auto', gap: 10, alignItems: 'center' }} className="admin-slide-row">
              <input
                className="input"
                value={p.team}
                placeholder="Departman"
                onChange={(e) => setPositions(positions.map((item, i) => (i === idx ? { ...item, team: e.target.value } : item)))}
              />
              <input
                className="input"
                value={p.title}
                placeholder="Pozisyon Adı"
                onChange={(e) => setPositions(positions.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))}
              />
              <input
                className="input"
                value={p.loc}
                placeholder="Şehir"
                onChange={(e) => setPositions(positions.map((item, i) => (i === idx ? { ...item, loc: e.target.value } : item)))}
              />
              <input
                className="input"
                value={p.type}
                placeholder="Çalışma Tipi"
                onChange={(e) => setPositions(positions.map((item, i) => (i === idx ? { ...item, type: e.target.value } : item)))}
              />
              <button
                type="button"
                className="btn"
                style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }}
                onClick={() => setPositions(positions.filter((_, i) => i !== idx))}
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 8: CONTACT MESSAGES INBOX
   ────────────────────────────────────────────────────────────────────────── */
function MessagesAdminTab({ messages, token, onUpdateMessages, showToast }) {
  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      onUpdateMessages(data.messages);
      showToast('Mesaj durumu güncellendi.');
    }
  };

  const deleteMsg = async (id) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      onUpdateMessages(data.messages);
      showToast('Mesaj silindi.');
    }
  };

  return (
    <div className="surface" style={{ padding: 24 }}>
      <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>İletişim Formu Gelen Kutusu</div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>Gelen Mesajlar & Teklif Talepleri ({messages.length})</h3>
      {messages.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>Gelen kutusunda mesaj bulunmuyor.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                padding: 18,
                borderRadius: 10,
                border: `1px solid ${m.status === 'unread' ? 'var(--accent)' : 'var(--line)'}`,
                background: m.status === 'unread' ? 'var(--accent-soft)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 17 }}>{m.name}</strong>
                    <span className="tag">{m.subject || 'Genel'}</span>
                    {m.status === 'unread' && <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Yeni</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
                    {m.email} {m.phone && `· ${m.phone}`} · {new Date(m.createdAt).toLocaleString('tr-TR')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    className="select input"
                    style={{ width: 135, padding: '6px 24px 6px 8px', fontSize: 13 }}
                    value={m.status}
                    onChange={(e) => updateStatus(m.id, e.target.value)}
                  >
                    <option value="unread" style={{ background: 'var(--surface)' }}>Okunmadı</option>
                    <option value="read" style={{ background: 'var(--surface)' }}>Okundu</option>
                    <option value="replied" style={{ background: 'var(--surface)' }}>Yanıtlandı</option>
                  </select>
                  <button type="button" className="btn" style={{ padding: '8px 10px', borderColor: '#e44', color: '#ff8a8a' }} onClick={() => deleteMsg(m.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.6 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 9: SITE SETTINGS, THEME & OFFICES
   ────────────────────────────────────────────────────────────────────────── */
function SettingsAdminTab({ dashboard, token, saving, onSaveSection, onResetSuccess, showToast }) {
  const [settings, setSettings] = useState(dashboard.settings || {});
  const [offices, setOffices] = useState(dashboard.offices || []);

  useEffect(() => {
    setSettings(dashboard.settings || {});
    setOffices(dashboard.offices || []);
  }, [dashboard]);

  const handleFactoryReset = async () => {
    if (!window.confirm('Tüm site metinlerini ve projeleri varsayılan fabrika ayarlarına döndürmek istediğinize emin misiniz?')) return;
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      onResetSuccess(data);
    } else {
      showToast('Sıfırlama işlemi başarısız oldu.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Theme & Brand */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Görünüm & Kurumsal Kimlik</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Tema, Marka & İletişim Bilgileri</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('settings', settings, 'Genel site ayarları ve tema güncellendi.')}>
            Ayarları Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>

        <div className="form-grid">
          <div className="field field-full">
            <label>Site Renk Teması (Anında Uygulanır)</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
              {[
                { id: 'midnight-gold', label: 'Gece Mavisi & Altın (Midnight Gold)', color: '#d4a85a' },
                { id: 'default',       label: 'Kömür Grisi & İnşaat Turuncusu',      color: '#ff5a1f' },
                { id: 'black-bronze',  label: 'Derin Siyah & Bronz (Black Bronze)',  color: '#c47843' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: t.id })}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: `1px solid ${settings.theme === t.id ? 'var(--accent)' : 'var(--line)'}`,
                    background: settings.theme === t.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: 13.5 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Marka Adı</label>
            <input className="input" value={settings.brandName || ''} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} />
          </div>
          <div className="field">
            <label>Marka Alt Başlığı</label>
            <input className="input" value={settings.brandSub || ''} onChange={(e) => setSettings({ ...settings, brandSub: e.target.value })} />
          </div>
          <div className="field">
            <label>Telefon</label>
            <input className="input" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Çalışma Saatleri</label>
            <input className="input" value={settings.workHours || ''} onChange={(e) => setSettings({ ...settings, workHours: e.target.value })} />
          </div>
          <div className="field">
            <label>Kurumsal E-posta</label>
            <input className="input" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Basın E-postası</label>
            <input className="input" value={settings.pressEmail || ''} onChange={(e) => setSettings({ ...settings, pressEmail: e.target.value })} />
          </div>
          <div className="field">
            <label>Genel Merkez Adres Satırı 1</label>
            <input className="input" value={settings.addressLine1 || ''} onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })} />
          </div>
          <div className="field">
            <label>Genel Merkez Adres Satırı 2</label>
            <input className="input" value={settings.addressLine2 || ''} onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })} />
          </div>
          <div className="field">
            <label>Harita Koordinat Etiketi</label>
            <input className="input" value={settings.coordinates || ''} onChange={(e) => setSettings({ ...settings, coordinates: e.target.value })} />
          </div>
          <div className="field">
            <label>Yetki Belgesi Numarası</label>
            <input className="input" value={settings.certNo || ''} onChange={(e) => setSettings({ ...settings, certNo: e.target.value })} />
          </div>
          <div className="field field-full">
            <label>Alt Bilgi (Footer) Kurumsal Açıklama</label>
            <textarea className="textarea" rows={2} value={settings.footerDesc || ''} onChange={(e) => setSettings({ ...settings, footerDesc: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Regional Offices */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>İletişim Sayfası</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Bölge Ofisleri</h3>
          </div>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSaveSection('offices', offices, 'Bölge ofisleri güncellendi.')}>
            Ofisleri Kaydet <span className="btn-arrow">✓</span>
          </button>
        </div>
        <div className="grid-3">
          {offices.map((o, idx) => (
            <div key={o.id || idx} style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                className="input"
                value={o.c}
                placeholder="Şehir"
                onChange={(e) => setOffices(offices.map((item, i) => (i === idx ? { ...item, c: e.target.value } : item)))}
              />
              <input
                className="input"
                value={o.a}
                placeholder="Adres / Bina"
                onChange={(e) => setOffices(offices.map((item, i) => (i === idx ? { ...item, a: e.target.value } : item)))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Factory Reset */}
      <div className="surface" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="label-mono" style={{ color: '#ff8a8a' }}>Tehlikeli Bölge</div>
          <h4 style={{ fontSize: 20, marginTop: 4 }}>Fabrika Ayarlarına Sıfırla</h4>
          <p style={{ fontSize: 13.5, color: 'var(--text-dim)', marginTop: 4 }}>
            Sitedeki tüm metin, proje ve istatistikleri ilk kurulumdaki varsayılan değerlerine döndürür (yönetici şifreniz korunur).
          </p>
        </div>
        <button type="button" className="btn" style={{ borderColor: '#e44', color: '#ff8a8a' }} onClick={handleFactoryReset}>
          Varsayılanlara Sıfırla
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TAB 10: SECURITY & AUDIT LOGS
   ────────────────────────────────────────────────────────────────────────── */
function SecurityAdminTab({ dashboard, token, showToast, onLogsUpdated, onUserUpdated }) {
  const [newUsername, setNewUsername] = useState(dashboard.adminUser?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changing, setChanging] = useState(false);

  const logs = dashboard.securityLogs || [];

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChanging(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword, newUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Şifre güncellenemedi.', 'error');
      } else {
        setCurrentPassword('');
        setNewPassword('');
        onUserUpdated(data.username);
        showToast('Yönetici kullanıcı adı ve şifresi güvenle güncellendi.');
      }
    } catch {
      showToast('Sunucu hatası.', 'error');
    } finally {
      setChanging(false);
    }
  };

  const clearLogs = async () => {
    const res = await fetch('/api/admin/security-logs', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      onLogsUpdated(data.securityLogs);
      showToast('Güvenlik kayıtları temizlendi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Active Security Layers */}
      <div className="surface" style={{ padding: 24 }}>
        <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Aktif Koruma Katmanları</div>
        <h3 style={{ fontSize: 22, marginBottom: 18 }}>Güvenlik Altyapısı Durumu</h3>
        <div className="grid-3">
          {[
            { t: 'PBKDF2-HMAC-SHA512', d: '100.000 iterasyon ve kriptografik tuz (salt) ile şifre özetleme.' },
            { t: 'Brute-Force Koruması', d: '15 dakikada 5 hatalı giriş denemesinden sonra otomatik IP kilidi.' },
            { t: 'XSS & Enjeksiyon Filtresi', d: 'Tüm gelen JSON verilerinde script/iframe ve prototip kirliliği temizliği.' },
            { t: 'HMAC-SHA256 Token', d: 'İmzalı, süreli ve oturum kapatıldığında iptal edilen (revocation) jetonlar.' },
            { t: 'HTTP Güvenlik Başlıkları', d: 'X-Frame-Options: DENY, nosniff, XSS-Protection ve Permissions-Policy.' },
            { t: 'Honeypot Anti-Bot', d: 'İletişim ve kariyer formlarında otomatik spam botlarını sessizce yakalar.' },
          ].map((sec) => (
            <div key={sec.t} style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 500, fontSize: 14 }}>
                <Icon name="shield" size={16} /> {sec.t}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>{sec.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Password Change */}
      <div className="surface" style={{ padding: 24 }}>
        <div className="label-mono" style={{ color: 'var(--accent)', marginBottom: 6 }}>Kimlik Bilgileri</div>
        <h3 style={{ fontSize: 22, marginBottom: 18 }}>Yönetici Şifresini & Kullanıcı Adını Değiştir</h3>
        <form onSubmit={handlePasswordChange} className="form-grid">
          <div className="field">
            <label>Yeni Kullanıcı Adı</label>
            <input className="input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>Mevcut Şifreniz</label>
            <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="field field-full">
            <label>Yeni Şifre (En az 6 karakter)</label>
            <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="field-full">
            <button type="submit" className="btn btn-primary" disabled={changing}>
              {changing ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audit Logs */}
      <div className="surface" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <div className="label-mono" style={{ color: 'var(--accent)' }}>Denetim İzi (Audit Log)</div>
            <h3 style={{ fontSize: 22, marginTop: 4 }}>Güvenlik ve İşlem Kayıtları ({logs.length})</h3>
          </div>
          <button type="button" className="btn" style={{ padding: '8px 14px', fontSize: 12.5 }} onClick={clearLogs}>
            Kayıtları Temizle
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {logs.map((l) => (
            <div key={l.id} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="tag" style={{
                  borderColor: l.severity === 'danger' || l.severity === 'warn' ? '#e44' : 'var(--line)',
                  color: l.severity === 'danger' || l.severity === 'warn' ? '#ff8a8a' : 'var(--accent)',
                }}>
                  {l.type}
                </span>
                <span>{l.detail}</span>
              </div>
              <span className="label-mono" style={{ fontSize: 10.5 }}>
                IP: {l.ip} · {new Date(l.createdAt).toLocaleString('tr-TR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
