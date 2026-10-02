import { WordsIn } from '../motion/motion'
import { Paso, type Charla } from '../deck/slide'
import { EQUIPO } from './equipo'

// Fuente: README.md (premios, 4 pasos), agenda.md (jornada, "Qué juzga Colosseum").
const PREMIOS = [['1.º', '3.000'], ['2.º', '2.000'], ['3.º', '1.500'], ['4.º', '1.000'], ['5.º', '500'], ['4 bonus', '500 c/u']]

const PASOS_PARTICIPAR = [
  ['Hub en Luma', 'Agenda y novedades de la cohorte', 'luma.com/3qmbyb6h'],
  ['Cuenta en Colosseum', 'Cada integrante, por separado', 'arena.colosseum.org'],
  ['Formulario del proyecto', 'Uno por equipo', 'forms.gle/Ej7sGChMBdW1p2WJ9'],
  ['Entrega en Superteam Earn', 'Solo residentes en Argentina', 'superteam.fun/earn'],
]

const HOY = [
  ['11:00', 'Bienvenida'], ['11:10', 'Solana desde cero'], ['11:30', 'Icebreaker'], ['11:40', 'Cómo construir algo'],
  ['12:20', 'Puesta a punto'], ['12:40', 'Ideas y equipos'], ['13:00', 'Charla de Devin'], ['13:30', 'Almuerzo'],
  ['14:30', 'Build con mentoría'], ['17:00', 'Avances'], ['17:30', 'Cierre'],
]

const usuario = (url: string) => url.replace(/\/$/, '').split('/').pop()

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
        <div className="bv-portada">
          <p className="kicker" data-in>Sábado 3 de octubre · Tucumán</p>
          <h1><WordsIn text="Road to Colosseum" /></h1>
          <p className="bv-x" data-in>× Tucumán</p>
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
      notas: 'Nos presentamos rápido. Cualquier duda del día, nos buscan a cualquiera de los tres.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Hoy los acompañan</p>
          <h1><WordsIn text="Quiénes somos" /></h1>
          <div className="bv-equipo">
            {EQUIPO.map((p) => (
              <figure key={p.nombre} data-in>
                <img src={p.foto} alt="" />
                <figcaption>
                  <b>{p.nombre}</b>
                  {p.redes.map((r) => <span key={r.red}>{r.red} · {usuario(r.url)}</span>)}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: 'Qué es Colosseum',
      notas: 'Colosseum organiza los hackathons globales de Solana. Este se llama Crypto World\'s Fair.\n\nSuperteam Argentina arma un track propio para los que estamos acá, con premios aparte.',
      contenido: () => (
        <>
          <p className="kicker" data-in>El hackathon</p>
          <h1><WordsIn text="Crypto World's Fair" /></h1>
          <p className="cuerpo bv-gap" data-in>El hackathon global de <b className="bv-ink">Colosseum</b> y <b className="bv-ink">Solana</b>.</p>
          <p className="cuerpo bv-gap-s" data-in><b className="bv-ink">Superteam Argentina</b> arma un track propio para el país, con premios propios.</p>
        </>
      ),
    },
    {
      titulo: 'Dos semanas',
      notas: 'Arrancó el lunes 28 y la entrega cierra el martes 13 a las 03:59 de acá, que es el 12 a la medianoche de California.\n\nHoy es el día 6. Todo lo que se construya hasta el cierre cuenta.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Cuánto dura</p>
          <h1><WordsIn text="Dos semanas" /></h1>
          <div className="bv-linea" data-in>
            <div><span>Arrancó</span><b>lun 28 sep</b></div>
            <div className="bv-hoy"><span>Hoy</span><b>día 6</b></div>
            <div><span>Cierre</span><b>mar 13 oct</b><em>03:59 hora argentina</em></div>
          </div>
        </>
      ),
    },
    {
      titulo: 'USD 10.000',
      notas: 'Diez mil dólares en premios, repartidos en nueve. Son solo para participantes en Argentina, así que compiten contra gente de acá.',
      contenido: () => (
        <div className="bv-centro">
          <p className="kicker" data-in>En premios</p>
          <p className="bv-monto" data-in>USD 10.000</p>
          <p className="cuerpo" data-in>9 premios, solo para participantes en Argentina</p>
        </div>
      ),
    },
    {
      titulo: 'Cómo se reparten',
      notas: 'Cinco puestos y cuatro premios bonus de 500.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Premios en USD</p>
          <h1><WordsIn text="Cómo se reparten" /></h1>
          <div className="bv-premios">
            {PREMIOS.map(([p, m]) => (
              <div key={p} data-in><span>{p}</span><b>{m}</b></div>
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: 'Qué juzgan',
      notas: 'Lo más importante para hoy: Colosseum juzga negocio y ejecución antes que lo técnico.\n\nSe juzga solo lo que se construye durante la competencia. Si traen código de antes, se declara.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Qué mira el jurado</p>
          <h1><WordsIn text="Negocio antes que código" /></h1>
          <ul className="bv-lista">
            <li data-in>Encaje entre el equipo y el mercado</li>
            <li data-in>Ejecución del producto</li>
            <li data-in>Potencial de mercado</li>
            <li data-in>Viabilidad del negocio</li>
          </ul>
        </>
      ),
    },
    {
      titulo: 'Cómo se participa',
      pasos: 4,
      notas: 'Son cuatro pasos y los cuatro son obligatorios para cobrar.\n\n1. El Hub de Luma.\n2. Cuenta en Colosseum, cada uno la suya.\n3. El formulario, uno por equipo.\n4. La entrega en Earn.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Los 4 son obligatorios</p>
          <h1><WordsIn text="Cómo se participa" /></h1>
          <div className="bv-pasos">
            {PASOS_PARTICIPAR.map(([t, d, url], i) => (
              <Paso key={t} n={i + 1}>
                <div className="bv-paso"><span className="bv-n">{i + 1}</span><b>{t}</b><span>{d}</span><code>{url}</code></div>
              </Paso>
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: 'Se entrega dos veces',
      notas: 'El error más común: entregar en un solo lado. El mismo proyecto va en Colosseum y en Earn. El formulario no reemplaza el registro en Colosseum.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Ojo con esto</p>
          <h1><WordsIn text="Se entrega dos veces" /></h1>
          <div className="bv-dos" data-in>
            <div>Colosseum</div><span>+</span><div>Superteam Earn</div>
          </div>
          <p className="cuerpo bv-gap-s" data-in>El formulario no reemplaza el registro en Colosseum.</p>
        </>
      ),
    },
    {
      titulo: 'Top Talent',
      notas: 'Hay una mentoría para los equipos seleccionados, del 5 al 11. Se aplica hasta mañana domingo a las 16. A la tarde lo recordamos.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Mentoría · 5 al 11 de octubre</p>
          <h1><WordsIn text="Top Talent" /></h1>
          <p className="cuerpo bv-gap" data-in>Mentoría para los equipos seleccionados.</p>
          <p className="bv-fecha" data-in>Aplicar hasta mañana, <b>domingo 16:00</b></p>
        </>
      ),
    },
    {
      titulo: 'Hoy',
      notas: 'Así sigue el día. A la mañana, charla y demo. A la tarde, a construir con mentoría por mesa. A las 17 cada equipo muestra lo que tiene en 2 minutos.\n\nArrancamos con Solana desde cero.',
      contenido: () => (
        <>
          <p className="kicker" data-in>Sábado 3 de octubre</p>
          <h1><WordsIn text="Hoy" /></h1>
          <ul className="bv-hoy-lista" data-in>
            {HOY.map(([h, b], i) => (
              <li key={h} className={i === 0 ? 'bv-ahora' : undefined}><span>{h}</span>{b}</li>
            ))}
          </ul>
        </>
      ),
    },
  ],
}
