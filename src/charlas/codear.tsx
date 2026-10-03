import type { ReactNode } from 'react'
import { WordsIn } from '../motion/motion'
import { Paso, type Charla, type Slide } from '../deck/slide'

// Demo 100 % en vivo: estas slides son el ancla mientras Franco va y viene de la terminal.
// Cada paso deja en pantalla el comando o el prompt para que la sala lo copie.
// Fuente: agenda.md (## Demo · cómo construir algo) y guias/01-setup.md. Comandos y URLs probados el 2026-10-02.

// Los cuatro pasos de la agenda: [nombre, minutos, con qué]. El ancho de cada tramo es su duración.
const PLAN: [string, number, string][] = [
  ['Idea', 10, 'Colosseum Copilot'],
  ['App', 15, 'Solana dev skill'],
  ['Wallet', 10, 'Phantom + faucet'],
  ['Verla', 5, 'Explorer'],
]

// Reglas para trabajar con el agente (guía de Formosa.dev × Superteam Argentina, 2026-09-30).
const REGLAS = [
  'Pedile un plan corto antes de que toque archivos',
  'Cambios chicos que puedas probar',
  'Si algo falla, pasale el error real',
  'Commits seguido',
  'Nada de Solana que no puedas explicar',
]

// El kit propio (rama skills-autocontenidas de alejandrocol-dev/workspace-colosseum): [comando, para qué, cuánto, qué deja].
// Copiado de solana-tuc-empezar/SKILL.md el 2026-10-03. Sin comando = paso sin skill.
const KIT: [string, string, string, string][] = [
  ['empezar', 'Explica el kit e instala las otras dos', '', ''],
  ['idea', 'Qué construir: problema, usuario, idea', '20-30 min', '01-idea.md'],
  ['validar', '¿Ya existe? ¿Vale la pena?', '15-30 min', '02-validacion.md'],
  ['mvp', 'Lo mínimo que se muestra en 3 minutos', '20 min', '03-mvp.md'],
  ['planificar', 'Tareas chicas para pedirle al agente', '20 min', '04-plan.md · AGENTS.md'],
  ['', 'Construir', '', ''],
  ['pitch', 'Deck, video demo y checklist de entrega', '30 min', '05-pitch.md'],
]

// Caja de terminal: cada línea es un comando. `$` y el texto entre <> en otro color.
function Term({ lineas, chica }: { lineas: string[]; chica?: boolean }) {
  return (
    <div className={chica ? 'cd-term cd-term-chica' : 'cd-term'}>
      {lineas.map((l) => <code key={l}><i>$</i> {l}</code>)}
    </div>
  )
}

// Prompt para el agente. Lo que hay que reemplazar va en <mark>.
function Prompt({ children }: { children: ReactNode }) {
  return (
    <div className="cd-prompt">
      <span className="bv-etq">Al agente</span>
      <p>{children}</p>
    </div>
  )
}

const slides: Slide[] = [
  {
    titulo: 'Portada',
    notas: 'Cuarenta minutos, en vivo, de una idea a una transacción en devnet. Uso un agente de código; sirve cualquiera: Claude Code, Codex, Cursor, Gemini CLI.\n\nVamos a hacer lo que van a hacer ustedes a la tarde, con las mismas herramientas de la Guía 1.',
    contenido: () => (
      <div className="bv sl-portada">
        <h1><WordsIn text="Hagamos una app" /></h1>
        <p className="bv-bajada" data-in>De la idea a una transacción, en vivo.</p>
      </div>
    ),
  },
  {
    titulo: 'Qué hacemos',
    notas: 'La idea es la del rubro 1 de la Guía 3: la caja del club, a la vista. Cada cuota que entra queda anotada en la red y cualquier socio la puede mirar.\n\nPara hoy, versión mínima: un botón para pagar la cuota y la lista de lo que entró. La parte de Solana es una transferencia: el programa ya existe, nosotros armamos la app alrededor.\n\nEn devnet pagamos en SOL de prueba. En la versión de verdad, la cuota va en USDC y es el mismo tipo de transacción.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="La caja del club" /></h1>
        <p className="sl-frase" data-in>Cada socio paga su cuota con un botón. Lo que entra queda <em>a la vista de todos</em>.</p>
      </div>
    ),
  },
  {
    titulo: 'El plan',
    notas: 'Cuatro pasos, con el reloj a la vista. Si un paso se pasa de tiempo, lo corto y sigo: lo importante es llegar a ver la transacción.\n\nIdea, 10 minutos, con Colosseum Copilot. App, 15, con la skill de Solana. Wallet y devnet, 10. Verla, 5.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Cuatro pasos, cuarenta minutos" /></h1>
        <div className="cd-plan">
          {PLAN.map(([n, m, con], i) => (
            <div key={n} data-in style={{ flexGrow: m }}>
              <span className="cd-plan-min">{m} min</span>
              <b><span>{i + 1}</span> {n}</b>
              <p>{con}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: '0 · Las dos skills',
    pasos: 1,
    notas: 'Antes de arrancar, le enseño dos cosas al agente. Son las dos skills que pasó Superteam, y las instalo acá en vivo.\n\nColosseum Copilot: busca en los 8.286 proyectos de los hackathons de Colosseum (colosseum.com/copilot, 2026-10-02). Se instala global con -g y después el login abre el navegador para aprobar con tu cuenta de Colosseum. Ya no hace falta pegar un token: el token viejo de la Guía 1 deja de andar el 28/10 (README de ColosseumOrg/colosseum-copilot, 2026-10-02).\n\n→ Solana dev skill, de la Solana Foundation: el agente escribe código de Solana con las librerías de hoy.\n\nAtajo: en colosseum.com/copilot hay un prompt para pegarle al agente y que instale Copilot solo.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Dos skills para tu agente" /></h1>
        <div className="cd-pila">
          <div data-in>
            <span className="bv-etq cd-etq">Colosseum Copilot · qué ya se hizo</span>
            <Term lineas={['npx skills add ColosseumOrg/colosseum-copilot -g', 'npx @colosseum-org/copilot-connect login']} />
          </div>
          <Paso n={1}>
            <span className="bv-etq cd-etq">Solana dev skill · código de Solana de hoy</span>
            <Term lineas={['npx skills add solana-foundation/solana-dev-skill']} />
          </Paso>
        </div>
      </div>
    ),
  },
  {
    titulo: 'El kit de Tucumán',
    notas: 'Y además armamos uno para ustedes: siete skills que llevan al equipo de la idea a la entrega. Se instala con un comando.\n\nUsa las dos de recién: validar busca en Copilot proyectos parecidos, y solana-dev se activa cuando escriben código. Si les falta alguna, /solana-tuc-empezar se las instala.\n\nTodo lo que deciden queda escrito en la carpeta proyecto/. Es la memoria del equipo: cada sesión nueva del agente arranca sin recordar nada.',
    contenido: () => (
      <div className="bv">
        <div>
          <h1><WordsIn text="Y uno hecho para hoy" /></h1>
          <p className="bv-bajada bv-gap-s" data-in>Siete skills que llevan al equipo de la idea a la entrega.</p>
        </div>
        <div data-in>
          <span className="bv-etq cd-etq">Kit Solana Tucumán</span>
          <Term chica lineas={['npx skills add "alejandrocol-dev/workspace-colosseum#skills-autocontenidas" -g']} />
        </div>
      </div>
    ),
  },
  {
    titulo: 'El kit, paso a paso',
    notas: 'El recorrido, en orden (solana-tuc-empezar/SKILL.md, 2026-10-03):\n\nempezar: explica el kit y deja instaladas Copilot y solana-dev.\nidea: 20 a 30 minutos para decidir qué construir.\nvalidar: qué ya existe y si vale la pena; da un veredicto. Si ya tienen idea, arranquen acá.\nmvp: recortar a lo que entra en las horas y se muestra en un video de 3 minutos.\nplanificar: tareas chicas para el agente, y deja el AGENTS.md armado.\nDespués construyen.\npitch: deck, guion del video demo en inglés y checklist de entrega.\n\nY /solana-tuc-status en cualquier momento: les dice en qué etapa están y qué sigue.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Paso a paso" /></h1>
        <div>
          <ol className="cd-kit">
            {KIT.map(([c, para, min, deja]) => (
              <li key={para} data-in className={c ? undefined : 'cd-kit-build'}>
                <code>{c && `/solana-tuc-${c}`}</code><span>{para}</span><em>{min}</em><i>{deja}</i>
              </li>
            ))}
          </ol>
          <p className="cd-nota" data-in><b>/solana-tuc-status</b> en cualquier momento: en qué etapa están y qué sigue.</p>
        </div>
      </div>
    ),
  },
  {
    titulo: '1 · Idea',
    notas: 'Antes de escribir una línea: ¿esto ya se hizo? Le pregunto a Copilot. Mirar en la respuesta: qué ya se hizo, cuáles ganaron, qué hueco queda. Ese hueco es la idea.\n\nSin agente: colosseum.com/arena/projects/explore, a mano.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="1 · ¿Ya se hizo?" /></h1>
        <div className="cd-pila">
          <div data-in>
            <Prompt>Buscá proyectos de hackathons anteriores parecidos a esta idea: <mark>la caja de un club, a la vista de los socios</mark>. Decime qué ya se hizo, cuáles ganaron y qué hueco queda.</Prompt>
          </div>
        </div>
      </div>
    ),
  },
  {
    titulo: '2 · Enseñarle Solana',
    pasos: 1,
    notas: 'Los agentes aprendieron Solana con código viejo y te proponen librerías de hace dos años. La skill ya está. Le sumo las reglas del stack de Superteam Argentina (superteam.ar/stack): un archivo que dice qué librerías usar y cuáles no.\n\n→ Y le pido que las sume a las instrucciones del repo: CLAUDE.md o AGENTS.md, según el agente.\n\nOjo, las reglas dicen que el RPC sale de .env.local. Para devnet alcanza con el público: https://api.devnet.solana.com.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="2 · Enseñarle Solana" /></h1>
        <div className="cd-pila">
          <div data-in>
            <Term lineas={['curl -o SOLANA-RULES.md "https://superteam.ar/stack/rules?lang=en"']} />
          </div>
          <Paso n={1}>
            <Prompt>Leé SOLANA-RULES.md y actualizá el <mark>CLAUDE.md o AGENTS.md</mark> del repo con esas reglas.</Prompt>
          </Paso>
        </div>
      </div>
    ),
  },
  {
    titulo: '2 · La app',
    notas: 'El pedido. Next.js, conexión de wallet, el botón de la cuota y la lista de lo que entró. La dirección de la caja es una wallet mía de devnet.\n\n"Explicame cada decisión del stack": si no lo entendés, no lo podés defender frente al jurado.\n\nLas reglas dicen "embedded wallet por defecto". Para la demo le pido Phantom; si propone otra cosa, lo corrijo en vivo.\n\nSi la lista se complica, la corto y me quedo con el botón: la transacción es lo que importa.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="2 · Pedirle la app" /></h1>
        <Prompt>Armame una app Next.js para la caja del club: conexión de wallet, un botón que mande 0,01 SOL en devnet a <mark>&lt;dirección de la caja&gt;</mark> y la lista de los últimos aportes que recibió. Explicame cada decisión del stack.</Prompt>
      </div>
    ),
  },
  {
    titulo: 'Mientras trabaja',
    notas: 'Mientras el agente escribe, cinco reglas para la tarde (guía de Formosa.dev × Superteam Argentina):\n\nUn plan corto antes de tocar archivos. Cambios chicos que se puedan probar. Cuando algo falla, el error real, copiado entero. Commits seguido, así se vuelve atrás. Y ninguna parte de Solana que el equipo no pueda explicar.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Mientras el agente trabaja" /></h1>
        <ol className="cd-reglas">
          {REGLAS.map((r, i) => <li key={r} data-in><span>{i + 1}</span>{r}</li>)}
        </ol>
      </div>
    ),
  },
  {
    titulo: '3 · Wallet y devnet',
    pasos: 3,
    notas: 'Para firmar hace falta una wallet con SOL de prueba. Si hicieron la Guía 1, ya la tienen.\n\n→ Phantom, desde phantom.com/download.\n\n→ Ajustes, Developer Settings, Testnet Mode, Solana Devnet.\n\n→ Copio la dirección y pido SOL en faucet.solana.com. El faucet limita los pedidos: hoy pedimos todos desde el mismo wifi.\n\nY ahora sí: npm run dev, conecto la wallet, aprieto el botón, firmo.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="3 · Wallet y devnet" /></h1>
        <div className="bv-pasos">
          {[['Instalá Phantom', 'phantom.com/download'], ['Pasala a devnet', 'Ajustes → Developer Settings → Testnet Mode'], ['Cargale SOL de prueba', 'faucet.solana.com']].map(([q, d], i) => (
            <Paso key={q} n={i + 1}>
              <div className="bv-paso cd-paso"><span className="bv-n">{i + 1}</span><b>{q}</b><span>{d}</span></div>
            </Paso>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: '4 · Verla',
    pasos: 1,
    notas: 'La transacción es pública. Copio la firma que me devolvió la app y la abro en el explorer, en devnet: quién mandó, a quién, cuánto, cuánto costó.\n\nEsto es lo que cualquier socio del club puede mirar sin pedirle permiso a nadie.\n\n→ Y el repo a GitHub: es lo que se entrega en Colosseum.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="4 · Verla" /></h1>
        <div className="cd-pila">
          <div className="cd-url" data-in>explorer.solana.com/tx/<mark>&lt;firma&gt;</mark>?cluster=devnet</div>
          <Paso n={1}><Term lineas={['git push']} /></Paso>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Ahora ustedes',
    notas: 'Ese es el camino de la tarde: idea, app, wallet, verla. En el próximo bloque dejamos el setup andando en todas las notebooks.\n\n¿Quieren escribir un programa propio sin instalar Rust? Solana Playground, en el navegador: beta.solpg.io.',
    contenido: () => (
      <div className="bv sl-portada">
        <h1 className="cd-cierre"><WordsIn text="Ahora les toca" /></h1>
        <p className="bv-bajada" data-in>¿Programa propio sin instalar nada? <b className="cd-ink">beta.solpg.io</b></p>
      </div>
    ),
  },
]

export const codear: Charla = {
  slug: 'codear',
  titulo: 'Hagamos una app',
  bajada: 'De la idea a una transacción, en vivo',
  minutos: 40,
  slides,
}
