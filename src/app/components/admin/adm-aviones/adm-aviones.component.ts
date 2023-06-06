import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';
import { AddEditAvionComponent } from './add-edit-avion/add-edit-avion.component';
import { Avion } from 'src/app/models/Avion';

@Component({
  selector: 'app-adm-aviones',
  templateUrl: './adm-aviones.component.html',
  styleUrls: ['./adm-aviones.component.css'],
})
export class AdmAvionesComponent implements OnInit, AfterViewInit {
  aviones: any[];

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }

    this.getAvionList();
  }
  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
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

  displayedColumns: string[] = ['id', 'aerolinea', 'estado', 'acciones'];

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _avionService: AvionService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  openAddEditAvionForm() {
    const dialogRef = this._dialog.open(AddEditAvionComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAvionList();
        }
      },
    });
  }

  getImageUrl(imagen: File): string {
    return URL.createObjectURL(imagen);
  }

  getAvionList() {
    this._avionService.getAvionList().subscribe(
      (data: any[]) => {
        this.aviones = data;
        console.log(data); // Imprimir datos recibidos
        this.dataSource = new MatTableDataSource(this.aviones);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  confirmarEliminacion(id: number, nombreCompleto: string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea eliminar este avión?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._avionService.deleteAvion(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(`El avión ha sido eliminado`);
            this.getAvionList();
          },
          error: console.log,
        });
      }
    });
  }

  borrarAvion(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditAvionComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAvionList();
        }
      },
    });
  }
}
