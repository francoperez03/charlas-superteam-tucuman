import { useContext } from 'react'
import { WordsIn } from '../motion/motion'
import { Paso, SlideCtx, type Charla, type Slide } from '../deck/slide'

// Guion: de los memes a lo que se construye hoy. Cifras verificadas el 2026-10-02, fuente en las notas de cada slide.
// Imágenes en public/img/solana/ (origen en FUENTES.md). Reusa las clases .bv-* de Bienvenidos y suma .sl-*.
const IMG = (f: string) => `/img/solana/${f}`

const MEMES = [['bonk.png', 'BONK'], ['dogwifcoin.png', 'dogwifhat'], ['pump-fun.png', 'pump.fun']]

// [logo, empresa, qué hace, link a la fuente, texto del link]. Verificado el 2026-10-02.
const EMPRESAS = [
  ['visa.svg', 'Visa', 'Liquida con bancos de EE.UU. en USDC sobre Solana', 'https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21951.html', 'visa.com · comunicado del 16/12/2025'],
  ['paypal.svg', 'PayPal', 'Su dólar digital, PYUSD, corre en Solana', 'https://newsroom.paypal-corp.com/2024-05-29-PayPal-USD-Stablecoin-Now-Available-on-Solana-Blockchain,-Providing-Faster,-Cheaper-Transactions-for-Consumers', 'paypal-corp.com · comunicado del 29/05/2024'],
  ['stripe.svg', 'Stripe', 'Acepta pagos en USDC sobre Solana', 'https://docs.stripe.com/payments/stablecoin-payments', 'docs.stripe.com · stablecoin payments'],
]

const EXISTE = [
  ['Dólares digitales', 'USD 16.600 M', 'en stablecoins sobre Solana'],
  ['Pagos', 'Western Union', 'tarjeta Visa con su propia stablecoin, en Solana'],
  ['Aparatos físicos (DePIN)', 'Helium Mobile', 'telefonía con antenas que pone la gente y cobra por dar señal'],
  ['Agentes de IA', '70 %', 'de los pagos x402 de agentes pasan por Solana'],
]

// Las cuatro palabras como cadena: [palabra, qué es, la flecha que llega desde la anterior].
const PALABRAS = [
  ['Wallet', 'tu usuario, sin mail ni contraseña', ''],
  ['Transacción', 'una orden', 'firma'],
  ['Programa', 'el backend que corre en la red', 'llama a'],
  ['Cuenta', 'donde vive la data: saldos, estado', 'escribe en'],
]

// Piezas del ecosistema: [para qué, quiénes, qué resuelven].
const PIEZAS = [
  ['Wallet', 'Phantom · Solflare · Backpack', 'el usuario y su firma'],
  ['Login sin wallet', 'Privy', 'entra con mail y la wallet se crea sola'],
  ['Conexión a la red', 'Helius · QuickNode', 'tu app habla con Solana'],
  ['Cobros', 'Solana Pay', 'un QR para cobrar en USDC'],
  ['Tokens', 'Metaplex', 'crear tokens y coleccionables'],
  ['Intercambios', 'Jupiter', 'cambiar un token por otro'],
]

// El camino después de una hackathon: [etapa, qué es, la flecha que llega desde la anterior].
const CAMINO = [
  ['Hackathon', '4 semanas, como esta', ''],
  ['Aceleradora', '12 semanas · USD 250.000 por equipo', 'los mejores'],
  ['Empresa', 'producto con usuarios', 'y de ahí'],
]

// Los seis rubros de la Guía 3 (guias/03-que-construir.md), en el mismo orden y con la misma dificultad.
// Atrás de cada tarjeta, los dos ejemplos de la guía.
const RUBROS: [string, string, number, string, string][] = [
  ['Pagos y cobros', 'fácil', 1, 'Plata que llega de afuera', 'La caja del club, a la vista'],
  ['Entradas y rifas', 'fácil', 1, 'Entradas para un recital', 'La rifa de la promo'],
  ['Trazabilidad', 'fácil', 1, 'Limones tucumanos de exportación', 'El historial de un auto usado'],
  ['Tokenización', 'fácil a medio', 2, 'Los puntos del café del barrio', 'Preventa de una producción'],
  ['Agentes de IA que pagan', 'medio', 2, 'Un agente que paga por consulta', 'Un agente que cobra por su trabajo'],
  // El 6 cambia el marketplace de la guía por un caso P2P entre amigos: misma dificultad (custodia con programa propio), más juego.
  ['Entre amigos (P2P)', 'medio a difícil', 3, 'La vaquita del asado', 'La apuesta del clásico'],
]

// Tarjetas de rubros: con cada → gira la siguiente y muestra sus ejemplos.
function Rubros() {
  const { step } = useContext(SlideCtx)
  return (
    <div className="sl-cartas">
      {RUBROS.map(([r, d, n, a, b], i) => (
        // la entrada (data-in) va en el contenedor: GSAP deja un transform fijo que pisaría el giro
        <div key={r} data-in>
        <div className="sl-carta" data-girada={step > i || undefined}>
          <div className="sl-cara">
            <span className="sl-rubro-n">{i + 1}</span>
            <b>{r}</b>
            <span className="sl-dif-fila"><span className="sl-dif" data-n={n}><i /><i /><i /></span><span className="sl-dif-t">{d}</span></span>
          </div>
          <div className="sl-cara sl-dorso">
            <span className="bv-etq">{r}</span>
            <p>{a}</p>
            <p>{b}</p>
          </div>
        </div>
        </div>
      ))}
    </div>
  )
}

// Carrera: con → arrancan las tres barras. Solana llega en medio segundo; las otras apenas se mueven.
function Carrera() {
  const { step } = useContext(SlideCtx)
  return (
    <div className="sl-carrera" data-largo={step >= 1 || undefined} data-in>
      {[['Solana', '< 0,5 s', 'sl-sol'], ['Transferencia al exterior', 'días', ''], ['Venta con tarjeta', 'días', '']].map(([n, t, c]) => (
        <div key={n} className={`sl-carril ${c}`}>
          <span className="sl-carril-n">{n}</span>
          <span className="sl-pista"><i /></span>
          <span className="sl-carril-t">{t}</span>
        </div>
      ))}
    </div>
  )
}

const slides: Slide[] = [
  {
    titulo: 'Portada',
    notas: 'Veinte minutos para entender qué es Solana y para qué sirve en un producto. Sin jerga.',
    contenido: () => (
      <div className="bv sl-portada">
        <img className="sl-logo" src={IMG('solana.webp')} alt="Solana" data-in />
        <h1><WordsIn text="¿Qué #$%& es Solana?" /></h1>
      </div>
    ),
  },
  {
    titulo: 'Lo que escuchaste',
    notas: 'Arranquemos por lo que seguro escucharon: los memecoins. El perro con gorro, BONK, pump.fun, donde cualquiera crea una moneda en un minuto.\n\nSí, pasó. Y sigue pasando: hay semanas en que son buena parte de lo que se intercambia en la red. No lo vamos a esconder.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Lo que escuchaste" /></h1>
        <div>
          <div className="sl-memes">
            {MEMES.map(([f, n]) => (
              <figure key={n} data-in><img src={IMG(f)} alt="" /><figcaption>{n}</figcaption></figure>
            ))}
          </div>
          <p className="bv-bajada sl-gap" data-in>Sí, pasó. Y sigue pasando.</p>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Mientras tanto',
    pasos: 4,
    notas: 'Mientras tanto, por la misma red:\n\n→ Visa: desde diciembre de 2025 liquida con bancos de Estados Unidos (Cross River y Lead Bank) en USDC sobre Solana. Su programa de stablecoins ya mueve más de USD 3.500 M al año (comunicado de Visa, 16/12/2025).\n\n→ PayPal: su dólar digital, PYUSD, corre en Solana desde mayo de 2024 (comunicado de PayPal, 29/05/2024).\n\n→ Stripe: acepta pagos en USDC sobre Solana, entre otras redes (docs.stripe.com, leído el 2026-10-02).\n\n→ Somos más que eso.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Mientras tanto, por la misma red" /></h1>
        <div className="sl-empresas">
          {EMPRESAS.map(([f, n, d, url, fuente], i) => (
            <Paso key={n} n={i + 1}>
              <div className="sl-empresa"><img src={IMG(f)} alt={n} /><div><p>{d}</p><a className="sl-fuente" href={url} target="_blank" rel="noreferrer">{fuente} ↗</a></div></div>
            </Paso>
          ))}
          <Paso n={4}><p className="sl-remate">Somos más que eso.</p></Paso>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Qué es',
    notas: 'Si me piden una línea: una base de datos compartida, rápida y barata, que ninguna empresa controla sola.\n\nRinde cuando hay plata o propiedad entre partes que no se conocen.',
    contenido: () => (
      <div className="bv bv-centro">
        <p className="sl-frase" data-in>Una base de datos compartida, <em>rápida y barata</em>, que ninguna empresa controla sola.</p>
      </div>
    ),
  },
  {
    titulo: 'Rápida',
    pasos: 1,
    notas: '→ Largamos.\n\nUn bloque nuevo sale cada 400 milisegundos, y la red ya lo está bajando a 350 en camino a 200 (solana.com/upgrades/reduced-slot-times). Una transacción queda confirmada en menos de medio segundo.\n\nUna transferencia al exterior o la plata de una venta con tarjeta tardan días en llegar.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Rápida" /></h1>
        <Carrera />
      </div>
    ),
  },
  {
    titulo: 'Barata',
    notas: 'Una transacción paga una comisión base de 0,000005 SOL (solana.com, "Understanding Solana transaction fees"). Con SOL a USD 117,9 (CoinGecko, 2026-10-02) son USD 0,0006: menos de un décimo de centavo.\n\nCuando hay mucho tráfico se suma una propina para pasar primero, y sigue siendo centavos.',
    contenido: () => (
      <div className="bv bv-centro">
        <p className="bv-monto sl-monto" data-in>US$ 0,0006</p>
        <p className="bv-bajada" data-in>lo que cuesta una transacción</p>
      </div>
    ),
  },
  {
    titulo: 'Qué habilita',
    notas: 'Qué cambia en un producto: como mover plata cuesta US$ 0,0006, se pueden cobrar montos chicos y casi todo llega a quien cobra.\n\nUn café de 2 dólares, una propina de 50 centavos, o un centavo por cada consulta a una API. En los tres casos la comisión es la misma: US$ 0,0006. Y llega en menos de medio segundo.',
    contenido: () => (
      <div className="bv">
        <div>
          <h1><WordsIn text="Cobrar montos chicos" /></h1>
          <p className="bv-bajada bv-gap-s" data-in>Mover plata cuesta tan poco que cualquier monto vale la pena.</p>
        </div>
        <div className="sl-tres">
          {[['Un café', 'US$ 2'], ['Una propina', 'US$ 0,50'], ['Una consulta a una API', 'US$ 0,01']].map(([t, m]) => (
            <div key={t} data-in>
              <span className="bv-etq">{t}</span>
              <b>{m}</b>
              <span className="sl-comision">comisión: US$ 0,0006</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: 'Lo que ya existe',
    pasos: 4,
    notas: 'Para qué se usa hoy, de a uno:\n\n→ Dólares digitales: USD 16.600 M en stablecoins sobre Solana (DefiLlama, 2026-10-02).\n\n→ Pagos: en agosto de 2026 Western Union lanzó una tarjeta Visa respaldada por su propia stablecoin, emitida en Solana (Solana Ecosystem Roundup, agosto 2026).\n\n→ DePIN, aparatos físicos: Helium Mobile es telefonía celular con antenas que instala la gente, que cobra en tokens por dar señal. No es para el sábado, necesita hardware, pero muestra hasta dónde llega.\n\n→ Agentes de IA: el 70 % del volumen mensual de x402, el estándar con el que los agentes pagan por usar una API, pasa por Solana, con más de 37 M de transacciones (solana.com/x402, 2026-10-02).',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Para qué se usa hoy" /></h1>
        <div className="sl-existe">
          {EXISTE.map(([etq, grande, d], i) => (
            <Paso key={etq} n={i + 1}>
              <div><span className="bv-etq">{etq}</span><b>{grande}</b><p>{d}</p></div>
            </Paso>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: 'Un dólar',
    notas: 'Para acá esto pega directo. USDC vale un dólar y vive en tu wallet. Mandarlo es una transacción: cobrar del exterior, ahorrar en dólares, pagarle a alguien en otro país.',
    contenido: () => (
      <div className="bv bv-centro">
        <div className="sl-usdc" data-in><img src={IMG('usdc.svg')} alt="USDC" /><b>1 USDC = 1 dólar</b></div>
        <p className="bv-bajada" data-in>Mandarlo es una transacción. Cobrar del exterior, ahorrar, pagar a otro país.</p>
      </div>
    ),
  },
  {
    titulo: 'Cuatro palabras',
    pasos: 3,
    notas: 'Para hoy alcanza con cuatro palabras, y van en cadena.\n\nTu wallet es tu usuario: sin mail ni contraseña.\n\n→ Con ella firmás una transacción: una orden.\n\n→ La transacción llama a un programa: el backend que corre en la red. Para lo común, transferir o crear un token, el programa ya existe.\n\n→ El programa escribe en una cuenta: ahí vive la data, los saldos, el estado de tu app.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Cuatro palabras y nada más" /></h1>
        <div className="sl-cadena">
          {PALABRAS.map(([w, d, flecha], i) => (
            <Paso key={w} n={i} className="sl-eslabon">
              {flecha && <div className="sl-flecha"><span>{flecha}</span></div>}
              <div className="sl-nodo"><b>{w}</b><span>{d}</span></div>
            </Paso>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: 'Devnet',
    notas: 'Todo lo de hoy pasa en devnet: la red de prueba. La plata es de mentira y se pide gratis en un faucet. Las transacciones son de verdad.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Devnet" /></h1>
        <p className="sl-frase" data-in>La red de prueba. Plata de mentira, <em>transacciones de verdad</em>. Todo lo de hoy pasa acá.</p>
      </div>
    ),
  },
  {
    titulo: 'Qué construir',
    pasos: 6,
    notas: 'Qué se puede construir hoy, de lo más simple a lo más desafiante. Es la Guía 3. Con cada → se da vuelta una tarjeta y aparecen dos ideas de ese rubro, pensadas para problemas de acá.\n\nLos tres primeros se hacen con programas que ya existen.\n\nEl último es entre amigos, de persona a persona: la vaquita del asado, donde la plata queda guardada y nadie cobra hasta que pagaron todos, o la apuesta del clásico, que se libera cuando termina el partido. Es lo más difícil porque la custodia necesita un programa propio. Para el sábado, arranquen con pago directo y sumen la custodia después.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Qué construir hoy" /></h1>
        <Rubros />
      </div>
    ),
  },
  {
    titulo: 'El ecosistema',
    notas: 'No hace falta construir todo. El ecosistema ya tiene las piezas, y tu app se arma juntándolas:\n\nWallets como Phantom, Solflare o Backpack. Si tu usuario no tiene wallet, Privy le crea una cuando entra con su mail o con Google. Para que tu app hable con la red, un proveedor como Helius o QuickNode. Para cobrar, Solana Pay, con un QR. Para crear tokens, Metaplex. Y si tu app necesita cambiar un token por otro, Jupiter.\n\nEn "Hagamos una app" vamos a usar varias de estas.',
    contenido: () => (
      <div className="bv">
        <div>
          <h1><WordsIn text="Las piezas ya existen" /></h1>
          <p className="bv-bajada bv-gap-s" data-in>Tu app se arma juntándolas.</p>
        </div>
        <div className="sl-piezas">
          {PIEZAS.map(([etq, nombres, para]) => (
            <div key={etq} data-in><span className="bv-etq">{etq}</span><b>{nombres}</b><p>{para}</p></div>
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: 'Después del sábado',
    pasos: 1,
    notas: 'Y esto no termina el sábado. Así es el camino:\n\nUna hackathon de cuatro semanas, como esta. Los mejores equipos entran a la aceleradora de Colosseum: doce semanas y USD 250.000 de inversión para cada equipo (colosseum.com/accelerator, 2026-10-02). De ahí salen empresas.\n\n→ Ejemplos: Ore ganó la Renaissance en mayo de 2024 y se llevó USD 50.000 (blog de Colosseum, 06/05/2024). CrowdBrain ganó la Frontier en junio de 2026, entre 2.857 proyectos (blog de Colosseum, 26/06/2026). Tensor, uno de los marketplaces más grandes de Solana, salió de hackathons de Solana (Matty Taylor, cofundador de Colosseum, en X).\n\nEl próximo puede salir de esta sala. Y ahora, a construir: Hagamos una app.',
    contenido: () => (
      <div className="bv">
        <h1><WordsIn text="Después del sábado" /></h1>
        <div>
          <div className="sl-cadena sl-camino">
            {CAMINO.map(([w, d, flecha]) => (
              <div key={w} className="sl-eslabon" data-in>
                {flecha && <div className="sl-flecha"><span>{flecha}</span></div>}
                <div className="sl-nodo"><b>{w}</b><span>{d}</span></div>
              </div>
            ))}
          </div>
          <Paso n={1}>
            <p className="sl-salieron"><span className="bv-etq">Salieron de una hackathon</span><b>Ore</b><b>CrowdBrain</b><b>Tensor</b></p>
          </Paso>
        </div>
      </div>
    ),
  },
]

export const solana: Charla = {
  slug: 'solana',
  titulo: '¿Qué #$%& es Solana?',
  bajada: 'Lo justo para construir hoy, explicado en criollo',
  minutos: 20,
  slides,
}
