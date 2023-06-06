import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Vuelo } from 'src/app/models/Vuelo';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import { SeatDialogComponent } from '../seat-dialog/seat-dialog.component';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';

@Component({
  selector: 'app-add-edit-reserva',
  templateUrl: './add-edit-reserva.component.html',
  styleUrls: ['./add-edit-reserva.component.css'],
})
export class AddEditReservaComponent {
  vuelos: any[];
  aviones: any[];
  aeropuertos: any[];
  usuarios: any[];
  reservas: any[];
  asientos: any[];

  disponible = false;

  fechaActual = Date();

  selectedSeat: string = '';

  estado = '';
  estadoPago = '';
  ubicacion = '';
  idAsientoReciente = '';
  precioTotal = 0;

  precioAsiento = 0;

  usuarioSeleccionado: Vuelo;
  vueloSeleccionado: Vuelo;
  reservaForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _reservaService: ReservaService,
    private _asientoService: AsientoService,
    private _dialogRef: MatDialogRef<AddEditReservaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService,
    private _vueloService: VueloService,
    private _aeropuertoService: AeropuertoService,
    private _avionService: AvionService,
    private _usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {
    this.reservaForm = this._fb.group({
      idVuelo: ['', Validators.required],
      idAvion: ['', Validators.required],
      idUsuario: ['', Validators.required],
      ubicacion: ['', Validators.required],
      estadoPago: ['', Validators.required],
      estado: ['', Validators.required],
    });
    if (this.data && this.data.id) {
      const idReserva = this.data.idReserva;
      const estado = this.data.estado; // Obtén el valor de aerolinea del objeto data
      this.reservaForm.get('idReserva').setValue(idReserva); // Establece el valor del campo 'id'
      this.reservaForm.get('estado').setValue(estado); // Establece el valor del campo 'aerolinea'
      this.reservaForm.patchValue(this.data);
    }

    this.selectedSeat = '';

    // Obtén una referencia al FormControl 'ubicacion'
    const ubicacionControl = this.reservaForm.get('ubicacion') as FormControl;

    // Agrega la validación personalizada al campo "ubicacion"
    this.reservaForm.get('ubicacion').setValidators([
      Validators.required, // Validación requerida (opcional, si es necesario)
      (control) => this.validarAsientoDisponible(ubicacionControl), // Validación personalizada con función de flecha
    ]);
  }

  validarAsientoDisponible(
    control: FormControl
  ): { [key: string]: any } | null {
    this.disponible = this.getAsientosDisponibles(control.value);

    if (this.disponible === true) {
      return { asientoNoDisponible: true };
    }

    return null; // Retorna null si el asiento está disponible
  }

  ngOnInit(): void {
    this.reservaForm.patchValue(this.data);

    this.getReservas();
    this.getAsientos();
    this.getVuelosActivos();
    this.getAeropuertos();
    this.getUsuariosActivos();
    this.getAvionesActivos();
  }

  getAsientosDisponibles(ubicacion: string): boolean {
    for (let i = 0; i < this.reservas.length; i++) {
      if (
        this.reservaForm.get('idVuelo').value.idVuelo ===
        this.reservas[i].idVuelo
      ) {
        for (let j = 0; j < this.asientos.length; j++) {
          if (this.asientos[j].idAsiento === this.reservas[i].idAsiento) {
            for(let k = 0; k < this.aviones.length; k++) {
              if(this.aviones[k].idAvion === this.reservaForm.get('idAvion').value) {
                if(this.asientos[j].idAvion === this.aviones[k].idAvion) {
                  if (this.asientos[j].ubicacion === ubicacion) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  getReservas() {
    this._reservaService.getReservaList().subscribe(
      (reservas: any[]) => {
        this.reservas = reservas;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAsientos() {
    this._asientoService.getAsientoList().subscribe(
      (asientos: any[]) => {
        this.asientos = asientos;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SeatDialogComponent, {
      width: '900px',
      data: { selectedSeat: this.selectedSeat },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedSeat = result;
        this.reservaForm.get('ubicacion').setValue(this.selectedSeat);
      }
    });
  }

  getVuelosActivos() {
    this._vueloService.getVueloActivoList().subscribe(
      (vuelos: Vuelo[]) => {
        this.vuelos = vuelos;
      },
      (error: any) => {
        console.log(error);
      }
    );
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

  getUsuariosActivos() {
    this._usuarioService.getUsuarioActivoList().subscribe(
      (usuarios: any[]) => {
        this.usuarios = usuarios;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAeropuertoNombre(idAeropuerto: number): string {
    for (let i = 0; i < this.aeropuertos.length; i++) {
      if (idAeropuerto === this.aeropuertos[i].idAeropuerto) {
        return this.aeropuertos[i].ubicacion;
      }
    }
    return 'no hay nombres';
  }

  getUsuarioNombre(idUsuario: number): string {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (idUsuario === this.usuarios[i].idUsuario) {
        return (
          +this.usuarios[i].cedula +
          ' - ' +
          this.usuarios[i].nombre +
          ' ' +
          this.usuarios[i].apellido
        );
      }
    }
    return 'no hay nombres';
  }

  getPrecioAsiento(idVuelo: number, ubicacion: string) {
    for (let i = 0; i < this.vuelos.length; i++) {
      if (idVuelo === this.vuelos[i].idVuelo) {
        if (ubicacion === '1') {
          return this.vuelos[i].precioAsientoPreferencial;
        } else if (ubicacion === '2') {
          return this.vuelos[i].precioAsientoVip;
        } else {
          return this.vuelos[i].precioAsientoTurista;
        }
      }
    }
  }

  getPrecioTotal(idVuelo: number, ubicacion: string): number {
    for (let i = 0; i < this.vuelos.length; i++) {
      if (idVuelo === this.vuelos[i].idVuelo) {
        if (ubicacion === '1') {
          return (
            this.vuelos[i].precio + this.vuelos[i].precioAsientoPreferencial
          );
        } else if (ubicacion === '2') {
          return this.vuelos[i].precio + this.vuelos[i].precioAsientoVip;
        } else {
          return this.vuelos[i].precio + this.vuelos[i].precioAsientoTurista;
        }
      }
    }
    return 0;
  }

  onNoClick(): void {
    this._dialogRef.close(false);
  }

  onFormSubmit() {
    if (this.reservaForm.valid) {
      this.estado = this.reservaForm.get('estado').value;

      if (this.estado === 'Activo') {
        this.estado = 'A';
      } else {
        this.estado = 'I';
      }

      this.estadoPago = this.reservaForm.get('estadoPago').value;

      if (this.estadoPago === 'Pagado') {
        this.estadoPago = 'P';
      } else {
        this.estadoPago = 'E';
      }

      this.ubicacion = this.reservaForm.get('ubicacion').value;

      const numero = this.ubicacion.substring(1);

      if (numero === '1' || numero === '2') {
        this.ubicacion = '1';
      } else if (numero === '3' || numero === '4') {
        this.ubicacion = '2';
      } else {
        this.ubicacion = '3';
      }

      this.precioAsiento = this.getPrecioAsiento(
        this.reservaForm.get('idVuelo').value.idVuelo,
        this.ubicacion
      );

      const newAsiento = {
        idAsiento: '1000',
        idTipoa: this.ubicacion,
        idAvion: this.reservaForm.get('idAvion').value,
        ubicacion: this.reservaForm.get('ubicacion').value,
        precio: this.precioAsiento,
        estado: this.estado,
      };

      this._asientoService.addAsiento(newAsiento).subscribe({
        next: (val: any) => {
          this.idAsientoReciente = val.idAsiento;

          this.precioTotal = this.getPrecioTotal(
            this.reservaForm.get('idVuelo').value.idVuelo,
            this.ubicacion
          );

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString();
          this.fechaActual = formattedDate;

          const newReserva = {
            idReserva: '1000',
            idVuelo: this.reservaForm.get('idVuelo').value.idVuelo,
            idAsiento: this.idAsientoReciente,
            idUsuario: this.reservaForm.get('idUsuario').value,
            precioTotal: this.precioTotal,
            fecha: this.fechaActual,
            estadoPago: this.estadoPago,
            estado: this.estado,
          };

          this._reservaService.addReserva(newReserva).subscribe({
            next: (val: any) => {
              this._mensajeService.openSnackBar(
                'Reserva creada correctamente!'
              );
              this._dialogRef.close(true);
            },
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

      //location.reload();
    }
  }
}
