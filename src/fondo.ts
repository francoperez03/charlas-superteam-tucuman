// Fondo del menú: dos manchas de luz muy tenues (amarillo y lavanda) que se mueven despacio, hechas con vgpu (WebGPU).
// Es decorativo: si el navegador no tiene WebGPU o el inicio falla, no se dibuja nada y queda el fondo de siempre.
// El patrón de arranque y limpieza es el de la guía de vgpu para React (npx vgpu docs cat nextjs.md).
import { clock, effect, frameLoop, init, surface } from 'vgpu'
import type { FrameLoopHandle } from 'vgpu'

const SHADER = /* wgsl */ `
struct Params { time: f32, texel: vec2f }
@group(0) @binding(0) var<uniform> params: Params;

fn mancha(uv: vec2f, centro: vec2f, aspecto: f32, radio: f32) -> f32 {
  let d = (uv - centro) * vec2f(aspecto, 1.0);
  return exp(-dot(d, d) / (radio * radio));
}
fn grano(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(12.9898, 78.233))) * 43758.5453);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let t = params.time;
  let aspecto = params.texel.y / params.texel.x;
  let amarillo = vec3f(0.945, 0.788, 0.129);
  let lavanda = vec3f(0.561, 0.600, 0.941);
  let a = mancha(uv, vec2f(0.74 + 0.10 * sin(t * 0.11), 0.30 + 0.08 * cos(t * 0.13)), aspecto, 0.42);
  let b = mancha(uv, vec2f(0.20 + 0.08 * cos(t * 0.09), 0.80 + 0.10 * sin(t * 0.07)), aspecto, 0.50);
  // intensidad baja a propósito: tiene que notarse recién al mirar un rato
  var color = amarillo * a * 0.085 + lavanda * b * 0.11;
  color += (grano(uv / params.texel + fract(t) * 61.0) - 0.5) * 0.012;
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`

/** Arranca el fondo sobre `canvas`. Devuelve la función que lo detiene y libera la GPU. */
export function iniciarFondo(canvas: HTMLCanvasElement, quieto: boolean): () => void {
  let cortado = false
  let loop: FrameLoopHandle | undefined
  let gpu: Awaited<ReturnType<typeof init>> | undefined

  void (async () => {
    try {
      gpu = await init()
      if (cortado) return gpu.dispose()
      const lienzo = surface(gpu, canvas, { dpr: [1, 1.5] })
      const fx = effect(gpu, SHADER, { label: 'fondo', set: { params: { time: 0, texel: lienzo.texelSize } } })
      lienzo.onResize(() => fx.set({ params: { texel: lienzo.texelSize } }))
      canvas.dataset.listo = '1' // el CSS lo hace aparecer recién cuando hay algo dibujado
      const reloj = clock(gpu)
      // ponytail: con movimiento reducido el tiempo queda en 0 y se redibuja el mismo cuadro; un único frame() al
      // iniciar y en cada resize gastaría menos, pero choca con el ciclo de resize de vgpu (frameReentrantError).
      loop = frameLoop(gpu, (f) => {
        if (!quieto) fx.set({ params: { time: reloj.time } })
        f.pass(lienzo, fx)
      })
    } catch {
      gpu?.dispose() // sin adaptador o shader rechazado: queda el fondo de CSS
    }
  })()

  return () => {
    cortado = true
    loop?.stop()
    gpu?.dispose()
  }
}
