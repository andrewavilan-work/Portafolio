import { ABOUT_3D_ASSETS, COPY, Lang } from '../data/portfolio';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';
import { FadeIn } from '../components/FadeIn';

interface AboutSectionProps {
  lang: Lang;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const t = COPY[lang].about;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-24 sm:px-8 md:px-10 md:py-32"
    >
      {/* Top-Left cohesive obsidian glass torus */}
      <div className="pointer-events-none absolute left-[0%] top-[4%] z-0 w-[130px] opacity-80 sm:left-[2%] sm:w-[180px] md:left-[3%] md:w-[240px]">
        <FadeIn delay={0.1} x={-70} y={0} duration={0.9}>
          <img
            src={ABOUT_3D_ASSETS.torus}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="sculpture-blend h-auto w-full select-none object-contain"
          />
        </FadeIn>
      </div>

      {/* Bottom-Left cohesive smoked-quartz crystal monolith */}
      <div className="pointer-events-none absolute bottom-[5%] left-[2%] z-0 w-[125px] opacity-80 sm:left-[5%] sm:w-[175px] md:bottom-[7%] md:left-[7%] md:w-[225px]">
        <FadeIn delay={0.25} x={-70} y={0} duration={0.9}>
          <img
            src={ABOUT_3D_ASSETS.crystal}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="sculpture-blend h-auto w-full select-none object-contain"
          />
        </FadeIn>
      </div>

      {/* Top-Right cohesive dark liquid-titanium ribbon */}
      <div className="pointer-events-none absolute right-[0%] top-[4%] z-0 w-[130px] opacity-80 sm:right-[2%] sm:w-[185px] md:right-[3%] md:w-[245px]">
        <FadeIn delay={0.15} x={70} y={0} duration={0.9}>
          <img
            src={ABOUT_3D_ASSETS.ribbon}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="sculpture-blend h-auto w-full select-none object-contain"
          />
        </FadeIn>
      </div>

      {/* Bottom-Right cohesive obsidian chrome spheres */}
      <div className="pointer-events-none absolute bottom-[5%] right-[2%] z-0 w-[135px] opacity-80 sm:right-[5%] sm:w-[185px] md:bottom-[7%] md:right-[7%] md:w-[240px]">
        <FadeIn delay={0.3} x={70} y={0} duration={0.9}>
          <img
            src={ABOUT_3D_ASSETS.spheres}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="sculpture-blend h-auto w-full select-none object-contain"
          />
        </FadeIn>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-12 sm:gap-16 md:gap-20">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              id="about-heading"
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 152px)' }}
            >
              {t.heading}
            </h2>
          </FadeIn>

          <AnimatedText
            text={t.text}
            className="max-w-[580px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          />

          {/* Sobrio Luxury Credentials Strip */}
          <FadeIn delay={0.2} y={24} className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/[0.09] bg-[#111215]/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:grid-cols-4 sm:gap-4 sm:p-5">
              {t.credentials.map((cred) => (
                <div key={cred.label} className="flex flex-col gap-0.5 text-center">
                  <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-[#7A7E86]">
                    {cred.label}
                  </span>
                  <span className="font-geist text-xs font-medium text-[#E5ECF2] sm:text-sm">
                    {cred.value}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.25} y={20}>
          <ContactButton label={t.cta} />
        </FadeIn>
      </div>
    </section>
  );
}
