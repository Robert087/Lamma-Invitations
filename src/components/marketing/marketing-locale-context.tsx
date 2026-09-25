"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { Locale } from "@/types/locale";

interface MarketingLocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isAr: boolean;
  dir: "rtl" | "ltr";
}

const MarketingLocaleContext = createContext<MarketingLocaleContextValue | null>(null);

const STORAGE_KEY = "lamma_marketing_locale";
const LOCALE_CHANGE_EVENT = "lamma_locale_changed";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "ar" || saved === "en") return saved;
  } catch {
    // Ignore storage errors
  }
  return "ar";
}

function getServerSnapshot(): Locale {
  return "ar";
}

export function MarketingLocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = (newLocale: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  };

  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <MarketingLocaleContext.Provider value={{ locale, setLocale, isAr, dir }}>
      <div dir={dir} lang={locale}>
        {children}
      </div>
    </MarketingLocaleContext.Provider>
  );
}

export function useMarketingLocale() {
  const context = useContext(MarketingLocaleContext);
  if (!context) {
    return {
      locale: "ar" as Locale,
      setLocale: () => {},
      isAr: true,
      dir: "rtl" as const,
    };
  }
  return context;
}
