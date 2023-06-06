import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { AddEditAsientoComponent } from './add-edit-asiento/add-edit-asiento.component';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';
import { AvionService } from 'src/app/services/Avion/avion.service';

@Component({
  selector: 'app-adm-asientos',
  templateUrl: './adm-asientos.component.html',
  styleUrls: ['./adm-asientos.component.css'],
})
export class AdmAsientosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  aviones: any[];

  displayedColumns: string[] = [
    'idAsiento',
    'idTipoa',
    'idAvion',
    'ubicacion',
    'precio',
    'estado',
    'acciones',
  ];

  constructor(
    private _dialog: MatDialog,
    private _asientoService: AsientoService,
    private _avionService: AvionService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }

    this.getAsientoList();
    this.obtenerAviones();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    // this.getAsientoList()
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddEditAsientoForm() {
    const dialogRef = this._dialog.open(AddEditAsientoComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAsientoList();
        }
      },
    });
  }

  getAsientoList() {
    this._asientoService.getAsientoList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getTipoAsiento(idTipoAsiento: number): string {
    if (idTipoAsiento === 1) {
      return 'Preferencial';
    } else if (idTipoAsiento === 2) {
      return 'Vip';
    } else {
      return 'Turista';
    }
  }

  obtenerAviones(): void {
    this._avionService.getAvionList().subscribe((aviones) => {
      this.aviones = aviones;
    });
  }

  getAerolinea(idAvion: number): string {
    for (let i = 0; i < this.aviones.length; i++) {
      if (idAvion === this.aviones[i].idAvion) {
        return this.aviones[i].aerolineaAvion;
      }
    }
    return 'no hay aerolinea';
  }

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  confirmarEliminacion(id: number, nombreCompleto: string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea eliminar este asiento?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._asientoService.deleteAsiento(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(`El asiento ha sido eliminado`);
            this.getAsientoList();
          },
          error: console.log,
        });
      }
    });
  }

  deleteAsiento(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditAsientoComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getAsientoList();
        }
      },
    });
  }
}
