import { useState } from 'react'
import { motion } from 'framer-motion'
import ContactForm from '../components/ContactForm'
import { useLang } from '../context/LangContext'

const LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/andrewavilan-work',
    display: 'github.com/andrewavilan-work',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="contact-link-icon" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/andrew-steven-avilan-rodríguez-620125345',
    display: 'linkedin.com/in/andrew-steven-avilan...',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="contact-link-icon" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'WebZap Studio',
    url: 'https://webzap.com.co',
    display: 'webzap.com.co',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-link-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const [emailCopied, setEmailCopied] = useState(false)
  const { t } = useLang()

  const copyEmail = () => {
    navigator.clipboard.writeText('andreavilan.work@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2200)
  }

  return (
    <section id="contacto" className="contact-section">
      <span className="section-watermark" aria-hidden="true">06</span>
      <div className="container">
        <motion.div
          style={{ marginBottom: 60, position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{t.contact.label}</span>
          <h2>{t.contact.heading}</h2>
          <p style={{ marginTop: 12, maxWidth: 480, color: 'var(--c-text)' }}>
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            className="contact-side"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-info-card">
              <p className="contact-info-label">{t.contact.available}</p>
              <p className="contact-info-location">{t.contact.location}</p>

              {/* Email — copy to clipboard */}
              <button className="contact-reveal-btn" onClick={copyEmail} aria-label={t.contact.copyEmail}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {emailCopied ? t.contact.copied : t.contact.copyEmail}
              </button>

              {/* Phone — WhatsApp */}
              <a
                href="https://wa.me/573015292509"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-reveal-btn contact-reveal-btn--wa"
                aria-label={t.contact.whatsapp}
              >
                <svg width="15" height="15" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2h.1c122.3 0 222-99.6 222-222 0-59.3-23-115.1-65.1-157.1zM223.9 446.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 365.7l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.7 184.5-184.6 184.5zm100.5-137.2c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 17.9-17.6 21.4-3.3 3.5-6.5 4-12 1.1-5.5-2.8-23.3-8.6-44.4-27.4-16.4-14.6-27.5-32.7-30.7-38.2-3.3-5.5-.4-8.5 2.5-11.2 2.6-2.6 5.6-6.5 8.3-9.8 2.8-3.4 3.7-5.7 5.6-9.5 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.6-13.3 37.2-26.2 4.6-12.9 4.6-24 3.2-26.2-1.3-2.2-5-3.3-10.5-6.1z"/>
                </svg>
                {t.contact.whatsapp}
              </a>
            </div>

            <div className="contact-links">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  {link.icon}
                  <span>
                    <strong style={{ display: 'block', color: 'var(--c-title)', fontWeight: 700, fontSize: '14px' }}>
                      {link.label}
                    </strong>
                    <span className="contact-link-url">{link.display}</span>
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="footer">
        <p>{t.contact.footer}</p>
      </footer>
    </section>
  )
}
