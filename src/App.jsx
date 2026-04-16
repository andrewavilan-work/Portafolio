import { lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import Navbar from './components/Navbar'
import Hero from './sections/Hero' // Hero is loaded immediately for critical path rendering (LCP)

/**
 * Performance-first approach: Sections after the fold are loaded lazily 
 * to significantly reduce initial bundle size and speed up FCP.
 */
const About     = lazy(() => import('./sections/About'))
const Projects  = lazy(() => import('./sections/Projects'))
const Skills    = lazy(() => import('./sections/Skills'))
const Education = lazy(() => import('./sections/Education'))
const Contact   = lazy(() => import('./sections/Contact'))

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <main>
          {/* Main Hero section (synchronous) */}
          <Hero />
          
          {/* Deferred sections wrapped in Suspense for smooth loading */}
          <Suspense fallback={null}>
            <About />
            <Projects />
            <Skills />
            <Education />
            <Contact />
          </Suspense>
        </main>
      </LangProvider>
    </ThemeProvider>
  )
}
