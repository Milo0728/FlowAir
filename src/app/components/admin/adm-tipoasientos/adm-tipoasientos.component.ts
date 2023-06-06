import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { TipoasientoService } from 'src/app/services/TipoAsiento/tipoasiento.service';
import { AddEditTipoasientosComponent } from './add-edit-tipoasientos/add-edit-tipoasientos.component';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';

@Component({
  selector: 'app-adm-tipoasientos',
  templateUrl: './adm-tipoasientos.component.html',
  styleUrls: ['./adm-tipoasientos.component.css'],
})
export class AdmTipoasientosComponent implements OnInit, AfterViewInit {
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
    this.getTipoAsientoList();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['id', 'descripcion', 'estado', 'acciones'];

  constructor(
    private _dialog: MatDialog,
    private _tipoAsientoService: TipoasientoService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

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

  openAddEditTipoAsientoForm() {
    const dialogRef = this._dialog.open(AddEditTipoasientosComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTipoAsientoList();
        }
      },
    });
  }

  getImageUrl(imagen: File): string {
    return URL.createObjectURL(imagen);
  }

  getTipoAsientoList() {
    this._tipoAsientoService.getTipoAsientoList().subscribe({
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
      data: {
        mensaje: `¿Está seguro que desea eliminar este tipo de asiento?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._tipoAsientoService.deleteTipoAsiento(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(
              `El tipo de asiento ha sido eliminado`
            );
            this.getTipoAsientoList();
          },
          error: console.log,
        });
      }
    });
  }

  deleteTipoAsiento(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditTipoasientosComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTipoAsientoList();
        }
      },
    });
  }
}
