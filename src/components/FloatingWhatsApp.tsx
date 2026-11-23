import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT, Lang } from '../data/portfolio';

interface FloatingWhatsAppProps {
  lang: Lang;
}

export function FloatingWhatsApp({ lang }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.65);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        lang === 'es'
          ? 'Contactar a Andrew Avilán por WhatsApp'
          : 'Contact Andrew Avilán on WhatsApp'
      }
      className={`prism-cta fixed bottom-5 right-5 z-50 inline-block transition-all duration-300 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="prism-cta-inner px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <MessageCircle className="h-4 w-4 text-[#D7E2EA]" />
        <span className="hidden sm:inline">WhatsApp</span>
      </span>
    </a>
  );
}
