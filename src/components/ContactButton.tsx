import { ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../data/portfolio';
import { Magnet } from './Magnet';

interface ContactButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function ContactButton({
  label = 'Contact Me',
  href = CONTACT.whatsappUrl,
  className = '',
}: ContactButtonProps) {
  const isExternal = href.startsWith('http');

  return (
    <Magnet padding={70} strength={5}>
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`prism-cta group inline-block active:scale-[0.98] ${className}`}
      >
        <span className="prism-cta-inner px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] sm:px-10 sm:py-3.5 sm:text-sm md:px-11 md:py-4">
          <span>{label}</span>
          <ArrowUpRight className="h-4 w-4 text-[#D7E2EA] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </span>
      </a>
    </Magnet>
  );
}
