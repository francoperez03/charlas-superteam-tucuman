// Piezas tomadas de @crisol/motion-kit (repo Crisol, packages/motion-kit/src: gsap.ts y split.tsx).
// El kit es un paquete privado de ese monorepo, por eso se copian acá solo las que no dependen de scroll.
// Los valores son los medidos en itsoffbrand.com (Crisol/docs/landing/research/offbrand/analysis.md §5).
import { Fragment } from 'react'
import gsap from 'gsap'

export { gsap }
export const EASE_ROLL = 'cubic-bezier(0.165, 0.84, 0.44, 1)' // M-HOV-01
export const REVEAL = { duration: 0.8, ease: 'expo.out', stagger: 0.04 } // M-REV-01/02

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// M-REV-02: cada palabra en su máscara (.words-clip) para entrar desde abajo.
// Deja una copia sr-only del texto para lectores de pantalla.
export function WordsIn({ text }: { text: string }) {
  return (
    <span className="words-in">
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="words-clip" aria-hidden><span className="word">{w}</span></span>{' '}
        </Fragment>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  )
}
