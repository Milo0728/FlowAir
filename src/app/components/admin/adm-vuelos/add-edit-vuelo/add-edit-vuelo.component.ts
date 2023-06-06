import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Aeropuerto } from 'src/app/models/Aeropuerto';
import { Asiento } from 'src/app/models/Asiento';
import { Avion } from 'src/app/models/Avion';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { VueloService } from 'src/app/services/Vuelo/vuelo.service';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-add-edit-vuelo',
  templateUrl: './add-edit-vuelo.component.html',
  styleUrls: ['./add-edit-vuelo.component.css'],
})
export class AddEditVueloComponent {
  today = new Date();
  maxDate = new Date(new Date().getFullYear() + 1, 11, 31); // Ejemplo: fecha máxima de un año a partir de hoy
  departureDate: Date;
  minArrivalDate: Date;

  vueloForm: FormGroup;
  aeropuertos: any[];

  myDatePicker: Date;

  horaLlegada = '';
  fechaLlegada = '';
  horaSalida = '';
  fechaSalida = '';
  estado = '';

  constructor(
    private _fb: FormBuilder,
    private _vueloService: VueloService,
    private _aeropuertoService: AeropuertoService,
    private _dialogRef: MatDialogRef<AddEditVueloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService
  ) {
    this.vueloForm = this._fb.group({
      id: '',
      idAeropuertoOrigen: ['', Validators.required],
      idAeropuertoDestino: ['', Validators.required],
      precioVuelo: ['', [Validators.required, Validators.min(0)]],
      fechaSalida: ['', Validators.required],
      horaSalida: ['', Validators.required],
      fechaLlegada: ['', Validators.required],
      horaLlegada: ['', Validators.required],
      precioAsientoTurista: ['', [Validators.required, Validators.min(0)]],
      precioAsientoPreferencial: ['', [Validators.required, Validators.min(0)]],
      precioAsientoVip: ['', [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
    });

    if (this.data && this.data.id) {
      const idVuelo = this.data.idVuelo;
      const estado = this.data.precio; // Obtén el valor de aerolinea del objeto data
      this.vueloForm.get('idVuelo').setValue(idVuelo); // Establece el valor del campo 'id'
      this.vueloForm.get('estado').setValue(estado); // Establece el valor del campo 'aerolinea'
      this.vueloForm.patchValue(this.data);
    }
  }

  setMinArrivalDate(): void {
    if (this.departureDate) {
      this.minArrivalDate = new Date(this.departureDate.getTime());
      this.minArrivalDate.setDate(this.minArrivalDate.getDate() + 1);
    }
  }

  ngOnInit(): void {
    this.vueloForm.patchValue(this.data);
    this.getAeropuertosActivos();
  }

  onNoClick(): void {
    this._dialogRef.close(false);
  }

  getAeropuertosActivos() {
    this._aeropuertoService.getAeropuertosActivos().subscribe(
      (aeropuertos: Aeropuerto[]) => {
        this.aeropuertos = aeropuertos;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getFormattedDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  onFormSubmit() {
    if (this.vueloForm.valid) {
      const horaSalida = this.vueloForm.get('horaSalida').value;
      const fechaSalida = this.vueloForm.get('fechaSalida').value;

      const horaLlegada = this.vueloForm.get('horaLlegada').value;
      const fechaLlegada = this.vueloForm.get('fechaLlegada').value;

      const _fechaHoraSalida = this.getFormattedDate(
        new Date(`${fechaSalida.toISOString().slice(0, 10)} ${horaSalida}`)
      );
      const _fechaHoraLlegada = this.getFormattedDate(
        new Date(`${fechaLlegada.toISOString().slice(0, 10)} ${horaLlegada}`)
      );

      this.estado = this.vueloForm.get('estado').value;

      if (this.estado == 'Activo') {
        this.estado = 'A';
      } else {
        this.estado = 'I';
      }

      if (this.data) {
        const updateVuelo = {
          idVuelo: this.data.idVuelo.toString(),
          idAeropuertoOrigen: this.vueloForm.get('idAeropuertoOrigen').value,
          idAeropuertoDestino: this.vueloForm.get('idAeropuertoDestino').value,
          precio: this.vueloForm.get('precioVuelo').value,
          precioAsientoPreferencial: this.vueloForm.get(
            'precioAsientoPreferencial'
          ).value,
          precioAsientoVip: this.vueloForm.get('precioAsientoVip').value,
          precioAsientoTurista: this.vueloForm.get('precioAsientoTurista')
            .value,
          fechaHoraSalida: _fechaHoraSalida,
          fechaHoraLlegada: _fechaHoraLlegada,
          estado: this.estado, // Establecer valor predeterminado si es un nuevo vuelo
        };

        this._vueloService.updateVuelo(updateVuelo).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar(
              'Vuelo actualizado correctamente!'
            );
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      } else {
        const newVuelo = {
          idVuelo: '1000',
          idAeropuertoOrigen: this.vueloForm.get('idAeropuertoOrigen').value,
          idAeropuertoDestino: this.vueloForm.get('idAeropuertoDestino').value,
          precio: this.vueloForm.get('precioVuelo').value,
          precioAsientoPreferencial: this.vueloForm.get(
            'precioAsientoPreferencial'
          ).value,
          precioAsientoVip: this.vueloForm.get('precioAsientoVip').value,
          precioAsientoTurista: this.vueloForm.get('precioAsientoTurista')
            .value,
          fechaHoraSalida: _fechaHoraSalida,
          fechaHoraLlegada: _fechaHoraLlegada,
          estado: this.estado, // Establecer valor predeterminado si es un nuevo vuelo
        };

        console.log('Vuelo enviado: ', newVuelo);

        this._vueloService.addVuelo(newVuelo).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar('Vuelo añadido correctamente!');
            this._dialogRef.close(true);
            console.log('Vuelo añadido: ', newVuelo);

          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    }
  }
}
