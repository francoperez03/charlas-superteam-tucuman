import { WordsIn } from '../motion/motion'
import { useContext } from 'react'
import { Paso, SlideCtx, type Charla } from '../deck/slide'
import { EQUIPO } from './equipo'
import { CHAPTERS, MUNDO } from './mundo'

// Fuente: README.md (premios, 4 pasos), agenda.md (jornada, "Qué juzga Colosseum").
// Cada slide es una columna del alto del lienzo (.bv): el título arriba y el contenido anclado abajo,
// así ninguna deja medio lienzo vacío y todas comparten el mismo borde izquierdo.
const PUESTOS = [['2.º', '2.000'], ['3.º', '1.500'], ['4.º', '1.000'], ['5.º', '500']]

// Los cuatro criterios de Colosseum (agenda.md, "Qué juzga Colosseum"), dichos como la pregunta que se hace el jurado.
const JURADO = [
  ['Equipo', '¿Son las personas indicadas para resolver este problema?'],
  ['Producto', '¿Funciona y se puede usar?'],
  ['Mercado', '¿Cuánta gente lo necesita?'],
  ['Negocio', '¿Cómo se sostiene y gana plata?'],
]

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

// Cierre de la preselección del domingo. Franco pidió las 13:00; superteam.ar/colosseum y luma.com/9duum73r dicen 16:00 (leídos el 2026-10-02).
const PRESELECCION = '13:00'

// El equipo: solo las fotos. Los QR van en la slide final.
function Equipo() {
  return (
    <div className="bv-equipo">
      {EQUIPO.map((p) => (
        <figure key={p.nombre} data-in>
          <img className="bv-foto" src={p.foto} alt="" />
          <figcaption>
            <b>{p.nombre}</b>
            {p.rol && <span>{p.rol}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// Slide final: los QR de los tres para seguirnos, cada uno con la foto asomando atrás en diagonal (quieta).
function Qrs() {
  return (
    <div className="bv-qrs">
      {EQUIPO.map((p) => (
        <figure key={p.nombre} data-in>
          <div className="bv-qr-par">
            <img className="bv-qr-foto" src={p.foto} alt="" />
            <img className="bv-qr-img" src={p.qr.img} alt={`QR al ${p.qr.red} de ${p.nombre}`} />
          </div>
          <figcaption>{p.nombre}</figcaption>
        </figure>
      ))}
    </div>
  )
}

// Mapa del mundo: con → (paso 1) se apaga todo menos Argentina, que se marca con contorno y relleno.
// Zoom sobre Argentina en el paso 1: el centro de su caja (366, 459) va al centro del mapa.
const ZOOM = 4.4
const zoomed = (x: number, y: number) => ({ x: MUNDO.ancho / 2 + (x - 366) * ZOOM, y: MUNDO.alto / 2 + (y - 459) * ZOOM })
// Dónde va el nombre de cada chapter respecto de su punto. Chaco y Corrientes caen en el mismo lugar:
// sus nombres se apilan a la derecha, con una línea hasta el punto.
const ETIQUETA: Record<string, { dx: number; dy: number; fin?: boolean }> = {
  Jujuy: { dx: -22, dy: 0, fin: true }, Tucumán: { dx: -22, dy: 6, fin: true }, Mendoza: { dx: -22, dy: 0, fin: true },
  Formosa: { dx: 22, dy: -8 }, Chaco: { dx: 60, dy: 26 }, Corrientes: { dx: 60, dy: 60 }, CABA: { dx: 22, dy: 0 }, 'Buenos Aires (MDQ)': { dx: 22, dy: 0 },
}

function Mundo() {
  const { step } = useContext(SlideCtx)
  const arg = step >= 1
  const t = { x: MUNDO.ancho / 2 - 366 * ZOOM, y: MUNDO.alto / 2 - 459 * ZOOM }
  return (
    <div className="bv-mundo" data-arg={arg || undefined} data-in>
      <div className="bv-mundo-texto">
        <div className="bv-mundo-a">
          <span className="bv-etq">En el mundo</span>
          <p>Gente de todo el mundo construyendo sobre <b>Solana</b>.</p>
        </div>
        <div className="bv-mundo-b">
          <span className="bv-etq">En Argentina · {CHAPTERS.length} chapters</span>
          <p><b>Superteam Argentina</b> arma un track propio.</p>
          <p className="bv-mundo-premio">USD 10.000<span>solo para participantes de acá</span></p>
        </div>
      </div>
      <svg viewBox={`0 0 ${MUNDO.ancho} ${MUNDO.alto}`} role="img" aria-label={`Mapa del mundo con Argentina y sus chapters: ${CHAPTERS.map((c) => c.nombre).join(', ')}`}>
        <g className="bv-zoom" style={{ transform: arg ? `translate(${t.x}px, ${t.y}px) scale(${ZOOM})` : undefined }}>
          <path className="bv-otros" d={MUNDO.otros} />
          <path className="bv-arg" d={MUNDO.argentina} />
        </g>
        <g className="bv-chapters">
          {CHAPTERS.map((c) => {
            const p = zoomed(c.x, c.y)
            const e = ETIQUETA[c.nombre]
            const lx = p.x + e.dx, ly = p.y + e.dy
            return (
              <g key={c.nombre} className={c.nombre === 'Tucumán' ? 'bv-aca' : undefined}>
                {Math.abs(e.dy) > 20 && <line x1={p.x} y1={p.y} x2={lx - 6} y2={ly - 8} />}
                <circle cx={p.x} cy={p.y} r={c.nombre === "Tucumán" ? 13 : 7} />
                <text x={lx} y={ly} textAnchor={e.fin ? 'end' : 'start'} dominantBaseline="middle">{c.nombre}</text>
              </g>
            )
          })}
        </g>
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
            <span className="bv-pcn" role="img" aria-label="PCN"><span aria-hidden>PCN</span><img src="/logo-pcn-isotipo.png" alt="" /></span>
          </div>
          <img className="bv-carpincho" src="/mascota-carpincho.png" alt="" data-in />
        </div>
      ),
    },
    {
      titulo: 'Quiénes somos',
      notas: 'Nos presentamos rápido. Cualquier duda del día, nos buscan a cualquiera de los tres. Los QR para seguirnos están al final.',
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
      notas: 'Colosseum organiza los hackathons globales de Solana. Este se llama Crypto World\'s Fair y participa gente de todo el mundo.\n\n→ Pero acá jugamos en Argentina: Superteam Argentina arma un track propio, con 10.000 dólares en premios solo para participantes de acá.\n\nHay chapters en Jujuy, Tucumán, Mendoza, Formosa, Chaco, Corrientes, CABA y Buenos Aires (Mar del Plata). Nosotros somos el de Tucumán.',
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Hackathon de Colosseum" /></h1>
          <Mundo />
        </div>
      ),
    },
    {
      titulo: 'Fechas clave',
      notas: `Tres fechas y nada más.\n\nHoy, sábado: construimos y armamos equipos.\n\nMañana domingo a las ${PRESELECCION} cierra la preselección: ahí se decide qué proyectos presentan en el Demo Day, que arranca a las 19:30.\n\nY ojo con el cierre: el track argentino de Superteam cierra el lunes 12 a las 23:59. Colosseum cierra cuatro horas después, el martes 13 a las 03:59, pero si entregan tarde quedan afuera del track argentino. Entreguen antes del lunes a la noche.`,
      contenido: () => (
        <div className="bv">
          <h1><WordsIn text="Fechas clave" /></h1>
          <div className="bv-fechas">
            <div className="bv-fecha-hoy" data-in><span className="bv-etq">Hoy</span><b>sáb 3 oct</b><p>Construimos y armamos equipos</p></div>
            <div data-in><span className="bv-etq">Mañana · dom 4 oct</span><b>{PRESELECCION}</b><p>Cierra la preselección: se decide quién presenta en el Demo Day</p></div>
            <div data-in><span className="bv-etq">Cierre · 23:59</span><b>lun 12 oct</b><p>Cierra el track argentino. Entregá antes: Colosseum cierra después, el 13/10 a las 03:59</p></div>
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
      titulo: 'Qué mira el jurado',
      notas: 'Para qué les cuento esto: el jurado de Colosseum evalúa como un inversor. Premia un producto que la gente usaría, más que el código más complicado.\n\nSon cuatro preguntas. ¿Ustedes son los indicados para resolver este problema? ¿Funciona y se puede usar? ¿Cuánta gente lo necesita? ¿Cómo se sostiene?\n\nSolo cuenta lo que construyan durante la hackathon. Si traen código de antes, se declara.',
      contenido: () => (
        <div className="bv">
          <div>
            <h1><WordsIn text="Qué mira el jurado" /></h1>
            <p className="bv-bajada bv-gap-s" data-in>Evalúa como un inversor: premia productos que la gente usaría.</p>
          </div>
          <div className="bv-jurado">
            {JURADO.map(([etq, pregunta]) => (
              <div key={etq} data-in><span className="bv-etq">{etq}</span><p>{pregunta}</p></div>
            ))}
          </div>
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
      notas: '¡Bienvenidos! Si quieren seguirnos, escaneen el QR de cada uno.\n\n→ vuelve al menú para abrir ¿Qué #$%& es Solana?',
      contenido: () => (
        <div className="bv bv-cierre">
          <h1><WordsIn text="Bienvenidos" /></h1>
          <Qrs />
        </div>
      ),
    },
  ],
}
