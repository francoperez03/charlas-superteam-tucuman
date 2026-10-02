import { gsap, reducedMotion, WordsIn } from '../motion/motion'
import { useContext, useLayoutEffect, useRef } from 'react'
import { Paso, SlideCtx, type Charla } from '../deck/slide'
import { EQUIPO } from './equipo'
import { MUNDO } from './mundo'

// Fuente: README.md (premios, 4 pasos), agenda.md (jornada, "Qué juzga Colosseum").
// Cada slide es una columna del alto del lienzo (.bv): el título arriba y el contenido anclado abajo,
// así ninguna deja medio lienzo vacío y todas comparten el mismo borde izquierdo.
const PUESTOS = [['2.º', '2.000'], ['3.º', '1.500'], ['4.º', '1.000'], ['5.º', '500']]

// El 4.º elemento marca las dos entregas del mismo proyecto (Colosseum y Earn).
const PASOS_PARTICIPAR: [string, string, string, string?][] = [
  ['Hub en Luma', 'Agenda y novedades', 'luma.com/3qmbyb6h'],
  ['Entrega en Colosseum', 'Cuenta de cada integrante', 'arena.colosseum.org', '1.ª entrega'],
  ['Formulario del proyecto', 'Uno por equipo', 'forms.gle/Ej7sGChMBdW1p2WJ9'],
  ['Entrega en Superteam Earn', 'Solo residentes en Argentina', 'superteam.fun/earn', '2.ª entrega'],
]

// Cronograma para el público: [inicio, fin, bloque]. Los nombres de las charlas son los del menú.
const HOY: [string, string, string][] = [
  ['11:00', '11:10', 'Bienvenida'], ['11:10', '11:40', '¿Qué #$%& es Solana?'], ['11:40', '12:20', 'Mi primer producto con Solana'],
  ['12:20', '13:00', 'Preparando el setup'], ['13:00', '13:30', 'Cómo comienzo mi investigación con IA'], ['13:30', '14:30', 'Almuerzo'],
  ['14:30', '17:00', '¡A buildear!'], ['17:00', '17:30', 'Show & tell'], ['17:30', '17:40', 'Cierre'],
]
const min = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b }
const DIA = [min('11:00'), min('17:40')] // rango de la barra
const pct = (h: string) => ((min(h) - DIA[0]) / (DIA[1] - DIA[0])) * 100
const HORAS = ['11', '12', '13', '14', '15', '16', '17']

// Días desde el lun 28/9 (día 0) hasta el cierre del mar 13/10 (día 15), en % de la barra.
const ENDIA = (n: number) => `${(n / 15) * 100}%`
const HOY_DIA = 5 // sáb 3/10
const MANANA_DIA = 6 // dom 4/10, Demo Day (superteam.ar/colosseum, 2026-10-02)

// Foto y QR encimados en diagonal. Con → (paso 1) giran como dos cartas sólidas alrededor de su centro común:
// a mitad de vuelta se separan, la que va atrás se achica y la que viene adelante crece, y ahí se cruzan.
const T = 400 // lado de cada carta, en px del lienzo
const D = 120 // corrimiento diagonal entre las dos
const R0 = D / Math.SQRT2 // radio de la órbita en reposo
const ABRE = 50 // cuánto se separan a mitad de vuelta
const OSCURA = { foto: 0.45, qr: 0.3 } // brillo de la carta de atrás

// Pose de una carta: t va de 0 a 1 en la vuelta; `adelante` dice si termina adelante.
function pose(desde: number, sentido: number, t: number, adelante: boolean, oscura: number) {
  const m = Math.sin(Math.PI * t)
  const a = desde + sentido * Math.PI * t
  const r = R0 + ABRE * m
  return {
    x: D / 2 + r * Math.cos(a), y: D / 2 + r * Math.sin(a),
    scale: adelante ? 1 + 0.05 * m : 1 - 0.12 * m,
    zIndex: (adelante ? t >= 0.5 : t < 0.5) ? 2 : 1,
    filter: `brightness(${adelante ? oscura + (1 - oscura) * t : 1 - (1 - oscura) * t})`,
  }
}
const FRENTE = Math.PI / 4 // abajo a la derecha
const FONDO = FRENTE + Math.PI // arriba a la izquierda

function Equipo() {
  const { step, animar } = useContext(SlideCtx)
  const caja = useRef<HTMLDivElement>(null)
  const antes = useRef<boolean | null>(null)
  useLayoutEffect(() => {
    const qrAdelante = step >= 1
    const fotos = caja.current!.querySelectorAll<HTMLElement>('.bv-foto')
    const qrs = caja.current!.querySelectorAll<HTMLElement>('.bv-qr')
    // la foto arranca donde está y gira media vuelta; el QR, igual desde el lado opuesto
    const vuelta = (t: number, aQr: boolean) => {
      const sentido = aQr ? 1 : -1
      gsap.set(fotos, pose(aQr ? FRENTE : FONDO, sentido, t, !aQr, OSCURA.foto))
      gsap.set(qrs, pose(aQr ? FONDO : FRENTE, sentido, t, aQr, OSCURA.qr))
    }
    if (antes.current === null || antes.current === qrAdelante || !animar || reducedMotion()) vuelta(1, qrAdelante)
    else {
      const p = { t: 0 }
      const tw = gsap.to(p, { t: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: () => vuelta(p.t, qrAdelante) })
      antes.current = qrAdelante
      return () => { tw.progress(1).kill() }
    }
    antes.current = qrAdelante
  }, [step, animar])
  return (
    <div className="bv-equipo" ref={caja}>
      {EQUIPO.map((p) => (
        <figure key={p.nombre} data-in>
          <div className="bv-swap" style={{ width: T + D, height: T + D }}>
            <img className="bv-foto" src={p.foto} alt="" style={{ width: T, height: T }} />
            <img className="bv-qr" src={p.qr.img} alt={`QR al ${p.qr.red} de ${p.nombre}`} style={{ width: T, height: T }} />
          </div>
          <figcaption>
            <b>{p.nombre}</b>
            {p.rol && <span>{p.rol}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// Mapa del mundo: con → (paso 1) se apaga todo menos Argentina, que se marca con contorno y relleno.
function Mundo() {
  const { step } = useContext(SlideCtx)
  return (
    <div className="bv-mundo" data-arg={step >= 1 || undefined} data-in>
      <div className="bv-mundo-texto">
        <div className="bv-mundo-a">
          <span className="bv-etq">En el mundo</span>
          <p>Gente de todo el mundo construyendo sobre <b>Solana</b>.</p>
        </div>
        <div className="bv-mundo-b">
          <span className="bv-etq">En Argentina</span>
          <p><b>Superteam Argentina</b> arma un track propio.</p>
          <p className="bv-mundo-premio">USD 10.000<span>solo para participantes de acá</span></p>
        </div>
      </div>
      <svg viewBox={`0 0 ${MUNDO.ancho} ${MUNDO.alto}`} role="img" aria-label="Mapa del mundo con Argentina marcada">
        <path className="bv-otros" d={MUNDO.otros} />
        <path className="bv-arg" d={MUNDO.argentina} />
      </svg>
    </div>
  )
}

export const bienvenidos: Charla = {
  slug: 'bienvenidos',
  titulo: 'Bienvenidos',
  bajada: 'Qué es Colosseum, los premios y cómo sigue el día',
  minutos: 10,
  slides: [
    {
      titulo: 'Portada',
      notas: 'Buen día a todos. Gracias por venir un sábado.\n\nEsto es Road to Colosseum, edición Tucumán. Lo armamos con Superteam Argentina y PCN.',
      contenido: () => (
        <div className="bv bv-portada">
          <p className="kicker" data-in>Sábado 3 de octubre · Tucumán</p>
          <div>
            <h1><WordsIn text="Road to Colosseum" /></h1>
            <p className="bv-x" data-in>× Tucumán</p>
          </div>
          <div className="bv-logos" data-in>
            <img src="/logo-superteam-arg.png" alt="Superteam Argentina" />
            <img src="/logo-crisol-mono.svg" alt="Crisol" />
          </div>
          <img className="bv-carpincho" src="/mascota-carpincho.png" alt="" data-in />
        </div>
      ),
    },
    {
      titulo: 'Quiénes somos',
      pasos: 1,
      notas: 'Nos presentamos rápido. Cualquier duda del día, nos buscan a cualquiera de los tres.\n\n→ Pasan los QR adelante: si quieren seguirnos, escaneen el de cada uno.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Quiénes somos" /></h1>
          <Equipo />
        </div>
      ),
    },
    {
      titulo: 'Qué es Colosseum',
      pasos: 1,
      notas: 'Colosseum organiza los hackathons globales de Solana. Este se llama Crypto World\'s Fair y participa gente de todo el mundo.\n\n→ Pero acá jugamos en Argentina: Superteam Argentina arma un track propio, con 10.000 dólares en premios solo para participantes de acá.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Hackathon de Colosseum" /></h1>
          <Mundo />
        </div>
      ),
    },
    {
      titulo: 'Dos semanas',
      notas: 'Arrancó el lunes 28 y la entrega cierra el martes 13 a las 03:59 de acá, que es el 12 a la medianoche de California.\n\nOjo con mañana: a las 16 cierra la preselección y a las 19:30 es el Demo Day con los seleccionados. Todo lo que se construya hasta el cierre cuenta.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Dos semanas" /></h1>
          <div className="bv-linea" data-in>
            <div className="bv-hitos">
              <div><span className="bv-etq">Arrancó</span><b>lun 28 sep</b></div>
              <div className="bv-fin"><span className="bv-etq">Cierre · 03:59 hora argentina</span><b>mar 13 oct</b></div>
            </div>
            <div className="bv-marca bv-arriba" style={{ left: ENDIA(HOY_DIA) }}><b>Hoy</b></div>
            <div className="bv-barra"><i style={{ width: ENDIA(HOY_DIA) }} /></div>
            <div className="bv-marca bv-abajo" style={{ left: ENDIA(MANANA_DIA) }}>
              <span className="bv-etq">Mañana · dom 4 oct</span>
              <b>Demo Day</b>
              <em>16:00 cierra la preselección<br />19:30 Demo Day</em>
            </div>
          </div>
        </div>
      ),
    },
    {
      titulo: 'USD 10.000',
      notas: 'Diez mil dólares en premios, repartidos en nueve. Son solo para participantes en Argentina, así que compiten contra gente de acá.',
      contenido: () => (
        <div className="bv bv-centro">
          <p className="bv-monto" data-in>USD 10.000</p>
          <p className="bv-bajada" data-in>en 9 premios, solo para participantes en Argentina</p>
        </div>
      ),
    },
    {
      titulo: 'Cómo se reparten',
      notas: 'El primero se lleva 3.000. Después 2.000, 1.500, 1.000 y 500, y cuatro premios bonus de 500.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Cómo se reparten" /></h1>
          <div className="bv-premios">
            <div className="bv-primero" data-in><span className="bv-etq">1.º puesto · USD</span><b>3.000</b></div>
            <ul data-in>
              {PUESTOS.map(([p, m]) => <li key={p}><span>{p}</span><b>{m}</b></li>)}
              <li className="bv-bonus"><span>+ 4 bonus</span><b>500 c/u</b></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      titulo: 'Qué juzgan',
      notas: 'Lo más importante para hoy: Colosseum juzga negocio y ejecución antes que lo técnico.\n\nSe juzga solo lo que se construye durante la competencia. Si traen código de antes, se declara.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Negocio antes que código" /></h1>
          <ul className="bv-lista">
            <li data-in>Encaje entre el equipo y el mercado</li>
            <li data-in>Ejecución del producto</li>
            <li data-in>Potencial de mercado</li>
            <li data-in>Viabilidad del negocio</li>
          </ul>
        </div>
      ),
    },
    {
      titulo: 'Cómo se participa',
      pasos: 4,
      notas: 'Son cuatro pasos y los cuatro son obligatorios para cobrar.\n\n1. El Hub de Luma.\n2. Cuenta en Colosseum, cada uno la suya. Ahí va la primera entrega.\n3. El formulario, uno por equipo.\n4. La segunda entrega, en Earn.\n\nEl error más común es entregar en un solo lado. El mismo proyecto va en Colosseum y en Earn, y el formulario no reemplaza ninguna de las dos.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Cómo se participa" /></h1>
          <div className="bv-pasos">
            <p className="bv-bajada" data-in>Los cuatro son obligatorios. <b className="bv-ojo">El proyecto se entrega dos veces.</b></p>
            {PASOS_PARTICIPAR.map(([t, d, url, entrega], i) => (
              <Paso key={t} n={i + 1}>
                <div className={entrega ? 'bv-paso bv-entrega' : 'bv-paso'}>
                  <span className="bv-n">{i + 1}</span>
                  <b>{t}{entrega && <em>{entrega}</em>}</b>
                  <span>{d}</span><code>{url}</code>
                </div>
              </Paso>
            ))}
          </div>
        </div>
      ),
    },
    {
      titulo: 'Top Talent',
      notas: 'Hay una mentoría para los equipos seleccionados, del 5 al 11. Se aplica hasta mañana domingo a las 16. A la tarde lo recordamos.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Top Talent" /></h1>
          <div>
            <p className="bv-bajada" data-in>Mentoría del 5 al 11 de octubre para los equipos seleccionados.</p>
            <p className="bv-fecha" data-in>Aplicar hasta mañana <b>domingo 16:00</b></p>
          </div>
        </div>
      ),
    },
    {
      titulo: 'Hoy',
      notas: 'Así sigue el día. A la mañana, dos charlas y la demo en vivo, y después dejamos todo instalado y armamos equipos.\n\nA las 13 la charla de cómo comenzar la investigación con IA, y almorzamos. A la tarde, a buildear con mentoría por mesa, y a las 17 cada equipo muestra lo que tiene en 2 minutos.\n\nArrancamos con ¿Qué #$%& es Solana?',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Hoy" /></h1>
          <div className="bv-dia" data-in>
            <div className="bv-dia-horas" aria-hidden>
              {HORAS.map((h) => <span key={h} style={{ left: `${pct(`${h}:00`)}%` }}>{h}</span>)}
            </div>
            <ol>
              {HOY.map(([ini, fin, nombre], i) => (
                <li key={ini} className={i === 0 ? 'bv-ahora' : nombre === 'Almuerzo' ? 'bv-pausa' : undefined}>
                  <span className="bv-dia-ini">{ini}</span>
                  <span className="bv-dia-nombre">{nombre}</span>
                  <span className="bv-dia-pista"><i style={{ left: `${pct(ini)}%`, width: `${pct(fin) - pct(ini)}%` }} /></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ),
    },
    {
      titulo: 'Bienvenidos',
      notas: '¡Bienvenidos! Arrancamos.\n\n→ vuelve al menú para abrir ¿Qué #$%& es Solana?',
      contenido: () => (
        <div className="bv bv-cierre">
          <h1><WordsIn text="Bienvenidos" /></h1>
          <img className="bv-carpincho" src="/mascota-carpincho.png" alt="" data-in />
        </div>
      ),
    },
  ],
}
