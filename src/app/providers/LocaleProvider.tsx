import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALE_STRINGS,
  getLanguage,
  isLocale,
  type Locale,
} from '@/lib/i18n/locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  language: ReturnType<typeof getLanguage>
  t: (typeof LOCALE_STRINGS)[Locale]
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
  defaultLocale?: Locale
  storageKey?: string
}

function readStoredLocale(storageKey: string, fallback: Locale): Locale {
  try {
    const stored = localStorage.getItem(storageKey)
    if (isLocale(stored)) return stored
  } catch {
    // Ignore storage access errors (private mode, blocked storage).
  }
  return fallback
}

export function LocaleProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
  storageKey = LOCALE_STORAGE_KEY,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    readStoredLocale(storageKey, defaultLocale)
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // Preference still applies for this session if storage is unavailable.
      }
      setLocaleState(next)
    },
    [storageKey]
  )

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      language: getLanguage(locale),
      t: LOCALE_STRINGS[locale],
    }),
    [locale, setLocale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
