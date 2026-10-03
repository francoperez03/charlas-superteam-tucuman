# Charlas · Road to Colosseum X Tucumán

Sitio de las charlas de la jornada del sábado 3 de octubre de 2026 (track argentino de Superteam en el Crypto World's Fair de Colosseum y Solana).

En vivo: https://charlas-superteam-tucuman.vercel.app (Vercel, cada push a `main` se publica solo) y, como respaldo, https://francoperez03.github.io/charlas-superteam-tucuman/ (GitHub Pages, se publica con `npm run pages`).

El 2026-10-03 la cuenta de Vercel quedó pausada (`DEPLOYMENT_DISABLED`, HTTP 402 en todos los proyectos): hasta que se reactive desde el panel de Vercel, el sitio que anda es el de GitHub Pages.

## Qué es

Un menú con tres charlas y un deck por charla, sobre un lienzo fijo de 1920×1080 que se escala a cualquier pantalla.

- Bienvenidos
- ¿Qué #$%& es Solana?
- Hagamos una app

## Correrlo

```bash
npm install
npm run dev     # http://localhost:5181
npm run build
```

## Teclado

| Tecla | Qué hace |
|---|---|
| → , espacio, AvPág | Avanza (primero los pasos de la slide, después la slide) |
| ← , RePág | Vuelve |
| Inicio / Fin | Primera y última slide |
| F | Pantalla completa |
| P | Abre el modo presentador en otra ventana |
| Esc | Vuelve al menú |

El modo presentador muestra la slide actual, la siguiente, un cronómetro y el guion, y se mueve junto con la ventana del proyector.

## Sumar una slide

Cada charla vive en `src/charlas/<charla>.tsx` y es una lista de objetos:

```tsx
{
  titulo: 'Qué es una wallet',     // para el contador y el presentador
  pasos: 2,                        // partes que aparecen de a una con →
  notas: 'Lo que voy a decir.',    // se ve solo en el modo presentador
  contenido: () => (
    <>
      <h1><WordsIn text="Qué es una wallet" /></h1>
      <Paso n={1}><p className="cuerpo">Tu usuario en Solana.</p></Paso>
      <Paso n={2}><img src="/img/phantom.png" alt="Phantom" /></Paso>
    </>
  ),
}
```

## Imágenes

Van en `public/img/` y se usan con la ruta `/img/nombre.png`.

## Con qué está hecho

React, Vite, TypeScript y GSAP. Estado en la URL (`?charla=solana&slide=3&step=1`), sin router y sin backend.

El menú tiene un fondo animado muy tenue hecho con [vgpu](https://vgpu.sh) (WebGPU), en `src/fondo.ts`. Es decorativo: si el navegador no tiene WebGPU, no se dibuja y queda el fondo de siempre.
