import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { CONTACT, COPY, Lang } from '../data/portfolio';
import { ContactButton } from '../components/ContactButton';
import { FadeIn } from '../components/FadeIn';

interface FooterSectionProps {
  lang: Lang;
}

export function FooterSection({ lang }: FooterSectionProps) {
  const t = COPY[lang].footer;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <footer
      id="contact"
      className="relative z-20 border-t border-white/10 bg-[#0C0C0C] px-5 pb-14 pt-20 sm:px-8 sm:pt-28 md:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <FadeIn delay={0} y={20}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-geist text-xs uppercase tracking-[0.2em] text-[#D7E2EA]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {t.eyebrow}
          </span>
        </FadeIn>

        <FadeIn delay={0.1} y={32} className="mt-6">
          <h2
            className="hero-heading max-w-5xl font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 9.5vw, 128px)' }}
          >
            {t.heading}
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <p className="mt-6 max-w-xl font-geist text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
            {t.subtext}
          </p>
        </FadeIn>

        <FadeIn delay={0.3} y={20} className="mt-10 flex flex-col items-center gap-6">
          <ContactButton label={t.cta} />

          <button
            type="button"
            onClick={handleCopyEmail}
            className="luxury-cmd inline-flex items-center gap-3 px-4 pt-3 font-geist text-sm text-[#D7E2EA]/85 transition-colors hover:text-white"
          >
            <span>{CONTACT.email}</span>
            {copied ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                {t.copiedEmail}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-[#6E6E73]">
                <Copy className="h-3.5 w-3.5" />
                {t.copyEmail}
              </span>
            )}
          </button>
        </FadeIn>

        {/* Bottom bar */}
        <div className="mt-20 flex w-full flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs text-[#6E6E73] sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-serif text-base text-[#EDEDED]">
              {CONTACT.name} · {CONTACT.handle}
            </span>
            <span className="font-geist">{t.availability}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-geist text-xs uppercase tracking-widest text-[#D7E2EA]/80">
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={CONTACT.webzap}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              WebZap Studio <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
