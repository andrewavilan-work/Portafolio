import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MARQUEE_ROW_1, MARQUEE_ROW_2, MarqueeTile } from '../data/portfolio';

const row1 = [...MARQUEE_ROW_1, ...MARQUEE_ROW_1, ...MARQUEE_ROW_1];
const row2 = [...MARQUEE_ROW_2, ...MARQUEE_ROW_2, ...MARQUEE_ROW_2];

function MarqueeCard({ tile }: { tile: MarqueeTile }) {
  return (
    <a
      href={tile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative h-[195px] w-[310px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#121214] shadow-[0_14px_36px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:border-[#D7E2EA]/35 sm:h-[230px] sm:w-[370px] md:h-[265px] md:w-[420px]"
    >
      <img
        src={tile.src}
        alt={`${tile.title} — ${tile.subtitle}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top brightness-[0.9] contrast-[1.03] transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-100"
      />
      {/* Subtle obsidian bottom scrim with real project attribution */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,12,12,0) 0%, rgba(12,12,12,0.78) 65%, rgba(12,12,12,0.95) 100%)',
        }}
      >
        <div>
          <p className="font-kanit text-sm font-medium uppercase tracking-wider text-[#EDEDED]">
            {tile.title}
          </p>
          <p className="font-geist text-[11px] tracking-wide text-[#A1A1A1]">
            {tile.subtitle}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-[#D7E2EA]/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
      </div>
    </a>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.offsetTop;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.28;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translate3d(${offset - 220}px, 0, 0)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translate3d(${-(offset - 220)}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Real websites built by Andrew Avilán"
      className="relative overflow-hidden bg-[#0C0C0C] pb-12 pt-20 sm:pt-28 md:pt-36"
    >
      {/* Obsidian edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-28"
        style={{
          background: 'linear-gradient(90deg, #0C0C0C 0%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 sm:w-28"
        style={{
          background: 'linear-gradient(270deg, #0C0C0C 0%, transparent 100%)',
        }}
      />

      <div className="flex flex-col gap-3.5">
        <div
          ref={row1Ref}
          className="flex -ml-[620px] gap-3.5"
          style={{ willChange: 'transform' }}
        >
          {row1.map((tile, idx) => (
            <MarqueeCard key={`r1-${idx}`} tile={tile} />
          ))}
        </div>

        <div
          ref={row2Ref}
          className="flex -ml-[240px] gap-3.5"
          style={{ willChange: 'transform' }}
        >
          {row2.map((tile, idx) => (
            <MarqueeCard key={`r2-${idx}`} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
