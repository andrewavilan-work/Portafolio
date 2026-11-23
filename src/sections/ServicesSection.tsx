import { COPY, Lang } from '../data/portfolio';
import { FadeIn } from '../components/FadeIn';

interface ServicesSectionProps {
  lang: Lang;
}

export function ServicesSection({ lang }: ServicesSectionProps) {
  const t = COPY[lang].services;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative z-10 rounded-t-[40px] bg-[#F5F5F3] px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn delay={0} y={40}>
          <h2
            id="services-heading"
            className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 152px)' }}
          >
            {t.heading}
          </h2>
        </FadeIn>

        <div className="flex flex-col">
          {t.items.map((service, i) => (
            <FadeIn key={service.number} delay={i * 0.08} y={30}>
              <article
                className="group flex flex-col gap-4 py-8 transition-colors duration-300 sm:flex-row sm:items-center sm:gap-10 sm:py-10 md:gap-16 md:py-12"
                style={{
                  borderTop: '1px solid rgba(12, 12, 12, 0.14)',
                  borderBottom:
                    i === t.items.length - 1
                      ? '1px solid rgba(12, 12, 12, 0.14)'
                      : undefined,
                }}
              >
                <span
                  className="shrink-0 font-black leading-none tracking-tight text-[#0C0C0C]/90 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ fontSize: 'clamp(3rem, 10vw, 136px)' }}
                >
                  {service.number}
                </span>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <h3
                    className="font-medium uppercase tracking-tight text-[#0C0C0C]"
                    style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.05rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]/65"
                    style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1.2rem)' }}
                  >
                    {service.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
