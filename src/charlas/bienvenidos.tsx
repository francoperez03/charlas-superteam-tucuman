import { gsap, reducedMotion, WordsIn } from '../motion/motion'
import { useContext, useLayoutEffect, useRef } from 'react'
import { Paso, SlideCtx, type Charla } from '../deck/slide'
import { EQUIPO } from './equipo'

// Fuente: README.md (premios, 4 pasos), agenda.md (jornada, "Qué juzga Colosseum").
// Cada slide es una columna del alto del lienzo (.bv): el título arriba y el contenido anclado abajo,
// así ninguna deja medio lienzo vacío y todas comparten el mismo borde izquierdo.
const PUESTOS = [['2.º', '2.000'], ['3.º', '1.500'], ['4.º', '1.000'], ['5.º', '500']]

const PASOS_PARTICIPAR = [
  ['Hub en Luma', 'Agenda y novedades', 'luma.com/3qmbyb6h'],
  ['Cuenta en Colosseum', 'Cada integrante, por separado', 'arena.colosseum.org'],
  ['Formulario del proyecto', 'Uno por equipo', 'forms.gle/Ej7sGChMBdW1p2WJ9'],
  ['Entrega en Superteam Earn', 'Solo residentes en Argentina', 'superteam.fun/earn'],
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

// Del lun 28/9 al mar 13/10 son 15 días; el sábado 3/10 es el día 6.
const DIA_HOY = 6
const DIAS = 15

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
      notas: 'Colosseum organiza los hackathons globales de Solana. Este se llama Crypto World\'s Fair.\n\nSuperteam Argentina arma un track propio para los que estamos acá, con premios aparte.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Crypto World's Fair" /></h1>
          <div className="bv-dos-col">
            <div data-in>
              <span className="bv-etq">En el mundo</span>
              <p>El hackathon global de <b>Colosseum</b> y <b>Solana</b>.</p>
            </div>
            <div data-in>
              <span className="bv-etq">En Argentina</span>
              <p><b>Superteam Argentina</b> arma un track propio, con premios propios.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      titulo: 'Dos semanas',
      notas: 'Arrancó el lunes 28 y la entrega cierra el martes 13 a las 03:59 de acá, que es el 12 a la medianoche de California.\n\nHoy es el día 6. Todo lo que se construya hasta el cierre cuenta.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Dos semanas" /></h1>
          <div className="bv-linea" data-in>
            <div className="bv-hoy" style={{ left: `${(DIA_HOY / DIAS) * 100}%` }}><span className="bv-etq">Hoy</span><b>día {DIA_HOY} de {DIAS}</b></div>
            <div className="bv-barra"><i style={{ width: `${(DIA_HOY / DIAS) * 100}%` }} /></div>
            <div className="bv-hitos">
              <div><span className="bv-etq">Arrancó</span><b>lun 28 sep</b></div>
              <div className="bv-fin"><span className="bv-etq">Cierre · 03:59 hora argentina</span><b>mar 13 oct</b></div>
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
      notas: 'Son cuatro pasos y los cuatro son obligatorios para cobrar.\n\n1. El Hub de Luma.\n2. Cuenta en Colosseum, cada uno la suya.\n3. El formulario, uno por equipo.\n4. La entrega en Earn.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Cómo se participa" /></h1>
          <div className="bv-pasos">
            <p className="bv-bajada" data-in>Los cuatro son obligatorios para cobrar premio.</p>
            {PASOS_PARTICIPAR.map(([t, d, url], i) => (
              <Paso key={t} n={i + 1}>
                <div className="bv-paso"><span className="bv-n">{i + 1}</span><b>{t}</b><span>{d}</span><code>{url}</code></div>
              </Paso>
            ))}
          </div>
        </div>
      ),
    },
    {
      titulo: 'Se entrega dos veces',
      notas: 'El error más común: entregar en un solo lado. El mismo proyecto va en Colosseum y en Earn. El formulario no reemplaza el registro en Colosseum.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Se entrega dos veces" /></h1>
          <div>
            <div className="bv-dos" data-in>
              <div>Colosseum</div><span>+</span><div>Superteam Earn</div>
            </div>
            <p className="bv-bajada bv-gap-s" data-in>El formulario no reemplaza el registro en Colosseum.</p>
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
  ],
}
