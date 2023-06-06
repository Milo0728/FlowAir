import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUsuarioComponent } from './add-edit-usuario/add-edit-usuario.component';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { ConfirmacionComponent } from 'src/app/shared/confirmacion/confirmacion.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { RolUsuario } from 'src/app/models/RolUsuario';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-adm-usuarios',
  templateUrl: './adm-usuarios.component.html',
  styleUrls: ['./adm-usuarios.component.css'],
})
export class AdmUsuariosComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[];

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'correo',
    'idRolUsuario',
    'estado',
    'acciones',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _mensajeService: MensajesService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  getRolDescripcion(idRol: number): string {
    if (idRol === 1) {
      return 'Administrador';
    } else {
      return 'Cliente';
    }
  }

  getEstado(estado: string): string {
    if (estado === 'A') {
      return 'Activo';
    } else {
      return 'Inactivo';
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

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }

    this.getUsuarioList();
  }

  openAddEditUsuarioForm() {
    const dialogRef = this._dialog.open(AddEditUsuarioComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUsuarioList();
        }
      },
    });
  }

  getUsuarioList() {
    this._usuarioService.getUsuarioList().subscribe(
      (data: any[]) => {
        this.usuarios = data;
        console.log(data); // Imprimir datos recibidos
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmarEliminacion(id: number, nombreCompleto: string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '350px',
      data: { mensaje: `¿Está seguro que desea eliminar a ${nombreCompleto}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._usuarioService.deleteUsuario(id).subscribe({
          next: (res) => {
            this._mensajeService.openSnackBar(
              `${nombreCompleto} ha sido eliminado`
            );
            this.getUsuarioList();
          },
          error: console.log,
        });
      }
    });
  }

  deleteUsuario(id: number) {
    this.confirmarEliminacion(id, '');
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditUsuarioComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUsuarioList();
        }
      },
    });
  }
}
