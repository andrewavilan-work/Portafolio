import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

/* ── SVG TECH LOGOS ─────────────────────────────────────────────── */
const SvgHTML = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M4 3l1.5 16.5L12 21l6.5-1.5L20 3H4z" fill="#E34F26"/>
    <path d="M12 4.5v15l5.3-1.3L18.5 4.5H12z" fill="#EF652A"/>
    <path d="M12 10.5H9.5l-.2-2H12V7H7.8l.5 5.5H12v-2zm0 4.4l-3.4-.9-.2-2.5H6.8l.4 4.5L12 17.5v-2.6z" fill="white"/>
    <path d="M12 10.5v2h2.3l-.2 2.4-2.1.6V17.5l3.9-1.1.3-3.4H12zm0-3.5v1.5h4.5l.1-1.5H12z" fill="#EBEBEB"/>
  </svg>
)

const SvgCSS = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M4 3l1.5 16.5L12 21l6.5-1.5L20 3H4z" fill="#1572B6"/>
    <path d="M12 4.5v15l5.3-1.3L18.5 4.5H12z" fill="#33A9DC"/>
    <path d="M12 13.8l-2.9-.8-.2-2H7.3l.4 4.3L12 16.5v-2.7zm0-6.3H7.6l.2 2H12v-2zm0 0v2h4.3l-.4 3.7-3.9 1.1v2.7l3.9-1.1.5-6.4H12z" fill="white"/>
    <path d="M12 7.5v2H9.8l-.1-2H12z" fill="#EBEBEB"/>
  </svg>
)

const SvgJS = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
    <path d="M7.5 15.8c.4.7.9 1.2 1.8 1.2.8 0 1.3-.4 1.3-1V8.5h2V16c0 2-1.2 2.9-2.9 2.9-1.6 0-2.5-.8-3-1.8l1.8-1.3z" fill="#323330"/>
    <path d="M14.5 15.7c.5.8 1.1 1.4 2.2 1.4.9 0 1.5-.5 1.5-1.1 0-.8-.6-1-1.6-1.5l-.5-.2c-1.6-.7-2.7-1.5-2.7-3.3 0-1.6 1.2-2.9 3.2-2.9 1.4 0 2.4.5 3.1 1.7l-1.7 1.1c-.4-.7-.8-1-1.4-1-.6 0-1 .4-1 1 0 .7.4 1 1.4 1.4l.5.2c1.9.8 3 1.6 3 3.4 0 2-1.5 3-3.6 3-2 0-3.3-1-3.9-2.2l1.5-.9z" fill="#323330"/>
  </svg>
)

const SvgReact = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
    <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
    <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
  </svg>
)

const SvgPython = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M12 2C9.2 2 7 3.4 7 5.2V8h5V9H5.5C3.6 9 2 10.5 2 12.8c0 2.2 1.4 3.7 3.5 3.7H7v-2.2C7 12.4 9 11 11.5 11H13c2.2 0 4-1.6 4-3.7V5.2C17 3.4 14.8 2 12 2zm-1.2 2c.7 0 1.2.5 1.2 1.1 0 .6-.5 1.1-1.2 1.1-.7 0-1.2-.5-1.2-1.1 0-.6.5-1.1 1.2-1.1z" fill="#3776AB"/>
    <path d="M12 22c2.8 0 5-1.4 5-3.2V16h-5v-1h6.5c1.9 0 3.5-1.5 3.5-3.8 0-2.2-1.4-3.7-3.5-3.7H17v2.2c0 1.9-2 3.3-4.5 3.3H11c-2.2 0-4 1.6-4 3.7v2.1c0 1.8 2.2 3.2 5 3.2zm1.2-2c-.7 0-1.2-.5-1.2-1.1 0-.6.5-1.1 1.2-1.1.7 0 1.2.5 1.2 1.1 0 .6-.5 1.1-1.2 1.1z" fill="#FFD43B"/>
  </svg>
)

const SvgGit = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M23 11.3L12.7 1a1 1 0 00-1.4 0L9 3.3l2.7 2.7c.6-.2 1.4-.1 1.9.5.5.5.6 1.3.4 1.9l2.6 2.6c.6-.2 1.3-.1 1.9.4a1.8 1.8 0 010 2.6 1.8 1.8 0 01-2.5 0 1.8 1.8 0 01-.3-2l-2.4-2.4v6.4a1.8 1.8 0 01.5 2.9 1.8 1.8 0 01-2.6 0 1.8 1.8 0 010-2.6c.2-.2.5-.4.8-.4V9.3c-.3-.1-.6-.2-.8-.4a1.8 1.8 0 01-.4-2L8.2 4.3 1 11.4a1 1 0 000 1.4l10.3 10.3a1 1 0 001.4 0L23 12.7a1 1 0 000-1.4z" fill="#F05032"/>
  </svg>
)

const SvgGitHub = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor"/>
  </svg>
)

const SvgFramer = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M4 4h16v8H12L4 4z" fill="#0055FF"/>
    <path d="M4 12h8l8 8H4v-8z" fill="#0044CC"/>
    <path d="M4 20h8v-8L4 20z" fill="#0033AA"/>
  </svg>
)

const SvgThree = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M12 2L2 19.5h20L12 2zm0 3.5l7.5 13h-15L12 5.5z" fill="currentColor" opacity="0.9"/>
    <path d="M8.5 15.5l3.5-6 3.5 6H8.5z" fill="currentColor" opacity="0.4"/>
  </svg>
)

const SvgTailwind = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 17.85 9.5 19 12 19c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" fill="#38BDF8"/>
  </svg>
)

const LOGO_MAP = {
  'HTML5':         <SvgHTML />,
  'CSS3':          <SvgCSS />,
  'JavaScript':    <SvgJS />,
  'React':         <SvgReact />,
  'Python':        <SvgPython />,
  'Git':           <SvgGit />,
  'GitHub':        <SvgGitHub />,
  'Framer Motion': <SvgFramer />,
  'Three.js':      <SvgThree />,
  'Tailwind':      <SvgTailwind />,
}

const SKILL_GROUPS_DATA = [
  {
    key: 'frontend',
    skills: [
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'JavaScript' },
      { name: 'React' },
    ],
  },
  {
    key: 'backend',
    skills: [
      { name: 'Python' },
      { name: 'Git' },
      { name: 'GitHub' },
    ],
  },
  {
    key: 'animation',
    skills: [
      { name: 'Framer Motion' },
      { name: 'Three.js' },
    ],
  },
]

export default function Skills() {
  const { t } = useLang()

  return (
    <section id="habilidades" className="skills-section">
      <span className="section-watermark" aria-hidden="true">04</span>

      {/* CSS animated background — no 3D */}
      <div className="skills-bg" aria-hidden="true">
        <div className="skills-orb skills-orb-1" />
        <div className="skills-orb skills-orb-2" />
        <div className="skills-orb skills-orb-3" />
        <div className="skills-dots" />
      </div>

      <div className="container">
        <motion.div
          style={{ marginBottom: 56, position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{t.skills.label}</span>
          <h2>{t.skills.heading}</h2>
        </motion.div>

        <div className="skills-groups">
          {SKILL_GROUPS_DATA.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: gi * 0.12 }}
            >
              <p className="skill-group-label">{t.skills[group.key]}</p>
              <div className="skills-grid">
                {group.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: gi * 0.1 + si * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="skill-flip">
                      <div className="skill-face skill-logo-wrap">
                        {LOGO_MAP[skill.name]}
                      </div>
                    </div>
                    <span className="skill-name">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
