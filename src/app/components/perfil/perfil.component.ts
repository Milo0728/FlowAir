import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  reservas: any[];
  vuelos: any[];
  aeropuertos: any[];
  aviones: any[];
  asientos: any[];
  tipoa = 0;
  avion = 0;
  ubicacion = '';
  precio = 0;

  displayedColumns: string[] = [
    'id',
    'idVuelo',
    'idAvion',
    'idAsiento',
    'precioTotal',
    'estadoPago',
    'fecha',
    'acciones',
  ];

  dataSource: MatTableDataSource<any>;

  constructor(
    private _dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _reservaService: ReservaService,
    private _asientoService: AsientoService,
    private _mensajeService: MensajesService,
    private _avionService: AvionService,
    private _aeropuertoService: AeropuertoService,
    private _vueloService: VueloService
  ) {}

  ngOnInit() {
    this.obtenerReservas();
    this.getAeropuertos();
    this.obtenerVuelos();
    this.obtenerAsientos();
    this.getAvionesActivos()
  }

  getEstadoPago(estado: string): string {
    if (estado === 'P') {
      return 'Pagado';
    } else {
      return 'En Espera';
    }
  }

  obtenerVuelos(): void {
    this._vueloService.getVueloList().subscribe((vuelos) => {
      this.vuelos = vuelos;
    });
  }

  obtenerAsientos(): void {
    this._asientoService.getAsientoList().subscribe((asientos) => {
      this.asientos = asientos;
    });
  }

  getUbicacion(idAsiento: number): string {
    for (let i = 0; i < this.asientos.length; i++) {
      if (idAsiento === this.asientos[i].idAsiento) {
        return this.asientos[i].ubicacion;
      }
    }
    return 'no hay ubicacion';
  }

  getAeropuertos() {
    this._aeropuertoService.getAeropuertoList().subscribe(
      (aeropuertos: any[]) => {
        this.aeropuertos = aeropuertos;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAeropuertoNombreO(idVuelo: number): string {
    for (let i = 0; i < this.vuelos.length; i++) {
      if (idVuelo === this.vuelos[i].idVuelo) {
        for (let j = 0; j < this.aeropuertos.length; j++) {
          if (
            this.vuelos[i].idAeropuertoOrigen ===
            this.aeropuertos[j].idAeropuerto
          ) {
            return this.aeropuertos[j].nombre;
          }
        }
      }
    }
    return 'no hay nombres';
  }

  getAeropuertoNombreD(idVuelo: number): string {
    for (let i = 0; i < this.vuelos.length; i++) {
      if (idVuelo === this.vuelos[i].idVuelo) {
        for (let j = 0; j < this.aeropuertos.length; j++) {
          if (
            this.vuelos[i].idAeropuertoDestino ===
            this.aeropuertos[j].idAeropuerto
          ) {
            return this.aeropuertos[j].nombre;
          }
        }
      }
    }
    return 'no hay nombres';
  }

  getAerolinea(idAsiento: number): string {
    for (let i = 0; i < this.asientos.length; i++) {
      if (idAsiento === this.asientos[i].idAsiento) {
        for (let j = 0; j < this.aviones.length; j++) {
          if (this.asientos[i].idAvion === this.aviones[j].idAvion) {
            return this.aviones[j].aerolineaAvion;
          }
        }
      }
    }
    return 'no hay nombres';
  }

  getAvionesActivos() {
    this._avionService.getAvionActivoList().subscribe(
      (aviones: any[]) => {
        this.aviones = aviones;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerReservas() {
    this._reservaService.getReservasActivasList().subscribe((reservas) => {
      this.getReservaList(reservas);
    });
  }

  getReservaList(res: any) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const reservasFiltradas = res.filter(
      (reserva) => reserva.idUsuario === usuario.id
    );

    this.dataSource = new MatTableDataSource(reservasFiltradas);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getNombre(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    return usuario.nombre + ' ' + usuario.apellido;
  }

  cancelarReserva(
    idReserva: number,
    idVuelo: number,
    idAsiento: number,
    precioTotal: number,
    fecha: Date,
    estadoPago: string
  ) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea cancelar esta reserva?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const updateReserva = {
          idReserva: idReserva,
          idVuelo: idVuelo,
          idAsiento: idAsiento,
          idUsuario: usuario.id,
          precioTotal: precioTotal,
          fecha: fecha,
          estadoPago: estadoPago,
          estado: 'I',
        };

        this._reservaService.updateReserva(updateReserva).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar(
              'Reserva cancelada correctamente!'
            );

            for (let i = 0; i < this.asientos.length; i++) {
              if (idAsiento === this.asientos[i].idAsiento) {
                this.tipoa = this.asientos[i].idTipoa;
                this.avion = this.asientos[i].idAvion;
                this.ubicacion = this.asientos[i].ubicacion;
                this.precio = this.asientos[i].precio;
              }
            }

            const updateAsiento = {
              idAsiento: idAsiento,
              idTipoa: this.tipoa,
              idAvion: this.avion,
              ubicacion: this.ubicacion,
              precio: this.precio,
              estado: 'I',
            };

            this._asientoService.updateAsiento(updateAsiento).subscribe({
              next: (val: any) => {},
              error: (err: any) => {
                console.log(err);
              },
            });

            window.location.reload();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  cerrarSesion() {
    event.preventDefault();
    localStorage.removeItem('usuario');
    window.location.href = '../login';
  }

  irAVuelos() {
    window.location.href = '../vuelos';
  }
}
