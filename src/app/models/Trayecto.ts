export interface Trayecto {
  id: number;
  idAvion: number;
  idAeropuertoDestino: number;
  idAeropuertoOrigen: number;
  horaSalida: Date;
  horaLlegada: Date;
  idVuelo: number;
  estado: string;
}
