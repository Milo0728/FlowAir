import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Aeropuerto } from 'src/app/models/Aeropuerto';
import { Vuelo } from 'src/app/models/Vuelo';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import jsonFile from '../../json/db.json';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],
})
export class VuelosComponent implements OnInit {
  aeropuertos: Aeropuerto[] = [];
  vuelos: any[] = [];

  constructor(
    private _vueloService: VueloService,
    private _aeropuertoService: AeropuertoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._vueloService.getVueloActivoList().subscribe((vuelos: any[]) => {
      this.vuelos = vuelos;
    });

    this._aeropuertoService
      .getAeropuertoList()
      .subscribe((aeropuertos: Aeropuerto[]) => {
        this.aeropuertos = aeropuertos;
      });
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getImagen() {
    const randomNumber = this.getRandomNumber(0, 16);
    const rutaImagen = jsonFile.vuelos[randomNumber].ruta;
    return rutaImagen;
  }

  getUbicacionAeropuerto(idAeropuerto: number) {
    if (!this.aeropuertos) {
      return '';
    }

    const aeropuerto = this.aeropuertos.find(
      (r) => r.idAeropuerto === idAeropuerto
    );
    return aeropuerto ? aeropuerto.ubicacion : '';
  }

  getImagenAeropuerto(idAeropuerto: number) {
    if (!this.aeropuertos) {
      return '';
    }

    const aeropuerto = this.aeropuertos.find(
      (r) => r.idAeropuerto === idAeropuerto
    );
    return aeropuerto ? aeropuerto : '';
  }

  verDetalleVuelo(idVuelo: number) {
    const idVueloStr = idVuelo.toString(); // Conversión a string
    this.router.navigate(['/detalle-vuelo', idVueloStr]);
  }
}
