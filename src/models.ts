interface Coordenate {
  lat: number,
  long: number
}

interface Metrics {
  temperature: number,
  ph: number,
  conductivity: number,
  oxigen: number,
  salinity: number,
  bio_activity: number
}

export interface Buoy {
  id: string,
  name: string
  coords: Coordenate,
  metrics?: Metrics
}