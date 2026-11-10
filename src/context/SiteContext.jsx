import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest, createSeedDatabase } from '../services/apiClient.js';

const DEFAULT_SITE_DATA = createSeedDatabase();

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
    const res = await apiRequest('/api/public');
    if (res.ok && res.data) {
      setSite((prev) => ({
        ...prev,
        ...res.data,
        settings: { ...prev.settings, ...(res.data.settings || {}) },
      }));
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
    apiRequest('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, projectId, isNewSession }),
    });
  }, []);

  return (
    <SiteCtx.Provider value={{ site, refreshPublicData, updateLocalSection, trackVisit }}>
      {children}
    </SiteCtx.Provider>
  );
}
