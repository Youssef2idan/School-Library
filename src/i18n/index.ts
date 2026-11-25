import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

export type Lang = 'ar' | 'en'

const STORAGE_KEY = 'school-library-lang'

export function applyLang(lang: Lang): void {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
  applyLang(lang)
  void i18n.changeLanguage(lang)
}

const lang = initialLang()
applyLang(lang)

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: lang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n