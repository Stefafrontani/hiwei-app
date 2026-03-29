import type { CameraPosition } from './CameraPosition'

// TODO: Revisar si la estructura de DashcamVideo sigue siendo la adecuada.
// - youtubeId: ID del video de YouTube (ej.: "tonzvI7RnEA").
// - label: texto visible antes de reproducir el video; actualmente describe el clip,
//   aunque podría evaluarse usarlo como highlight comercial.
// - cameraPosition: define el ángulo de cámara para segmentar los videos.
//   Valores soportados: 'frontal' | 'trasera' | 'interior'.
export interface DashcamVideo {
  youtubeId: string
  label: string
  cameraPosition: CameraPosition
}
