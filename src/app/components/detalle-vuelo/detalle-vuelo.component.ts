import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aeropuerto } from 'src/app/models/Aeropuerto';
import { Vuelo } from 'src/app/models/Vuelo';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import { MatDialog } from '@angular/material/dialog';
import { ElegirAsientoVueloComponent } from './elegir-asiento-vuelo/elegir-asiento-vuelo.component';
import { AddReservaComponent } from './add-reserva/add-reserva.component';

@Component({
  selector: 'app-detalle-vuelo',
  templateUrl: './detalle-vuelo.component.html',
  styleUrls: ['./detalle-vuelo.component.css'],
})
export class DetalleVueloComponent implements OnInit {
  vuelo: any;
  aeropuertos: any[];
  selectedSeat: string = '';

  id = ''


  constructor(
    private activatedRoute: ActivatedRoute,
    private vueloService: VueloService,
    private aeropuertoService: AeropuertoService,
    private dialog: MatDialog,
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      const vueloId = params.get('id');
      if (vueloId) {
        this.getVuelo(parseInt(vueloId));
        this.getAeropuertos(); // Obtener la lista de aeropuertos
      }
    });
  }

  ngOnInit(): void { }

  openDialog(vueloId: number): void {


    if (localStorage.getItem('usuario')) {
      const dialogRef = this.dialog.open(AddReservaComponent, {
        width: '900px',
        data: { vueloId: vueloId, selectedSeat: this.selectedSeat },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedSeat = result;
        }
      });
    } else {
      window.location.href = '../login';
    }

  }

  getVuelo(vueloId: number): void {
    this.vueloService.getVuelo(vueloId).subscribe((vuelo) => {
      this.vuelo = vuelo;
    });
  }

  getAeropuertos(): void {
    this.aeropuertoService.getAeropuertoList().subscribe((aeropuertos) => {
      this.aeropuertos = aeropuertos;
    });
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

  getNombreAeropuerto(aeropuertoId: number): string {
    const aeropuerto = this.aeropuertos.find(
      (a) => a.idAeropuerto === aeropuertoId
    );
    return aeropuerto ? aeropuerto.nombre : '';
  }

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }
}
