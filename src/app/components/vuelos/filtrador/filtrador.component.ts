import { Component, EventEmitter, Output } from '@angular/core';
import { Vuelo } from 'src/app/models/Vuelo';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';

@Component({
  selector: 'app-filtrador',
  templateUrl: './filtrador.component.html',
  styleUrls: ['./filtrador.component.css'],
})
export class FiltradorComponent {
  vuelos: Vuelo[];

  today = new Date();
  maxDate = new Date(new Date().getFullYear() + 1, 11, 31); // Ejemplo: fecha máxima de un año a partir de hoy
  departureDate: Date;
  minArrivalDate: Date;

  options = [];

  @Output() filtrarVuelos = new EventEmitter<Vuelo[]>();

  constructor(private _vueloService: VueloService) {
    for (let i = 1; i <= 12; i++) {
      this.options.push({ value: i, label: i + ' Pasajeros' });
    }
  }

  setMinArrivalDate(): void {
    if (this.departureDate) {
      this.minArrivalDate = new Date(this.departureDate.getTime());
      this.minArrivalDate.setDate(this.minArrivalDate.getDate() + 1);
    }
  }

  onBuscarVuelo() {
    this._vueloService.getVueloList().subscribe((vuelos) => {
      this.vuelos = vuelos.filter(
        (vuelo) =>
          // Filtramos los vuelos que tengan origen y destino igual a los seleccionados
          vuelo.origen === vuelo.origen &&
          vuelo.destino === vuelo.destinoSeleccionado &&
          // Filtramos los vuelos que tengan fecha de salida igual o posterior a la seleccionada
          new Date(vuelo.fechaSalida) >= this.departureDate &&
          // Filtramos los vuelos que tengan fecha de llegada igual o posterior a la seleccionada
          new Date(vuelo.fechaLlegada) >= this.minArrivalDate
      );
      this.filtrarVuelos.emit(this.vuelos);
    });
  }
}
