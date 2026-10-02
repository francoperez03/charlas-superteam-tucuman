// Quiénes dan la jornada: foto, red y QR de cada uno, para la slide de presentación del equipo.
// Las fotos y los QR viven en public/img/. `qr` es la red a la que apunta el QR.
// ponytail: los QR son SVG estáticos; si cambia un link, regenerarlo con
// npx qrcode -t svg -q 2 -d 0a0b0fff -l efeee6ff -o public/img/qr-<quien>.svg "<url>"
export type Persona = { nombre: string; rol?: string; foto: string; qr: { red: string; usuario: string; img: string } }

export const EQUIPO: Persona[] = [
  { nombre: 'Franco Pérez', rol: 'Fundador de Crisol', foto: '/img/franco-mic.jpg', qr: { red: 'Instagram', usuario: 'franco.perez03', img: '/img/qr-franco.svg' } },
  { nombre: 'Ignacio Albarracin', foto: '/img/foto_nacho.jpeg', qr: { red: 'LinkedIn', usuario: 'ignacio-albarracin', img: '/img/qr-nacho.svg' } },
  { nombre: 'Alejandro Colchi', foto: '/img/foto_alejo.jpeg', qr: { red: 'X', usuario: 'alejow_dev', img: '/img/qr-alejo.svg' } },
]
