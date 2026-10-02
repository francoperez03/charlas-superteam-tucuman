import type { Charla } from '../deck/slide'
import { vacias } from './vacias'

export const codear: Charla = {
  slug: 'codear',
  titulo: 'Mi primer producto con Solana',
  bajada: 'De la idea a una transacción, en vivo',
  minutos: 40,
  slides: vacias('Mi primer producto con Solana', 'codear.tsx'),
}
