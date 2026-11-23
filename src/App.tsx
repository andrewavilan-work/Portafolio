import { useState } from 'react';
import { Lang } from './data/portfolio';
import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { FooterSection } from './sections/FooterSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export function App() {
  const [lang, setLang] = useState<Lang>('es');

  const toggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#EDEDED]" style={{ overflowX: 'clip' }}>
      <main>
        <HeroSection lang={lang} onToggleLang={toggleLang} />
        <MarqueeSection />
        <AboutSection lang={lang} />
        <ServicesSection lang={lang} />
        <ProjectsSection lang={lang} />
      </main>
      <FooterSection lang={lang} />
      <FloatingWhatsApp lang={lang} />
    </div>
  );
}

export default App;
