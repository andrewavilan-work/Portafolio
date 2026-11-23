import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { COPY, Lang } from '../data/portfolio';
import { ContactButton } from '../components/ContactButton';
import { FadeIn } from '../components/FadeIn';
import { PrismBackground } from '../components/PrismBackground';

interface HeroSectionProps {
  lang: Lang;
  onToggleLang: () => void;
}

export function HeroSection({ lang, onToggleLang }: HeroSectionProps) {
  const t = COPY[lang];
  const [activeTab, setActiveTab] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectTab = (idx: number) => {
    if (idx === activeTab) return;
    setSwapping(true);
    window.setTimeout(() => {
      setActiveTab(idx);
      setSwapping(false);
    }, 150);
  };

  const handleCopy = async () => {
    const text = t.hero.tabs[activeTab]?.cmd ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API may be blocked in non-HTTPS contexts
    }
  };

  return (
    <section
      id="top"
      aria-label="Andrew Avilán — Hero"
      className="relative flex min-h-screen flex-col justify-between bg-[#0C0C0C]"
      style={{ overflowX: 'clip' }}
    >
      {/* Real-time Three.js 3D Glass Prism & Rainbow Dispersion Engine */}
      <PrismBackground />

      {/* Top Navigation */}
      <FadeIn delay={0} y={-20} className="relative z-20 w-full">
        <header className="flex w-full items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <nav
            aria-label="Primary navigation"
            className="flex flex-1 items-center justify-between gap-4 pr-4 sm:pr-8 md:pr-12"
          >
            <a
              href="#about"
              className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {t.nav.about}
            </a>
            <a
              href="#services"
              className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {t.nav.services}
            </a>
            <a
              href="#projects"
              className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {t.nav.projects}
            </a>
            <a
              href="#contact"
              className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Minimal luxury language switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-geist text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:bg-white/10"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </header>
      </FadeIn>

      {/* Monumental Display Heading */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-10">
        <FadeIn delay={0.15} y={32}>
          <div className="mb-1 flex items-center justify-between px-1 md:mb-2">
            <span className="font-serif text-sm italic tracking-wide text-[#D7E2EA]/75 sm:text-base md:text-lg">
              {t.hero.eyebrow}
            </span>
            <span className="hidden items-center gap-2 font-geist text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/55 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t.hero.badge}
            </span>
          </div>
          <h1 className="hero-heading-sculpt mt-2 w-full whitespace-nowrap text-center text-[11.2vw] font-black uppercase leading-none tracking-tight sm:mt-1 sm:text-[12vw] md:-mt-2 md:text-[12.6vw] lg:text-[13.1vw]">
            {t.hero.heading}
          </h1>
        </FadeIn>
      </div>

      {/* Bottom Bar: Tagline + Luxury Halo Command Tabs on Left, ContactButton on Right */}
      <div className="relative z-20 flex flex-col justify-between gap-6 px-6 pb-7 sm:flex-row sm:items-end sm:pb-8 md:px-10 md:pb-10">
        <div className="flex flex-col gap-5">
          <FadeIn delay={0.35} y={20}>
            <p
              className="max-w-[260px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[320px] md:max-w-[390px]"
              style={{ fontSize: 'clamp(0.78rem, 1.35vw, 1.35rem)' }}
            >
              {t.hero.tagline}
            </p>
          </FadeIn>

          {/* Luxury interactive specs bar inspired by halo */}
          <FadeIn delay={0.45} y={16}>
            <div className="max-w-[420px] font-geist">
              <div
                role="tablist"
                aria-label="Quick developer info"
                className="mb-2.5 flex items-center gap-2 text-xs sm:text-sm"
              >
                {t.hero.tabs.map((tab, idx) => (
                  <span key={tab.label} className="flex items-center gap-2">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === idx}
                      onClick={() => handleSelectTab(idx)}
                      className={`py-0.5 transition-colors duration-200 ${
                        activeTab === idx
                          ? 'text-[#EDEDED]'
                          : 'text-[#6E6E73] hover:text-[#A1A1A1]'
                      }`}
                    >
                      {tab.label}
                    </button>
                    {idx < t.hero.tabs.length - 1 && (
                      <span className="text-[11px] text-[#6E6E73]" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>

              <div className="luxury-cmd flex items-center justify-between gap-3 pt-2.5 text-xs text-[#D7E2EA]/90 sm:text-sm">
                <span
                  className={`truncate transition-all duration-200 ${
                    swapping ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                >
                  {t.hero.tabs[activeTab]?.cmd}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? t.hero.copiedLabel : t.hero.copyLabel}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[#6E6E73] transition-colors duration-200 hover:bg-white/[0.06] hover:text-[#EDEDED]"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.5} y={20} className="self-start sm:self-end">
          <ContactButton label={t.hero.cta} />
        </FadeIn>
      </div>
    </section>
  );
}
