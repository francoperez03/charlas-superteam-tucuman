import type { Charla } from '../deck/slide'
import { vacias } from './vacias'

export const codear: Charla = {
  slug: 'codear',
  titulo: 'Hagamos una app',
  bajada: 'De la idea a una transacción, en vivo',
  minutos: 40,
  slides: vacias('Hagamos una app', 'codear.tsx'),
}
