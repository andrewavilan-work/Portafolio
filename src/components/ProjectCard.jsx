import { useRef } from 'react'

/* ── Thumbnail interior — lee todo de project.scene ──────────────────── */
function CardScene({ project }) {
  const s = project.scene
  const [c0, c1, c2, c3] = project.colors ?? ['#5C3E9E','#D4845A','#C4B4E8','#0D0A18']

  return (
    <div className="pf-bcard" style={{ background: s.bgColor ?? c3 }}>

      {/* Radial glow */}
      <div className="pf-bc-bg" style={{ background: s.bgGrad }} />

      {/* Shimmer (opcional) */}
      {s.shimmer && (
        <div
          className="pf-bc-shimmer"
          style={{
            background: s.shimmer.background,
            backgroundSize: s.shimmer.backgroundSize ?? '250% 100%',
          }}
        />
      )}

      {/* Orbs */}
      <div className="pf-bc-orbs">
        {(s.orbs ?? []).map((o, i) => (
          <div
            key={i}
            className="pf-bc-orb"
            style={{
              width:  o.w,
              height: o.h,
              background: o.bg,
              top:    o.top,
              left:   o.left,
              right:  o.right,
              bottom: o.bottom,
              animationDelay: o.delay,
              ...(o.style ?? {}),
            }}
          />
        ))}
      </div>

      {/* Pins flotantes (estrellas, peces, etc.) */}
      {s.pins && (
        <div className="pf-bc-pins">
          {s.pins.map((p, i) => (
            <div
              key={i}
              className="pf-bc-pin"
              style={{
                top:    p.top,
                left:   p.left,
                right:  p.right,
                fontSize: p.fontSize ?? 16,
                animationDelay: p.delay,
                filter:  p.filter,
                opacity: p.opacity,
              }}
            >
              {p.text}
            </div>
          ))}
        </div>
      )}

      {/* Hero: icon + título + subtítulo */}
      <div className="pf-bc-hero">
        <div className="pf-bc-icon" style={s.iconStyle ?? {}}>
          {s.icon ?? '◈'}
        </div>
        <div className="pf-bc-title" style={s.titleStyle ?? { color: c0 }}>
          {project.title}
        </div>
        <div className="pf-bc-sub" style={{ color: s.subColor ?? `${c1}70` }}>
          {project.subtitle ?? project.tags?.[0] ?? ''}
        </div>
      </div>

      {/* Barra de paleta — usa project.colors directamente */}
      <div className="pf-bc-pal">
        {[c0, c1, c2, c3].map((c, i) => (
          <span key={i} className="pf-bc-pal-sw" style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

/* ── Tarjeta principal ────────────────────────────────────────────────── */
export default function ProjectCard({ project, t = {} }) {
  const s = project.scene ?? {}
  const [, , , c3] = project.colors ?? ['#5C3E9E','#D4845A','#C4B4E8','#0D0A18']

  const urlDisplay = project.url
    ? project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `andrew · ${project.id}`

  const overlayText  = t.overlay  ?? 'Ver sitio completo →'
  const ctaText      = t.cta      ?? 'Ver sitio completo'

  return (
    <div className="pf-card">

      {/* ── Thumbnail ── */}
      <div className="pf-thumb">
        <div className="pf-browser-frame" style={{ background: s.bgColor ?? c3 }}>

          {/* Barra del browser */}
          <div
            className="pf-browser-chrome"
            style={{ background: s.chromeBg ?? `${c3}f0` }}
          >
            <div className="pf-bc-dots"><span /><span /><span /></div>
            <div
              className="pf-bc-url"
              style={s.urlColor ? { color: s.urlColor } : {}}
            >
              {urlDisplay}
            </div>
          </div>

          {/* Pantalla */}
          <div className="pf-screen-wrap">
            <CardScene project={project} />
          </div>
        </div>

        {/* Overlay al hover — es un <a> para que funcione el clic */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pf-overlay"
            aria-label={`Visit ${project.title}`}
          >
            <div className="pf-ol-pill">{overlayText}</div>
          </a>
        )}
      </div>

      {/* ── Info ── */}
      <div className="pf-info">
        <div className="pf-cat">{project.subtitle ?? project.category}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="pf-tags">
          {project.tags.map(tag => (
            <span key={tag} className="pf-tag">{tag}</span>
          ))}
        </div>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pf-cta"
          >
            {ctaText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
