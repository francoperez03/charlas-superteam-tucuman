import type { Charla } from '../deck/slide'
import { vacias } from './vacias'

export const bienvenidos: Charla = {
  slug: 'bienvenidos',
  titulo: 'Bienvenidos',
  bajada: 'Qué es Colosseum, los premios y cómo sigue el día',
  minutos: 10,
  slides: vacias('Bienvenidos', 'bienvenidos.tsx'),
}
