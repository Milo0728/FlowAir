import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';
import { AddEditAeropuertoComponent } from './add-edit-aeropuerto/add-edit-aeropuerto.component';

@Component({
  selector: 'app-adm-aeropuertos',
  templateUrl: './adm-aeropuertos.component.html',
  styleUrls: ['./adm-aeropuertos.component.css'],
})
export class AdmAeropuertosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }

    this.getAeropuertoList();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayedColumns: string[] = [
    'id',
    'nombre',
    'iata',
    'ubicacion',
    'estado',
    // 'imagenCiudad',
    'acciones',
  ];

  constructor(
    private _dialog: MatDialog,
    private _aeropuertoService: AeropuertoService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  openAddEditAeropuertoForm() {
    const dialogRef = this._dialog.open(AddEditAeropuertoComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAeropuertoList();
        }
      },
    });
  }

  getImageUrl(imagen: File): string {
    return URL.createObjectURL(imagen);
  }

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  getAeropuertoList() {
    this._aeropuertoService.getAeropuertoList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  confirmarEliminacion(id: number, nombreCompleto: string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea eliminar este aeropuerto?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._aeropuertoService.deleteAeropuerto(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(
              `El aeropuerto ha sido eliminado`
            );
            this.getAeropuertoList();
          },
          error: console.log,
        });
      }
    });
  }

  deleteAeropuerto(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditAeropuertoComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAeropuertoList();
        }
      },
    });
  }
}
