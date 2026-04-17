import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { useLang } from '../context/LangContext'

/*
 * ─── CÓMO AGREGAR UN PROYECTO ────────────────────────────────────────────────
 *
 *  ARCHIVO: src/sections/Projects.jsx  ← ESTÁS AQUÍ, agrega en el array PROJECTS
 *
 *  Campos requeridos:
 *    id           — slug único (sin espacios)
 *    title        — título visible
 *    description  — descripción en español
 *    description_en — descripción en inglés
 *    tags         — array de tecnologías
 *    url          — URL del sitio (null si no existe aún)
 *    category     — 'frontend' | 'artistico' | 'experimentacion' | 'en-desarrollo'
 *    featured     — true para tarjeta ancha (no recomendado, roto el grid)
 *    colors       — [c0, c1, c2, c3] — exactamente los 4 colores de la barra de paleta
 *    scene        — configuración visual exacta del thumbnail (ver ejemplos abajo)
 *
 *  El campo `scene` controla TODO lo visual del thumbnail:
 *    bgColor      — color de fondo del bcard
 *    chromeBg     — color de fondo de la barra del browser
 *    urlColor     — color del texto de la URL
 *    bgGrad       — string CSS del radial-gradient del fondo interior
 *    shimmer      — (opcional) objeto { background, backgroundSize } para shimmer dorado/especial
 *    orbs         — array de orbes: { w, h, bg, top?, left?, right?, bottom?, delay }
 *    pins         — (opcional) array de pines flotantes: { text, top, left?, right?, fontSize?, delay, filter?, opacity? }
 *    icon         — emoji o símbolo central
 *    iconStyle    — (opcional) overrides de estilo del icon
 *    titleStyle   — objeto de estilos inline para el título (gradiente, tamaño, etc.)
 *    subColor     — color rgba del subtítulo
 * ─────────────────────────────────────────────────────────────────────────────
 */
const PROJECTS = [

  /* ── WebZap Studio ─────────────────────────────────────────── */
  {
    id: 'webzap',
    title: 'WebZap Studio',
    description: 'Agencia web para negocios colombianos. Sitios rápidos, únicos y accesibles hechos con código nativo. Sin plantillas, sin atajos.',
    description_en: 'Web agency for Colombian businesses. Fast, unique and accessible sites built with native code. No templates, no shortcuts.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    url: 'https://webzap.com.co',
    category: 'frontend',
    featured: false,
    subtitle: 'Agencia Web · Colombia',
    subtitle_en: 'Web Agency · Colombia',
    // Colores de la barra de paleta (marca real de WebZap)
    colors: ['#3D2FD9', '#C8FF00', '#A89FEC', '#0F0E1A'],
    scene: {
      bgColor: '#0F0E1A',
      chromeBg: '#160D30',
      urlColor: '#6C5DD3',
      bgGrad: 'radial-gradient(ellipse 90% 80% at 50% 20%,rgba(61,47,217,.38) 0%,transparent 68%)',
      orbs: [
        { w: 130, h: 130, bg: 'radial-gradient(circle,rgba(61,47,217,.55) 0%,transparent 70%)', top: -45, left: '2%', delay: '0s' },
        { w: 90, h: 90, bg: 'radial-gradient(circle,rgba(200,255,0,.32) 0%,transparent 70%)', bottom: 20, right: '4%', delay: '1.9s' },
      ],
      icon: '⚡',
      titleStyle: {
        background: 'linear-gradient(90deg,#3D2FD9,#7C6FE8,#C8FF00,#3D2FD9)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 4s linear infinite',
      },
      subColor: 'rgba(200,255,0,.52)',
    },
  },

  /* ── Morpho ─────────────────────────────────────────────────── */
  {
    id: 'morpho',
    title: 'Morpho',
    description: 'Campo vectorial con 1200 partículas que reaccionan al cursor. Aurora interactiva en tiempo real. Sin dependencias.',
    description_en: 'Flow field with 1200 particles that react to the cursor. Real-time interactive aurora. No dependencies.',
    tags: ['Canvas API', 'Generativo', 'Interactivo'],
    url: 'https://webzap.com.co/portafolio/morpho',
    category: 'artistico',
    featured: false,
    subtitle: '✦ Artística · Arte Generativo',
    subtitle_en: '✦ Artistic · Generative Art',
    // Paleta Aurora: magenta · violeta · cian · negro violeta
    colors: ['#FF006E', '#7C3AED', '#00F5FF', '#05001A'],
    scene: {
      bgColor: '#05001A',
      chromeBg: '#0A0028',
      urlColor: '#7C3AED',
      bgGrad: 'radial-gradient(ellipse 85% 75% at 50% 30%,rgba(124,58,237,.4) 0%,rgba(255,0,110,.18) 55%,transparent 72%)',
      shimmer: {
        background: 'linear-gradient(115deg,transparent 28%,rgba(255,0,110,.12) 46%,rgba(0,245,255,.1) 54%,transparent 72%)',
        backgroundSize: '250% 100%',
      },
      orbs: [
        { w: 160, h: 160, bg: 'radial-gradient(circle,rgba(124,58,237,.52) 0%,transparent 70%)', top: -55, left: '4%', delay: '0s' },
        { w: 110, h: 110, bg: 'radial-gradient(circle,rgba(255,0,110,.38) 0%,transparent 70%)', top: '12%', right: '2%', delay: '1.6s' },
        { w: 80, h: 80, bg: 'radial-gradient(circle,rgba(0,245,255,.30) 0%,transparent 70%)', bottom: 20, left: '14%', delay: '2.8s' },
      ],
      icon: '✦',
      iconStyle: { fontSize: 26, letterSpacing: '.05em' },
      titleStyle: {
        background: 'linear-gradient(90deg,#FF006E,#7C3AED,#00F5FF,#FF006E)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 4s linear infinite',
        fontSize: 23,
        letterSpacing: '.14em',
      },
      subColor: 'rgba(167,139,250,.65)',
    },
  },

  /* ── Cosmos ─────────────────────────────────────────────────── */
  {
    id: 'cosmos',
    title: 'Cosmos',
    description: 'Universo 3D con 25 000 partículas estelares, nudo toroidal y cámara reactiva al mouse. Renderizado WebGL en tiempo real.',
    description_en: '3D universe with 25,000 star particles, torus knot and mouse-reactive camera. Real-time WebGL rendering.',
    tags: ['Three.js', 'WebGL', '3D'],
    url: 'https://webzap.com.co/portafolio/cosmos',
    category: 'artistico',
    featured: false,
    subtitle: '🌌 Artística · Three.js 3D',
    subtitle_en: '🌌 Artistic · Three.js 3D',
    // Paleta Cosmos: azul · celeste · ámbar · negro espacial
    colors: ['#3B82F6', '#93C5FD', '#F59E0B', '#000009'],
    scene: {
      bgColor: '#000009',
      chromeBg: '#05050F',
      urlColor: '#60A5FA',
      bgGrad: 'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(59,130,246,.28) 0%,rgba(245,158,11,.1) 55%,transparent 72%)',
      orbs: [
        { w: 150, h: 150, bg: 'radial-gradient(circle,rgba(59,130,246,.42) 0%,transparent 70%)', top: '50%', left: '50%', style: { transform: 'translate(-50%,-60%)' }, delay: '0s' },
        { w: 80, h: 80, bg: 'radial-gradient(circle,rgba(245,158,11,.30) 0%,transparent 70%)', top: -15, right: '8%', delay: '2.2s' },
      ],
      pins: [
        { text: '★', top: '10%', left: '10%', fontSize: 9, delay: '0s', opacity: 0.7 },
        { text: '✦', top: '16%', right: '14%', fontSize: 11, delay: '.9s', opacity: 0.6 },
        { text: '★', top: '68%', left: '20%', fontSize: 8, delay: '1.8s', opacity: 0.5 },
        { text: '✧', top: '28%', left: '68%', fontSize: 10, delay: '2.7s', opacity: 0.7 },
        { text: '★', top: '78%', right: '18%', fontSize: 8, delay: '.5s', opacity: 0.5 },
        { text: '·', top: '45%', left: '5%', fontSize: 7, delay: '1.2s', opacity: 0.4 },
      ],
      icon: '🌌',
      iconStyle: { fontSize: 24 },
      titleStyle: {
        background: 'linear-gradient(90deg,#60A5FA,#93C5FD,#F59E0B,#60A5FA)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 5s linear infinite',
        fontSize: 23,
        letterSpacing: '.14em',
      },
      subColor: 'rgba(96,165,250,.6)',
    },
  },

  /* ── CSSReel ────────────────────────────────────────────────── */
  {
    id: 'cssreel',
    title: 'CSSReel',
    description: 'Librería de snippets CSS propios listos para copiar y pegar. Efectos, animaciones y componentes de autor sin dependencias.',
    description_en: 'Personal CSS snippet library ready to copy and paste. Custom effects, animations and author-made components with no dependencies.',
    tags: ['CSS', 'HTML', 'Snippets'],
    url: 'https://css-reel.vercel.app/',
    category: 'frontend',
    featured: false,
    subtitle: '</> Frontend · CSS Library',
    subtitle_en: '</> Frontend · CSS Library',
    // Paleta CSSReel: verde neón · verde claro · verde menta · negro forestal
    colors: ['#22C55E', '#4ADE80', '#BBFAB1', '#080E09'],
    scene: {
      bgColor: '#080E09',
      chromeBg: '#0F1A11',
      urlColor: '#4ADE80',
      bgGrad: 'radial-gradient(ellipse 80% 70% at 50% 30%,rgba(34,197,94,.30) 0%,rgba(16,185,129,.10) 55%,transparent 72%)',
      shimmer: {
        background: 'linear-gradient(115deg,transparent 28%,rgba(34,197,94,.12) 46%,rgba(187,250,177,.07) 54%,transparent 72%)',
        backgroundSize: '250% 100%',
      },
      orbs: [
        { w: 130, h: 130, bg: 'radial-gradient(circle,rgba(34,197,94,.50) 0%,transparent 70%)', top: -40, left: '4%', delay: '0s' },
        { w: 85, h: 85, bg: 'radial-gradient(circle,rgba(74,222,128,.32) 0%,transparent 70%)', bottom: 18, right: '5%', delay: '2.0s' },
        { w: 58, h: 58, bg: 'radial-gradient(circle,rgba(187,250,177,.22) 0%,transparent 70%)', top: '28%', left: '62%', delay: '3.5s' },
      ],
      pins: [
        { text: '{', top: '11%', left: '9%', fontSize: 24, delay: '0s', opacity: 0.5 },
        { text: '}', top: '66%', right: '9%', fontSize: 24, delay: '0.6s', opacity: 0.5 },
        { text: ';', top: '42%', left: '5%', fontSize: 20, delay: '1.2s', opacity: 0.38 },
        { text: '✦', top: '28%', right: '16%', fontSize: 10, delay: '1.8s', opacity: 0.55 },
        { text: '#', top: '74%', left: '22%', fontSize: 15, delay: '2.4s', opacity: 0.42 },
      ],
      icon: '</>',
      iconStyle: { fontFamily: 'var(--font-mono)', fontSize: 15, color: '#4ADE80', letterSpacing: '.04em' },
      titleStyle: {
        background: 'linear-gradient(90deg,#22C55E,#4ADE80,#BBFAB1,#22C55E)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 4s linear infinite',
        fontSize: 23,
        letterSpacing: '.10em',
      },
      subColor: 'rgba(74,222,128,.62)',
    },
  },

  /* ── Aetheria ────────────────────────────────────────────────── */
  {
    id: 'aetheria',
    title: 'Aetheria',
    description: 'Generador procedural de mundos de fantasía. Bestiarios, civilizaciones y mapas interactivos únicos con cada seed.',
    description_en: 'Procedural fantasy world generator. Unique bestiaries, civilizations and interactive maps with every seed.',
    tags: ['JavaScript', 'Procedural', 'Canvas API'],
    url: 'https://aetheria-phi.vercel.app/',
    category: 'experimentacion',
    featured: false,
    subtitle: '⚜ Experimentación · Generativo',
    subtitle_en: '⚜ Experimentation · Generative',
    // Paleta Aetheria: oro · púrpura · esmeralda · negro profundo
    colors: ['#D97706', '#7C3AED', '#10B981', '#07050F'],
    scene: {
      bgColor: '#07050F',
      chromeBg: '#0E0818',
      urlColor: '#B45309',
      bgGrad: 'radial-gradient(ellipse 75% 65% at 50% 40%,rgba(109,40,217,.35) 0%,rgba(217,119,6,.15) 55%,transparent 72%)',
      shimmer: {
        background: 'linear-gradient(115deg,transparent 28%,rgba(217,119,6,.14) 46%,rgba(16,185,129,.08) 54%,transparent 72%)',
        backgroundSize: '250% 100%',
      },
      orbs: [
        { w: 145, h: 145, bg: 'radial-gradient(circle,rgba(109,40,217,.52) 0%,transparent 70%)', top: -48, left: '5%', delay: '0s' },
        { w: 100, h: 100, bg: 'radial-gradient(circle,rgba(217,119,6,.40) 0%,transparent 70%)', top: '8%', right: '3%', delay: '1.7s' },
        { w: 70, h: 70, bg: 'radial-gradient(circle,rgba(16,185,129,.30) 0%,transparent 70%)', bottom: 22, left: '18%', delay: '2.9s' },
      ],
      pins: [
        { text: '⚜', top: '11%', left: '14%', fontSize: 15, delay: '0s', opacity: 0.85 },
        { text: '🐉', top: '18%', right: '9%', fontSize: 19, delay: '0.8s' },
        { text: '🗺️', top: '62%', left: '10%', fontSize: 14, delay: '1.5s', opacity: 0.75 },
        { text: '✦', top: '38%', left: '56%', fontSize: 10, delay: '2.1s', opacity: 0.55 },
        { text: '🌙', top: '72%', right: '14%', fontSize: 13, delay: '0.4s', opacity: 0.7 },
      ],
      icon: '🐉',
      iconStyle: { fontSize: 24 },
      titleStyle: {
        background: 'linear-gradient(90deg,#D97706,#F59E0B,#7C3AED,#D97706)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 5s linear infinite',
        fontSize: 22,
        letterSpacing: '.12em',
      },
      subColor: 'rgba(217,119,6,.65)',
    },
  },

  /* ── Abyssal ─────────────────────────────────────────────────── */
  {
    id: 'abyssal',
    title: 'Abyssal',
    description: 'Acuario interactivo de aguas profundas. Peces con flocking, medusas pulsantes y partículas de nieve marina.',
    description_en: 'Interactive deep-water aquarium. Flocking fish, pulsing jellyfish and marine snow particles.',
    tags: ['Canvas API', 'Generativo', 'Interactivo'],
    url: 'https://webzap.com.co/portafolio/abyssal',
    category: 'artistico',
    featured: false,
    subtitle: '🌊 Artística · Canvas 2D',
    subtitle_en: '🌊 Artistic · Canvas 2D',
    // Paleta Abyssal: cian · verde biolum · rosa · negro marino
    colors: ['#00E5FF', '#39FF14', '#FF69B4', '#000B1E'],
    scene: {
      bgColor: '#000B1E',
      chromeBg: '#001020',
      urlColor: '#7DF9FF',
      bgGrad: 'radial-gradient(ellipse 80% 70% at 50% 40%,rgba(0,180,220,.28) 0%,rgba(0,80,120,.14) 55%,transparent 78%)',
      orbs: [
        { w: 140, h: 140, bg: 'radial-gradient(circle,rgba(0,180,220,.45) 0%,transparent 70%)', top: -40, left: '6%', delay: '0s' },
        { w: 90, h: 90, bg: 'radial-gradient(circle,rgba(57,255,20,.25) 0%,transparent 70%)', top: '15%', right: '3%', delay: '1.8s' },
        { w: 75, h: 75, bg: 'radial-gradient(circle,rgba(255,105,180,.25) 0%,transparent 70%)', bottom: 22, left: '18%', delay: '3.1s' },
      ],
      pins: [
        { text: '🐟', top: '14%', left: '12%', fontSize: 16, delay: '0s', filter: 'drop-shadow(0 0 5px rgba(0,229,255,.8))' },
        { text: '🐠', top: '42%', left: '58%', fontSize: 11, delay: '.7s', filter: 'drop-shadow(0 0 4px rgba(57,255,20,.7))' },
        { text: '🪼', top: '58%', left: '36%', fontSize: 20, delay: '.3s', filter: 'drop-shadow(0 0 8px rgba(255,105,180,.65))' },
        { text: '🐡', top: '22%', right: '12%', fontSize: 9, delay: '1.1s', filter: 'drop-shadow(0 0 4px rgba(125,249,255,.9))' },
        { text: '🫧', top: '72%', left: '8%', fontSize: 8, delay: '2s', opacity: 0.5 },
        { text: '🫧', top: '32%', left: '42%', fontSize: 6, delay: '1.5s', opacity: 0.4 },
      ],
      icon: '🌊',
      iconStyle: { fontSize: 22, animation: 'pfBcBob 3.2s ease-in-out infinite' },
      titleStyle: {
        background: 'linear-gradient(90deg,#7DF9FF,#00E5FF,#39FF14,#7DF9FF)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pfLuxeSweep 5s linear infinite',
        fontSize: 22,
        letterSpacing: '.12em',
      },
      subColor: 'rgba(125,249,255,.55)',
    },
  },
]

export default function Projects() {
  const [active, setActive] = useState('all')
  const { lang, t } = useLang()

  const FILTERS = [
    { label: t.projects.filters.all,              value: 'all'             },
    { label: t.projects.filters.frontend,         value: 'frontend'        },
    { label: t.projects.filters.artistico,        value: 'artistico'       },
    { label: t.projects.filters.experimentacion,  value: 'experimentacion' },
    { label: t.projects.filters['en-desarrollo'], value: 'en-desarrollo'   },
  ]

  const filtered = PROJECTS
    .filter(p => active === 'all' || p.category === active)
    .map(p => ({
      ...p,
      description: lang === 'en' && p.description_en ? p.description_en : p.description,
      subtitle:    lang === 'en' && p.subtitle_en    ? p.subtitle_en    : p.subtitle,
    }))

  return (
    <section id="proyectos" className="projects-section">
      <span className="section-watermark" aria-hidden="true">03</span>

      <div className="container">
        <motion.div
          style={{ marginBottom: 56, position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">{t.projects.label}</span>
          <h2>{t.projects.heading}</h2>
        </motion.div>

        <motion.div
          className="projects-filters"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn${active === f.value ? ' active' : ''}`}
              onClick={() => setActive(f.value)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} t={t.projects} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
