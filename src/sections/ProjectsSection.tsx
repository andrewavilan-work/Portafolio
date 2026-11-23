import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { COPY, Lang, ProjectCardData } from '../data/portfolio';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';

interface StackingCardProps {
  project: ProjectCardData;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  liveLabel: string;
  repoLabel: string;
}

function StackingProjectCard({
  project,
  index,
  totalCards,
  progress,
  liveLabel,
  repoLabel,
}: StackingCardProps) {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const startRange = index / totalCards;
  const scale = useTransform(progress, [startRange, 1], [1, targetScale]);

  return (
    <div className="sticky top-14 flex h-[86vh] items-start justify-center sm:top-20 md:top-24">
      <motion.article
        style={{
          scale,
          top: `${index * 24}px`,
        }}
        className="relative flex w-full max-w-6xl flex-col gap-5 rounded-[36px] border border-[#D7E2EA]/25 bg-[#0E0E10] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] sm:gap-6 sm:rounded-[48px] sm:p-6 md:rounded-[56px] md:p-8"
      >
        {/* Top Row: Number, Category, Title, Live & Repo Buttons */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="hero-heading shrink-0 font-black leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 90px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-geist text-[11px] font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/55 sm:text-xs">
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
              </div>
              <h3
                className="font-semibold uppercase leading-tight tracking-tight text-[#F2F5F8]"
                style={{ fontSize: 'clamp(1.25rem, 2.7vw, 2.3rem)' }}
              >
                {project.name}
              </h3>
              <p className="mt-1 hidden max-w-lg font-geist text-xs leading-relaxed text-[#9A9FA8] md:block">
                {project.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[#B8C4CE] transition-all duration-200 hover:border-white/40 hover:bg-white/[0.06] hover:text-white sm:px-6 sm:py-3.5 sm:text-sm"
              >
                <span>{repoLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            <LiveProjectButton href={project.liveUrl} label={liveLabel} />
          </div>
        </div>

        {/* Bottom Row: Real Website Screenshots Showcase */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
          {/* Primary real desktop hero capture (60% width) */}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#151517] sm:col-span-7 sm:rounded-[36px] md:rounded-[42px]"
            style={{ height: 'clamp(210px, 32vw, 440px)' }}
          >
            <img
              src={project.images.main}
              alt={`${project.name} — vista principal real`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </a>

          {/* Secondary column (40% width): Real detail capture + extra capture or luxury specs */}
          <div className="flex flex-col gap-3 sm:col-span-5 sm:gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#151517] sm:rounded-[36px] md:rounded-[42px]"
              style={{
                height: project.images.extra
                  ? 'clamp(120px, 15vw, 212px)'
                  : 'clamp(145px, 19vw, 275px)',
              }}
            >
              <img
                src={project.images.detail}
                alt={`${project.name} — vista interior real`}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </a>

            {project.images.extra ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden overflow-hidden rounded-[24px] border border-white/10 bg-[#151517] sm:block sm:rounded-[36px] md:rounded-[42px]"
                style={{ height: 'clamp(120px, 15vw, 212px)' }}
              >
                <img
                  src={project.images.extra}
                  alt={`${project.name} — sección de servicios real`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </a>
            ) : (
              <div className="hidden flex-1 flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#131418] p-5 sm:flex sm:rounded-[34px]">
                <div className="flex items-center justify-between font-geist text-[11px] uppercase tracking-[0.2em] text-[#7A7E86]">
                  <span>{project.role}</span>
                  <span>Live</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-geist text-[11px] tracking-wide text-[#D7E2EA]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

interface ProjectsSectionProps {
  lang: Lang;
}

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const t = COPY[lang].projects;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            id="projects-heading"
            className="hero-heading mb-14 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-24"
            style={{ fontSize: 'clamp(3rem, 12vw, 152px)' }}
          >
            {t.heading}
          </h2>
        </FadeIn>

        {/* Sticky Stacking Flagship Project Cards */}
        <div ref={containerRef} className="relative flex flex-col gap-6 pb-16">
          {t.featured.map((project, index) => (
            <StackingProjectCard
              key={project.number}
              project={project}
              index={index}
              totalCards={t.featured.length}
              progress={scrollYProgress}
              liveLabel={t.liveButton}
              repoLabel={t.repoButton}
            />
          ))}
        </div>

        {/* Remaining Real Live Websites & Personal Lab with Real Previews */}
        <div className="mt-12 border-t border-white/10 pt-16 sm:mt-16 sm:pt-20">
          <FadeIn delay={0} y={24}>
            <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <span className="font-serif text-xl italic text-[#D7E2EA]/80 sm:text-2xl">
                {t.archiveTitle}
              </span>
              <span className="font-geist text-xs uppercase tracking-[0.22em] text-[#6E6E73]">
                05 — 08
              </span>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {t.archive.map((item, idx) => (
              <FadeIn key={item.name} delay={idx * 0.08} y={24}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111215] transition-all duration-300 hover:border-[#D7E2EA]/40 hover:bg-[#15161A]"
                >
                  <div className="relative h-48 overflow-hidden border-b border-white/[0.07] bg-[#0C0C0C] sm:h-56">
                    <img
                      src={item.preview}
                      alt={`${item.name} — vista real`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top brightness-95 transition-transform duration-700 group-hover:scale-[1.04] group-hover:brightness-100"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#0C0C0C]/80 px-3 py-1 font-geist text-[10px] uppercase tracking-[0.2em] text-[#D7E2EA] backdrop-blur-md">
                      {item.number} · {item.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-2xl font-semibold uppercase tracking-tight text-[#F2F5F8]">
                          {item.name}
                        </h3>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#D7E2EA]/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                      </div>
                      <p className="font-geist text-sm leading-relaxed text-[#9A9FA8]">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-white/[0.08] pt-4 font-geist text-xs tracking-wide text-[#D7E2EA]/70">
                      {item.stack}
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
