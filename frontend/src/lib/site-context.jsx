import { createContext, useContext, useEffect, useState } from 'react';
import { getJSON } from './api';

const SiteContext = createContext({ settings: null, categories: [] });

export function SiteProvider({ children }) {
  const [value, setValue] = useState({ settings: null, categories: [], loading: true });

  useEffect(() => {
    let alive = true;
    Promise.all([getJSON('/settings'), getJSON('/categories')])
      .then(([settingsData, categoriesData]) => {
        if (!alive) return;
        setValue({
          settings: settingsData.settings || null,
          categories: categoriesData.categories || [],
          loading: false,
        });
      })
      .catch(() => {
        if (alive) setValue({ settings: null, categories: [], loading: false });
      });
    return () => {
      alive = false;
    };
  }, []);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
