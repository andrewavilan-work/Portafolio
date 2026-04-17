import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { useLang } from '../context/LangContext'

const Hero3D = lazy(() => import('../components/Hero3D'))
import cvEn from '../assets/pdf/Andrew_Avilan_CV_en.pdf'
import cvEs from '../assets/pdf/Andrew_Avilan_CV_es.pdf'

const TAGLINE = '$ dev --stack=react,js,python --open-to-work=true'

export default function Hero() {
  const { displayed, done } = useTypewriter(TAGLINE, 50, 1000)
  const { t, lang } = useLang()
  const cvFile = lang === 'en' ? cvEn : cvEs

  return (
    <section id="hero" className="hero">
      {/* Blobs decorativos */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      {/* Canvas 3D — fondo completo */}
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      {/* Contenido */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            {t.hero.badge}
          </span>
        </motion.div>

        <motion.p
          className="hero-role"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.hero.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="gradient-text">Andrew<br />Avilán.</span>
        </motion.h1>

        <motion.div
          className="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {displayed}
          {!done && <span className="hero-tagline-cursor" />}
        </motion.div>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15, ease: 'easeOut' }}
        >
          <a href="#proyectos" className="btn-primary">
            {t.hero.btn1}
          </a>
          <a href={cvFile} download={`Andrew_Avilan_CV_${lang}.pdf`} className="btn-secondary">
            <svg style={{marginRight: '8px', verticalAlign: 'middle'}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            {t.hero.cv}
          </a>
          <a href="#contacto" className="btn-ghost">
            {t.hero.btn2}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <div className="scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  )
}
