import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

const TIMELINE_IDS = [
  { id: 'uandes', institution: 'Universidad de los Andes', icon: '🎓' },
  { id: 'unal',   institution: 'Universidad Nacional de Colombia', icon: '🏛️' },
]

export default function Education() {
  const { t } = useLang()

  return (
    <section id="educacion" className="education-section">
      <span className="section-watermark" aria-hidden="true">05</span>

      <div className="container">
        <motion.div
          style={{ marginBottom: 60, position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{t.education.label}</span>
          <h2>{t.education.heading}</h2>
        </motion.div>

        <div className="timeline">
          {TIMELINE_IDS.map(({ id, institution, icon }, i) => {
            const entry = t.education[id]
            return (
              <motion.div
                key={id}
                className="timeline-item"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="timeline-node" />
                <div className="timeline-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p className="timeline-date">{entry.date}</p>
                      <p className="timeline-institution">{institution}</p>
                      <p className="timeline-degree">{entry.degree}</p>
                      <p className="timeline-desc">{entry.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
