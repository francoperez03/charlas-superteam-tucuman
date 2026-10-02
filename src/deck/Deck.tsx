import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, REVEAL, reducedMotion } from '../motion/motion'
import { SlideCtx, Stage, type Charla } from './slide'
import type { Accion, Pos } from './state'

const TECLAS: Record<string, Accion> = { ArrowRight: 'next', ' ': 'next', PageDown: 'next', ArrowLeft: 'prev', PageUp: 'prev', Home: 'first', End: 'last' }

type Props = { charla: Charla; pos: Pos; onMover: (a: Accion) => void; onSalir: () => void; onPresentador: () => void }

export function Deck({ charla, pos, onMover, onSalir, onPresentador }: Props) {
  const scope = useRef<HTMLDivElement>(null)
  const [montada, setMontada] = useState(pos.slide) // la slide en pantalla; va un instante detrás de pos mientras sale la anterior
  const paso = useRef(pos.step)
  if (montada === pos.slide) paso.current = pos.step

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const accion = TECLAS[e.key]
      if (accion) { e.preventDefault(); onMover(accion) }
      else if (e.key === 'Escape') onSalir()
      else if (e.repeat) return
      else if (e.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()
      else if (e.key.toLowerCase() === 'p') onPresentador()
    }
    addEventListener('keydown', tecla)
    return () => removeEventListener('keydown', tecla)
  }, [onMover, onSalir, onPresentador])

  // Salida: la slide vieja se va rápido hacia arriba y recién ahí se monta la nueva.
  useEffect(() => {
    if (pos.slide === montada) return
    if (reducedMotion()) { setMontada(pos.slide); return }
    const tw = gsap.to(scope.current!.querySelector('.slide'), { y: -60, autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: () => setMontada(pos.slide) })
    return () => { tw.kill() }
  }, [pos.slide, montada])

  // Entrada: el título se revela palabra por palabra (M-REV-01) y el resto sube detrás.
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.slide .word', { yPercent: 110, duration: REVEAL.duration, ease: REVEAL.ease, stagger: REVEAL.stagger })
      gsap.from('.slide [data-in]', { y: 40, autoAlpha: 0, duration: REVEAL.duration, ease: REVEAL.ease, stagger: 0.06, delay: 0.1 })
    }, scope)
    return () => ctx.revert()
  }, [montada])

  const slide = charla.slides[montada]
  const total = charla.slides.length
  return (
    <div
      ref={scope}
      className="deck"
      onClick={(e) => { if (!(e.target as HTMLElement).closest('a, button')) onMover('next') }}
    >
      <Stage>
        <SlideCtx.Provider value={{ step: paso.current, animar: true }}>
          <div className="slide" key={montada}>{slide.contenido()}</div>
        </SlideCtx.Provider>
        <div className="hud">
          <button type="button" className="hud-menu" onClick={onSalir}>← Charlas</button>
          <span>{charla.titulo} · <b>{pos.slide + 1}</b> / {total}</span>
        </div>
        <div className="avance" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={pos.slide + 1} aria-label="Avance de la charla">
          <i style={{ transform: `scaleX(${(pos.slide + 1) / total})` }} />
        </div>
      </Stage>
    </div>
  )
}
