import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, REVEAL, reducedMotion } from '../motion/motion'

// Una slide es un objeto: sumar una slide es sumar uno de estos al array de su charla.
export type Slide = {
  titulo: string // para el presentador y el contador
  pasos?: number // cuántas partes se revelan de a una con →
  notas?: string // guion, se ve solo en el modo presentador
  contenido: () => ReactNode // lo que va en el lienzo de 1920×1080
}
export type Charla = { slug: string; titulo: string; bajada: string; minutos: number; slides: Slide[] }

// Paso actual de la slide montada. `animar` es false en las miniaturas del presentador.
export const SlideCtx = createContext({ step: 0, animar: false })

// Envuelve lo que aparece recién en el paso n. Al avanzar entra con el reveal; al volver se oculta sin animación.
export function Paso({ n, children, className }: { n: number; children: ReactNode; className?: string }) {
  const { step, animar } = useContext(SlideCtx)
  const ref = useRef<HTMLDivElement>(null)
  const antes = useRef<boolean | null>(null)
  useLayoutEffect(() => {
    const visible = step >= n
    if (visible && antes.current === false && animar && !reducedMotion())
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: REVEAL.duration, ease: REVEAL.ease })
    else gsap.set(ref.current, { autoAlpha: visible ? 1 : 0, y: 0 })
    antes.current = visible
  }, [step, n, animar])
  return <div ref={ref} className={className}>{children}</div>
}

// Lienzo fijo de 1920×1080 que se escala al espacio disponible: el diseño es idéntico en cualquier proyector.
export function Stage({ children }: { children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0)
  useLayoutEffect(() => {
    const el = caja.current!
    const medir = () => setEscala(Math.min(el.clientWidth / 1920, el.clientHeight / 1080))
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    medir()
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={caja} className="stage-box">
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${escala})` }}>{children}</div>
    </div>
  )
}
