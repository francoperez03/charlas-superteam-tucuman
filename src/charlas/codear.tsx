import type { Charla } from '../deck/slide'
import { vacias } from './vacias'

export const codear: Charla = {
  slug: 'codear',
  titulo: 'Vamo a codeá',
  bajada: 'De la idea a una transacción, en vivo',
  minutos: 40,
  slides: vacias('Vamo a codeá', 'codear.tsx'),
}
