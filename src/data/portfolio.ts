export type Lang = 'es' | 'en';

export const CONTACT = {
  name: 'Andrew Avilán',
  handle: 'andrew.dev',
  email: 'andreavilan.work@gmail.com',
  whatsappNumber: '573015292509',
  whatsappUrl:
    'https://wa.me/573015292509?text=Hola%20Andrew%2C%20vi%20tu%20portafolio%20y%20quiero%20hablar%20sobre%20un%20proyecto%20de%20IA%20o%20software.',
  github: 'https://github.com/andrewavilan-work',
  linkedin:
    'https://www.linkedin.com/in/andrew-steven-avilan-rodr%C3%ADguez-620125345',
  webzap: 'https://webzap.com.co/',
  location: 'Bogotá, Colombia',
};

export interface MarqueeTile {
  src: string;
  title: string;
  subtitle: string;
  url: string;
}

export const MARQUEE_ROW_1: MarqueeTile[] = [
  {
    src: '/projects/neural-ink-1.png',
    title: 'Neural-Ink V5',
    subtitle: 'Python · PyTorch · AMD MI300X',
    url: 'https://neural-ink-demo.vercel.app/',
  },
  {
    src: '/projects/webzap-1.png',
    title: 'WebZap Studio',
    subtitle: 'Agencia Web · Founder',
    url: 'https://webzap.com.co/',
  },
  {
    src: '/projects/neural-ink-2.png',
    title: 'Neural-Ink · Style Transfer',
    subtitle: 'ONNX FP16 · Real-Time 3D AI',
    url: 'https://neural-ink-demo.vercel.app/',
  },
  {
    src: '/projects/arqon-1.png',
    title: 'ARQON Constructora',
    subtitle: 'Arquitectura · Medellín',
    url: 'https://webzap.com.co/portafolio/arqon',
  },
  {
    src: '/projects/casa-ceiba-1.png',
    title: 'Casa Ceiba',
    subtitle: 'Hotel Boutique · Cartagena',
    url: 'https://webzap.com.co/portafolio/casa-ceiba',
  },
  {
    src: '/projects/navaja-1.png',
    title: 'NAVAJA Barber Club',
    subtitle: 'Editorial · Bogotá',
    url: 'https://webzap.com.co/portafolio/navaja',
  },
  {
    src: '/projects/aetheria-1.png',
    title: 'Aetheria',
    subtitle: 'Procedural World Engine',
    url: 'https://aetheria-phi.vercel.app/',
  },
];

export const MARQUEE_ROW_2: MarqueeTile[] = [
  {
    src: '/projects/neural-ink-3.png',
    title: 'Neural-Ink · 13ms Latency',
    subtitle: 'Edge Inference · DirectML',
    url: 'https://neural-ink-demo.vercel.app/',
  },
  {
    src: '/projects/casa-ceiba-2.png',
    title: 'Casa Ceiba · Experiencia',
    subtitle: 'Reservas Directas',
    url: 'https://webzap.com.co/portafolio/casa-ceiba',
  },
  {
    src: '/projects/aura-1.png',
    title: 'AURA Studio',
    subtitle: 'Wellness Boutique · Usaquén',
    url: 'https://webzap.com.co/portafolio/aura',
  },
  {
    src: '/projects/webzap-2.png',
    title: 'WebZap · Estrategia',
    subtitle: 'Ingeniería & Conversión',
    url: 'https://webzap.com.co/',
  },
  {
    src: '/projects/arqon-2.png',
    title: 'ARQON · Portafolio',
    subtitle: 'Proyectos de Obra',
    url: 'https://webzap.com.co/portafolio/arqon',
  },
  {
    src: '/projects/cssreel-1.png',
    title: 'CSSReel',
    subtitle: 'Author CSS Library',
    url: 'https://css-reel.vercel.app/',
  },
  {
    src: '/projects/navaja-2.png',
    title: 'NAVAJA · Carta',
    subtitle: 'UI Editorial Oscura',
    url: 'https://webzap.com.co/portafolio/navaja',
  },
  {
    src: '/projects/aetheria-2.png',
    title: 'Aetheria · Civilizaciones',
    subtitle: 'Canvas & Generación Procedural',
    url: 'https://aetheria-phi.vercel.app/',
  },
];

export const ABOUT_3D_ASSETS = {
  torus: '/sculptures/sculpture-torus.jpg',
  crystal: '/sculptures/sculpture-crystal.jpg',
  ribbon: '/sculptures/sculpture-ribbon.jpg',
  spheres: '/sculptures/sculpture-spheres.jpg',
};

export interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

export interface ProjectCardData {
  number: string;
  category: string;
  name: string;
  subtitle: string;
  liveUrl: string;
  repoUrl?: string;
  year: string;
  role: string;
  tags: string[];
  images: {
    main: string;
    detail: string;
    extra?: string;
  };
}

export interface ArchiveProject {
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  stack: string;
  preview: string;
}

export interface HeroTab {
  label: string;
  cmd: string;
}

export const COPY: Record<
  Lang,
  {
    nav: {
      about: string;
      services: string;
      projects: string;
      contact: string;
    };
    hero: {
      eyebrow: string;
      badge: string;
      heading: string;
      tagline: string;
      cta: string;
      tabs: HeroTab[];
      copiedLabel: string;
      copyLabel: string;
    };
    about: {
      heading: string;
      text: string;
      cta: string;
      credentials: { label: string; value: string }[];
    };
    services: {
      heading: string;
      items: ServiceItem[];
    };
    projects: {
      heading: string;
      liveButton: string;
      repoButton: string;
      featured: ProjectCardData[];
      archiveTitle: string;
      archive: ArchiveProject[];
    };
    footer: {
      eyebrow: string;
      heading: string;
      subtext: string;
      cta: string;
      copyEmail: string;
      copiedEmail: string;
      availability: string;
    };
  }
> = {
  es: {
    nav: {
      about: 'Sobre mí',
      services: 'Servicios',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    hero: {
      eyebrow: 'andrew.dev · Bogotá, CO',
      badge: 'Python · AI Agents · 3D Optics',
      heading: "Hi, i\u2019m andrew",
      tagline:
        'ingeniero de software enfocado en python, agentes de ia y sistemas digitales de alto nivel',
      cta: 'Hablemos',
      tabs: [
        {
          label: 'AI & Python',
          cmd: 'Python · Agentes de IA · PyTorch · ONNX · LLMs · Automation',
        },
        {
          label: 'Flagship AI',
          cmd: 'Neural-Ink V5 — AMD MI300X -> ONNX FP16 (13ms Latency)',
        },
        {
          label: 'Web & 3D',
          cmd: 'React · TypeScript · Three.js · WebGL · WebZap Studio',
        },
        {
          label: 'Contacto',
          cmd: 'andreavilan.work@gmail.com · +57 301 529 2509',
        },
      ],
      copiedLabel: 'Copiado',
      copyLabel: 'Copiar',
    },
    about: {
      heading: 'Sobre mí',
      text: 'Soy Andrew Avilán, ingeniero de sistemas en formación en la Universidad de los Andes, ex-UNAL y fundador de WebZap Studio. Desarrollo agentes autónomos de IA, pipelines de machine learning en Python — como Neural-Ink V5 entrenado en AMD MI300X — y productos digitales sobrios diseñados para escalar.',
      cta: 'Iniciar Proyecto',
      credentials: [
        { label: 'Core Stack', value: 'Python & Agentes de IA' },
        { label: 'IA Aplicada', value: 'Neural-Ink V5 · AMD MI300X' },
        { label: 'Formación', value: 'Ing. de Sistemas · Uniandes' },
        { label: 'Estudio', value: 'Founder @ WebZap Studio' },
      ],
    },
    services: {
      heading: 'Servicios',
      items: [
        {
          number: '01',
          name: 'Agentes de IA & Automatización',
          description:
            'Diseño e implementación de agentes autónomos con LLMs, flujos multi-agente, integración con APIs/CRMs/WhatsApp y automatización inteligente de procesos de negocio.',
        },
        {
          number: '02',
          name: 'Ingeniería en Python & Pipelines ML',
          description:
            'Arquitectura backend en Python, entrenamiento y cuantización de modelos con PyTorch y ONNX FP16, inferencia en tiempo real y sistemas de datos escalables.',
        },
        {
          number: '03',
          name: 'Ingeniería Web & React / TypeScript',
          description:
            'Aplicaciones web rápidas, modulares y robustas conectadas a backends de IA y APIs modernas — código limpio pensado para crecer.',
        },
        {
          number: '04',
          name: '3D Interactivo, Shaders & WebGL',
          description:
            'Escenas Three.js en tiempo real, shaders GLSL/Compute y gráficos generativos que transforman un producto técnico en una experiencia inolvidable.',
        },
        {
          number: '05',
          name: 'Sitios Luxury & Conversión',
          description:
            'Desarrollo editorial a medida sin plantillas a través de WebZap Studio — estética sobria, SEO técnico y rendimiento 90+ en Lighthouse.',
        },
      ],
    },
    projects: {
      heading: 'Proyectos',
      liveButton: 'Ver Demo Viva',
      repoButton: 'GitHub',
      featured: [
        {
          number: '01',
          category: 'Python · PyTorch · AMD Pervasive AI',
          name: 'Neural-Ink V5',
          subtitle:
            'Pipeline Pervasive AI de nube a cliente (AMD Instinct MI300X -> ONNX FP16) que transforma entornos 3D en arte dibujado a mano en tiempo real con 13–20 ms de latencia.',
          liveUrl: 'https://neural-ink-demo.vercel.app/',
          repoUrl: 'https://github.com/andrewavilan-work/Neural-Ink',
          year: '2026',
          role: 'AI Pipeline & Python / Shaders',
          tags: ['Python', 'PyTorch · ROCm', 'ONNX FP16', 'Unity URP'],
          images: {
            main: '/projects/neural-ink-1.png',
            detail: '/projects/neural-ink-2.png',
            extra: '/projects/neural-ink-3.png',
          },
        },
        {
          number: '02',
          category: 'Agencia · Fundador',
          name: 'WebZap Studio',
          subtitle:
            'Mi estudio de ingeniería web para negocios en Colombia. Sitios rápidos, accesibles y construidos en código nativo sin plantillas.',
          liveUrl: 'https://webzap.com.co/',
          year: '2025 — 2026',
          role: 'Founder & Lead Engineer',
          tags: ['Arquitectura Web', 'Conversión', 'SEO Técnico'],
          images: {
            main: '/projects/webzap-1.png',
            detail: '/projects/webzap-2.png',
            extra: '/projects/webzap-3.png',
          },
        },
        {
          number: '03',
          category: 'Arquitectura · Medellín',
          name: 'ARQON Constructora',
          subtitle:
            'Sitio corporativo de arquitectura e ingeniería para constructora en Medellín, enfocado en portafolio de obra y captación de proyectos.',
          liveUrl: 'https://webzap.com.co/portafolio/arqon',
          year: '2026',
          role: 'Design & Development',
          tags: ['Editorial Luxury', 'HTML/CSS/JS', 'Alto Contraste'],
          images: {
            main: '/projects/arqon-1.png',
            detail: '/projects/arqon-2.png',
          },
        },
        {
          number: '04',
          category: 'Hospitalidad · Cartagena',
          name: 'Casa Ceiba Boutique',
          subtitle:
            'Refugio editorial para hotel boutique en una casona republicana de Getsemaní, con barra de reserva directa por WhatsApp.',
          liveUrl: 'https://webzap.com.co/portafolio/casa-ceiba',
          year: '2026',
          role: 'Design & Conversion UI',
          tags: ['Hospitalidad', 'WhatsApp Booking', 'Mobile-First'],
          images: {
            main: '/projects/casa-ceiba-1.png',
            detail: '/projects/casa-ceiba-2.png',
          },
        },
      ],
      archiveTitle: 'Más Obras Reales & Laboratorio Propio',
      archive: [
        {
          number: '05',
          name: 'NAVAJA Barber Club',
          category: 'Grooming Editorial · Bogotá',
          description:
            'Sitio oscuro editorial para barbería de autor en Chapinero con carta interactiva de servicios y reserva directa.',
          url: 'https://webzap.com.co/portafolio/navaja',
          stack: 'Editorial UI · Código Nativo',
          preview: '/projects/navaja-1.png',
        },
        {
          number: '06',
          name: 'AURA Studio',
          category: 'Wellness Boutique · Usaquén',
          description:
            'Experiencia web sobria para estudio de belleza con catálogo filtrable de rituales y agenda por WhatsApp.',
          url: 'https://webzap.com.co/portafolio/aura',
          stack: 'UI Systems · Conversión',
          preview: '/projects/aura-1.png',
        },
        {
          number: '07',
          name: 'Aetheria',
          category: 'Experimento · Procedural',
          description:
            'Generador procedural de mundos fantásticos con mapas interactivos, bestiarios y civilizaciones únicas por semilla.',
          url: 'https://aetheria-phi.vercel.app/',
          stack: 'JavaScript · Canvas API',
          preview: '/projects/aetheria-1.png',
        },
        {
          number: '08',
          name: 'CSSReel',
          category: 'Librería UI · Open Source',
          description:
            'Colección personal de efectos, animaciones y micro-componentes CSS de autor listos para copiar sin dependencias.',
          url: 'https://css-reel.vercel.app/',
          stack: 'CSS3 · HTML5 · Snippets',
          preview: '/projects/cssreel-1.png',
        },
      ],
    },
    footer: {
      eyebrow: 'Disponible para proyectos de IA, Python & Web',
      heading: 'Construyamos algo brutal',
      subtext:
        '¿Necesitas agentes de IA, software en Python o una experiencia web de alto nivel? Escríbeme directo por WhatsApp o correo.',
      cta: 'Escribir por WhatsApp',
      copyEmail: 'Copiar correo',
      copiedEmail: 'Correo copiado',
      availability: 'Bogotá, Colombia · Proyectos LATAM & Global',
    },
  },
  en: {
    nav: {
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'andrew.dev · Bogotá, CO',
      badge: 'Python · AI Agents · 3D Optics',
      heading: "Hi, i\u2019m andrew",
      tagline:
        'a software engineer specializing in python, ai agents & high-impact digital systems',
      cta: 'Contact Me',
      tabs: [
        {
          label: 'AI & Python',
          cmd: 'Python · AI Agents · PyTorch · ONNX · LLMs · Automation',
        },
        {
          label: 'Flagship AI',
          cmd: 'Neural-Ink V5 — AMD MI300X -> ONNX FP16 (13ms Latency)',
        },
        {
          label: 'Web & 3D',
          cmd: 'React · TypeScript · Three.js · WebGL · WebZap Studio',
        },
        {
          label: 'Contact',
          cmd: 'andreavilan.work@gmail.com · +57 301 529 2509',
        },
      ],
      copiedLabel: 'Copied',
      copyLabel: 'Copy',
    },
    about: {
      heading: 'About me',
      text: "I'm Andrew Avilán, Systems Engineering student at Universidad de los Andes, formerly Universidad Nacional, and founder of WebZap Studio. I build autonomous AI agents, production Python & PyTorch pipelines — including Neural-Ink V5 trained on AMD MI300X — and refined digital systems built to scale.",
      cta: 'Start a Project',
      credentials: [
        { label: 'Core Stack', value: 'Python & AI Agents' },
        { label: 'Applied AI', value: 'Neural-Ink V5 · AMD MI300X' },
        { label: 'Education', value: 'Systems Eng. · Uniandes' },
        { label: 'Studio', value: 'Founder @ WebZap Studio' },
      ],
    },
    services: {
      heading: 'Services',
      items: [
        {
          number: '01',
          name: 'AI Agents & Intelligent Automation',
          description:
            'Autonomous LLM agents, multi-agent orchestration, API/CRM/WhatsApp tool integrations, and smart workflow automation built for real business impact.',
        },
        {
          number: '02',
          name: 'Python Engineering & ML Pipelines',
          description:
            'Scalable Python backends, PyTorch training & ONNX FP16 model quantization, low-latency edge inference, and robust data architectures.',
        },
        {
          number: '03',
          name: 'Web Engineering & React / TypeScript',
          description:
            'Fast, modular web applications wired to AI backends and modern APIs — clean, maintainable code built to grow.',
        },
        {
          number: '04',
          name: 'Interactive 3D, Shaders & WebGL',
          description:
            'Real-time Three.js scenes, custom GLSL/Compute shaders, and generative visuals that turn complex engineering into unforgettable brand presence.',
        },
        {
          number: '05',
          name: 'Luxury Websites & Conversion',
          description:
            'Zero-template editorial websites crafted through WebZap Studio — understated luxury aesthetics, technical SEO, and 90+ Lighthouse speed.',
        },
      ],
    },
    projects: {
      heading: 'Projects',
      liveButton: 'Live Demo',
      repoButton: 'GitHub',
      featured: [
        {
          number: '01',
          category: 'Python · PyTorch · AMD Pervasive AI',
          name: 'Neural-Ink V5',
          subtitle:
            'End-to-end Cloud-to-Client Pervasive AI pipeline (AMD Instinct MI300X -> ONNX FP16) turning 3D environments into real-time stylized hand-drawn art at 13–20ms latency.',
          liveUrl: 'https://neural-ink-demo.vercel.app/',
          repoUrl: 'https://github.com/andrewavilan-work/Neural-Ink',
          year: '2026',
          role: 'AI Pipeline & Python / Shaders',
          tags: ['Python', 'PyTorch · ROCm', 'ONNX FP16', 'Unity URP'],
          images: {
            main: '/projects/neural-ink-1.png',
            detail: '/projects/neural-ink-2.png',
            extra: '/projects/neural-ink-3.png',
          },
        },
        {
          number: '02',
          category: 'Agency · Founder',
          name: 'WebZap Studio',
          subtitle:
            'My web engineering studio for ambitious businesses in Colombia. Fast, accessible sites built with native code — zero templates.',
          liveUrl: 'https://webzap.com.co/',
          year: '2025 — 2026',
          role: 'Founder & Lead Engineer',
          tags: ['Web Architecture', 'Conversion', 'Technical SEO'],
          images: {
            main: '/projects/webzap-1.png',
            detail: '/projects/webzap-2.png',
            extra: '/projects/webzap-3.png',
          },
        },
        {
          number: '03',
          category: 'Architecture · Medellín',
          name: 'ARQON Constructora',
          subtitle:
            'Corporate architecture and engineering website in Medellín, showcasing executed developments and lead acquisition.',
          liveUrl: 'https://webzap.com.co/portafolio/arqon',
          year: '2026',
          role: 'Design & Development',
          tags: ['Editorial Luxury', 'HTML/CSS/JS', 'High Contrast'],
          images: {
            main: '/projects/arqon-1.png',
            detail: '/projects/arqon-2.png',
          },
        },
        {
          number: '04',
          category: 'Hospitality · Cartagena',
          name: 'Casa Ceiba Boutique',
          subtitle:
            'Editorial retreat website for a restored republican boutique hotel in Getsemaní, Cartagena with direct WhatsApp booking.',
          liveUrl: 'https://webzap.com.co/portafolio/casa-ceiba',
          year: '2026',
          role: 'Design & Conversion UI',
          tags: ['Hospitality', 'WhatsApp Booking', 'Mobile-First'],
          images: {
            main: '/projects/casa-ceiba-1.png',
            detail: '/projects/casa-ceiba-2.png',
          },
        },
      ],
      archiveTitle: 'More Real Builds & Personal Lab',
      archive: [
        {
          number: '05',
          name: 'NAVAJA Barber Club',
          category: 'Dark Editorial · Bogotá',
          description:
            'Dark editorial grooming club website in Chapinero featuring a curated service menu and direct booking.',
          url: 'https://webzap.com.co/portafolio/navaja',
          stack: 'Editorial UI · Native Code',
          preview: '/projects/navaja-1.png',
        },
        {
          number: '06',
          name: 'AURA Studio',
          category: 'Wellness Boutique · Usaquén',
          description:
            'Refined beauty studio experience with filterable ritual catalog and instant WhatsApp reservations.',
          url: 'https://webzap.com.co/portafolio/aura',
          stack: 'UI Systems · Conversion',
          preview: '/projects/aura-1.png',
        },
        {
          number: '07',
          name: 'Aetheria',
          category: 'Experiment · Procedural',
          description:
            'Procedural fantasy world generator creating unique interactive maps, bestiaries, and civilizations per seed.',
          url: 'https://aetheria-phi.vercel.app/',
          stack: 'JavaScript · Canvas API',
          preview: '/projects/aetheria-1.png',
        },
        {
          number: '08',
          name: 'CSSReel',
          category: 'UI Library · Open Source',
          description:
            'Author-crafted CSS snippet library with custom effects, animations, and zero-dependency UI components.',
          url: 'https://css-reel.vercel.app/',
          stack: 'CSS3 · HTML5 · Snippets',
          preview: '/projects/cssreel-1.png',
        },
      ],
    },
    footer: {
      eyebrow: 'Available for AI, Python & Web Commissions',
      heading: "Let's build something unforgettable",
      subtext:
        'Need autonomous AI agents, Python engineering, or a luxury web experience? Reach out directly on WhatsApp or email.',
      cta: 'Chat on WhatsApp',
      copyEmail: 'Copy email',
      copiedEmail: 'Email copied',
      availability: 'Bogotá, Colombia · LATAM & Global Clients',
    },
  },
};
