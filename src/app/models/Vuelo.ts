export interface Vuelo {
  id: number;
  idAeropuertoOrigen: number;
  idAeropuertoDestino: number;
  precio: number;
  fechaHoraSalida: Date;
  fechaHoraLlegada: Date;
  precioAsientoPreferencial: number;
  precioAsientoVip: number;
  precioAsientoTurista: number;
  estado: string;
}
