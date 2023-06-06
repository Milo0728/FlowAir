export interface Reserva {
  id: number;
  idVuelo: number;
  idAsiento: number;
  idUsuario: number;
  precioTotal: number;
  estadoPago: string;
  fecha: Date;
  estado: string;
}
