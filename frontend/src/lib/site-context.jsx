import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FALLBACK_SETTINGS } from './site';
import { getMenu, getSettings, getTestimonials } from './api';

const SiteContext = createContext({
  settings: FALLBACK_SETTINGS,
  categories: [],
  testimonials: [],
  ready: false,
});

/**
 * Content lives in PostgreSQL behind /api. One fetch per page load; while it is
 * in flight (or if the API is down) the static Persian copy still renders, so no
 * section is ever blank.
 */
export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getSettings(), getMenu(), getTestimonials()])
      .then(([nextSettings, nextCategories, nextTestimonials]) => {
        if (cancelled) return;
        setSettings({ ...FALLBACK_SETTINGS, ...nextSettings });
        setCategories(nextCategories);
        setTestimonials(nextTestimonials);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ settings, categories, testimonials, ready }),
    [categories, ready, settings, testimonials],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
