export interface Aeropuerto {
  idAeropuerto: number;
  nombre: string;
  iata: string;
  ubicacion: string;
  estado: 'Disponible' | 'Lleno';
}
