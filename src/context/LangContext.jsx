import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('andrew-lang') || 'en')

  const toggleLang = () => {
    setLang((l) => {
      const next = l === 'en' ? 'es' : 'en'
      localStorage.setItem('andrew-lang', next)
      return next
    })
  }

  const t = translations[lang]

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
