import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import iconSvg from '../assets/icon.svg'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra el menú móvil si el usuario expande la pantalla a ≥768px
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const NAV_LINKS = [
    { href: '#sobre-mi',    label: t.nav.about      },
    { href: '#proyectos',   label: t.nav.projects   },
    { href: '#habilidades', label: t.nav.skills     },
    { href: '#educacion',   label: t.nav.education  },
    { href: '#contacto',    label: t.nav.contact    },
  ]

  return (
    <>
      <nav
        className="navbar"
        style={scrolled ? { boxShadow: '0 1px 24px rgba(0,0,0,0.12)' } : {}}
      >
        <a href="#hero" className="navbar-logo" onClick={() => setOpen(false)}>
          <img src={iconSvg} alt="andrew.dev" className="navbar-logo-img" />
          <span className="navbar-logo-text">andrew.dev</span>
        </a>

        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Actions: language + theme */}
        <div className="navbar-actions">
          <button
            className="navbar-lang-toggle"
            onClick={toggleLang}
            aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
          >
            <span className={lang === 'en' ? 'lang-opt active' : 'lang-opt'}>🇺🇸 EN</span>
            <span className="navbar-lang-sep"> · </span>
            <span className={lang === 'es' ? 'lang-opt active' : 'lang-opt'}>🇨🇴 ES</span>
          </button>

          <button
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.theme.dark : t.theme.light}
          >
            <motion.span
              key={theme}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ display: 'flex', lineHeight: 1 }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.span>
          </button>
        </div>

        <button
          className={`navbar-hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
              >
                {link.label}
              </motion.a>
            ))}

            <div style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
              <motion.button
                onClick={toggleLang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                  color: 'rgba(196,180,232,0.9)', background: 'rgba(124,95,196,0.15)',
                  border: '1px solid rgba(124,95,196,0.3)', borderRadius: 16,
                  padding: '6px 14px', cursor: 'pointer',
                }}
              >
                <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>🇺🇸 EN</span>
                <span style={{ opacity: 0.3 }}> · </span>
                <span style={{ opacity: lang === 'es' ? 1 : 0.4 }}>🇨🇴 ES</span>
              </motion.button>

              <motion.button
                onClick={toggleTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.05 + 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'rgba(196,180,232,0.8)', fontSize: 15, fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
                {theme === 'dark' ? t.theme.dark : t.theme.light}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
