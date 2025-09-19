
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettingsContextType {
  appLogo: string;
  setAppLogo: (logo: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const LOGO_STORAGE_KEY = 'pema-app-logo';
const DEFAULT_LOGO = 'https://storage.googleapis.com/stella-images/pema-logo.png';

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [appLogo, setAppLogoState] = useState<string>(DEFAULT_LOGO);

  useEffect(() => {
    try {
      const storedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
      if (storedLogo) {
        setAppLogoState(storedLogo);
      }
    } catch (error) {
      console.error("Failed to load logo from storage", error);
      localStorage.removeItem(LOGO_STORAGE_KEY);
    }
  }, []);

  const setAppLogo = (logo: string) => {
    setAppLogoState(logo);
    localStorage.setItem(LOGO_STORAGE_KEY, logo);
  };

  return (
    <AppSettingsContext.Provider value={{ appLogo, setAppLogo }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}
