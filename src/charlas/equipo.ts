// Quiénes dan la jornada: foto y red de cada uno, para la slide de presentación del equipo.
// Las fotos viven en public/img/.
export type Persona = { nombre: string; foto: string; redes: { red: string; url: string }[] }

export const EQUIPO: Persona[] = [
  { nombre: 'Franco', foto: '/img/franco-mic.jpg', redes: [{ red: 'X', url: 'https://x.com/crypto_dev_1' }, { red: 'Instagram', url: 'https://www.instagram.com/franco.perez03/' }] },
  { nombre: 'Nacho', foto: '/img/foto_nacho.jpeg', redes: [{ red: 'LinkedIn', url: 'https://www.linkedin.com/in/ignacio-albarracin/' }] },
  { nombre: 'Alejo', foto: '/img/foto_alejo.jpeg', redes: [{ red: 'X', url: 'https://x.com/alejow_dev' }] },
]
