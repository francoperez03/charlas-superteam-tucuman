import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, REVEAL, reducedMotion, Roll } from './motion/motion'
import { CHARLAS } from './charlas'
import { escribirURL } from './deck/state'

export function Menu({ onElegir }: { onElegir: (slug: string) => void }) {
  const scope = useRef<HTMLElement>(null)
  const fondo = useRef<HTMLCanvasElement>(null)
  // Fondo animado con vgpu, solo si el navegador tiene WebGPU. Se carga aparte para no pesar en el arranque.
  useEffect(() => {
    if (!('gpu' in navigator)) return
    let vivo = true
    let parar: (() => void) | undefined
    import('./fondo').then((m) => { if (vivo && fondo.current) parar = m.iniciarFondo(fondo.current, reducedMotion()) }).catch(() => {})
    return () => { vivo = false; parar?.() }
  }, [])
  // Entrada: cada título sube desde su máscara, uno detrás del otro (M-REV-01), y el resto aparece detrás.
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.item-titulo > .roll', { yPercent: 115, duration: REVEAL.duration + 0.2, ease: REVEAL.ease, stagger: 0.09 })
      gsap.from('[data-in]', { y: 24, autoAlpha: 0, duration: REVEAL.duration, ease: REVEAL.ease, stagger: 0.05, delay: 0.25 })
    }, scope)
    return () => ctx.revert()
  }, [])
  return (
    <main ref={scope} className="menu">
      <canvas ref={fondo} className="fondo" aria-hidden />
      <header className="menu-top" data-in>
        <img src="/logo-superteam-arg.png" alt="Superteam Argentina" />
        <p>Road to Colosseum X Tucumán · sáb 3 oct</p>
      </header>
      <nav aria-label="Charlas">
        <ol className="lista">
          {CHARLAS.map((c, i) => (
            <li key={c.slug}>
              <a
                className="item"
                href={escribirURL({ charla: c.slug, pos: { slide: 0, step: 0 }, presenter: false })}
                onClick={(e) => { e.preventDefault(); onElegir(c.slug) }}
              >
                <span className="item-n" data-in>{String(i + 1).padStart(2, '0')}</span>
                <span className="item-titulo"><Roll text={c.titulo} /></span>
                <span className="item-meta" data-in>
                  <span className="item-bajada">{c.bajada}</span>
                  <span className="item-datos">{c.minutos} min · {c.slides.length} slides <span className="flecha" aria-hidden>→</span></span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <footer className="menu-pie" data-in>
        <p className="firma">Con 💜 por <img src="/logo-crisol-mono.svg" alt="Crisol" /></p>
      </footer>
      <img className="carpincho" src="/mascota-carpincho.png" alt="" data-in />
    </main>
  )
}
