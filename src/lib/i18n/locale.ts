export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
] as const

export type Locale = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'ui-locale'

const LOCALE_CODES = new Set<string>(LANGUAGES.map((language) => language.code))

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && LOCALE_CODES.has(value))
}

export const LOCALE_STRINGS: Record<Locale, { language: string; logout: string }> = {
  en: { language: 'Language', logout: 'Logout' },
  hi: { language: 'भाषा', logout: 'लॉग आउट' },
  ta: { language: 'மொழி', logout: 'வெளியேறு' },
  te: { language: 'భాష', logout: 'లాగ్ అవుట్' },
  kn: { language: 'ಭಾಷೆ', logout: 'ಲಾಗ್ ಔಟ್' },
  ml: { language: 'ഭാഷ', logout: 'ലോഗ് ഔട്ട്' },
  mr: { language: 'भाषा', logout: 'लॉग आउट' },
  gu: { language: 'ભાષા', logout: 'લૉગ આઉટ' },
}

export function getLanguage(code: Locale) {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0]
}
