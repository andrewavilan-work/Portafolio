# Andrew Avilán — Luxury Creative Developer Portfolio

Portafolio profesional de **Andrew Avilán (`andrew.dev`)** construido con React, TypeScript, Tailwind CSS, Framer Motion, Lucide React y Three.js (WebGL2).

## Estructura del proyecto

- `src/components/PrismBackground.tsx`: Motor 3D en tiempo real (Three.js + óptica de dispersión Cauchy de 72 longitudes de onda + shaders Fresnel/Beer-Lambert).
- `src/components/`: Componentes reutilizables (`FadeIn`, `Magnet`, `AnimatedText`, `ContactButton`, `LiveProjectButton`, `FloatingWhatsApp`).
- `src/sections/`: Secciones modulares (`HeroSection`, `MarqueeSection`, `AboutSection`, `ServicesSection`, `ProjectsSection`, `FooterSection`).
- `src/data/portfolio.ts`: Datos centralizados en español e inglés (`es` / `en`), enlaces de WhatsApp, proyectos, servicios y credenciales.

## Instalación y ejecución local

```bash
npm install
npm run dev
```

## Compilación para producción (Vercel)

```bash
npm run build
npm run preview
```

## Cómo actualizar contenido

Todo el texto, proyectos, URLs, servicios y enlaces de contacto están centralizados en `src/data/portfolio.ts`. Modifica ese archivo para agregar nuevos proyectos o ajustar descripciones sin tocar la lógica de animación.
