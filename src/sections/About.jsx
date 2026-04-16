import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

const About3D = lazy(() => import('../components/About3D'))

const TECH = [
  { name: 'React', icon: '⚛️' },
  { name: 'JavaScript', icon: '🟨' },
  { name: 'HTML5', icon: '🧡' },
  { name: 'CSS3', icon: '💙' },
  { name: 'Python', icon: '🐍' },
  { name: 'Git', icon: '🔀' },
  { name: 'GitHub', icon: '🐙' },
]

export default function About() {
  const { t } = useLang()

  return (
    <section id="sobre-mi" className="about-section">
      <span className="section-watermark" aria-hidden="true">02</span>

      <div className="container">
        <motion.div
          style={{ marginBottom: 56, position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{t.about.label}</span>
          <h2>{t.about.heading}</h2>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{t.about.p1}</p>
            <p>
              {t.about.p2[0]}
              <strong style={{ color: 'var(--c-primary)', fontWeight: 700 }}>{t.about.p2[1]}</strong>
              {t.about.p2[2]}
            </p>
            <p>{t.about.p3}</p>

            <div className="tech-grid">
              {TECH.map((tech, i) => (
                <motion.span
                  key={tech.name}
                  className="tech-badge"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  {tech.icon} {tech.name}
                </motion.span>
              ))}
            </div>

            <p className="about-personal">{t.about.personal}</p>
          </motion.div>

          <motion.div
            className="about-3d-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(155,135,192,0.5)'
              }}>
                cargando…
              </div>
            }>
              <About3D />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
