import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vuelo } from 'src/app/models/Vuelo';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import { AddEditReservaComponent } from './add-edit-reserva/add-edit-reserva.component';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';

@Component({
  selector: 'app-adm-reservas',
  templateUrl: './adm-reservas.component.html',
  styleUrls: ['./adm-reservas.component.css'],
})
export class AdmReservasComponent implements OnInit, AfterViewInit {
  asientos: any[];
  usuarios: any[];

  constructor(
    private _dialog: MatDialog,
    private _reservaService: ReservaService,
    private _asientoService: AsientoService,
    private _vueloService: VueloService,
    private _usuarioService: UsuarioService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  displayedColumns: string[] = [
    'id',
    'idVuelo',
    'idAsiento',
    'idUsuario',
    'precioTotal',
    'estadoPago',
    'fecha',
    'estado',
    'acciones',
  ];

  dataSource: MatTableDataSource<any>;
  vuelos: Vuelo[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }

    this.getReservaList();
    this.obtenerAsientos();
    this.obtenerVuelos();
    this.obtenerUsuarios();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  obtenerAsientos() {
    this._asientoService.getAsientoList().subscribe((asientos) => {
      this.asientos = asientos;
    });
  }

  getUsuarioNombre(idUsuario: number): string {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (idUsuario === this.usuarios[i].idUsuario) {
        return this.usuarios[i].nombre + ' ' + this.usuarios[i].apellido;
      }
    }
    return 'no hay nombre';
  }

  getAsientoDescripcion(idAsiento: number): string {
    for (let i = 0; i < this.asientos.length; i++) {
      if (idAsiento === this.asientos[i].idAsiento) {
        return this.asientos[i].ubicacion;
      }
    }
    return 'no hay ubicacion';
  }

  obtenerUsuarios(): void {
    this._usuarioService.getUsuarioList().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  obtenerVuelos(): void {
    this._vueloService.getVueloList().subscribe((vuelos) => {
      this.vuelos = vuelos;
    });
  }

  openAddEditReservaForm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%'; // Ancho inicial del cuadro de diálogo
    dialogConfig.maxWidth = '800px'; // Ancho máximo del cuadro de diálogo

    const dialogRef = this._dialog.open(AddEditReservaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getReservaList();
        }
      },
    });
  }

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  getEstadoPago(estado: string): string {
    if (estado === 'P') {
      return 'Pagado';
    } else {
      return 'En Espera';
    }
  }

  getReservaList() {
    this._reservaService.getReservaList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res);
      },
      error: console.log,
    });
  }

  confirmarEliminacion(id: number, nombreCompleto: string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea eliminar esta reserva?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._reservaService.deleteReserva(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(`La reserva ha sido eliminada`);
            this.getReservaList();
            window.location.reload();
          },
          error: console.log,
        });
      }
    });
  }

  deleteReserva(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditReservaComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getReservaList();
        }
      },
    });
  }
}
