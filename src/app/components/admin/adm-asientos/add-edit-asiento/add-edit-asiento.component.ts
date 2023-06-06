import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avion } from 'src/app/models/Avion';
import { TipoAsiento } from 'src/app/models/TipoAsiento';
import { AsientoService } from 'src/app/services/Asiento/asiento.service';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';

@Component({
  selector: 'app-add-edit-asiento',
  templateUrl: './add-edit-asiento.component.html',
  styleUrls: ['./add-edit-asiento.component.css'],
})
export class AddEditAsientoComponent implements OnInit {
  asientos: any[];
  asientoForm: FormGroup;
  aviones: any[];

  estado = '';
  tipoa = '';

  ngOnInit(): void {
    this.asientoForm.patchValue(this.data);
    this.obtenerAviones();
  }

  constructor(
    private _fb: FormBuilder,
    private _asientoService: AsientoService,
    private _avionService: AvionService,
    private _dialogRef: MatDialogRef<AddEditAsientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService
  ) {
    this.asientoForm = this._fb.group({
      id: '',
      idTipoa: ['', Validators.required],
      idAvion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
    });
    if (this.data && this.data.nombre) {
      const idAsiento = this.data.idAsiento;
      const ubicacion = this.data.ubicacion; // Obtén el valor de aerolinea del objeto data
      this.asientoForm.get('id').setValue(idAsiento); // Establece el valor del campo 'id'
      this.asientoForm.get('ubicacion').setValue(ubicacion); // Establece el valor del campo 'aerolinea'
      this.asientoForm.patchValue(this.data);
    }
  }

  obtenerAviones(): void {
    this._avionService.getAvionList().subscribe((aviones) => {
      this.aviones = aviones;
    });
  }

  onFormSubmit() {
    if (this.asientoForm.valid) {
      this.estado = this.asientoForm.get('estado').value;

      if (this.estado == 'Activo') {
        this.estado = 'A';
      } else {
        this.estado = 'I';
      }

      this.tipoa = this.asientoForm.get('idTipoa').value;

      if (this.tipoa == 'Preferencial') {
        this.tipoa = '1';
      } else if (this.tipoa === 'Vip') {
        this.tipoa = '2';
      } else {
        this.tipoa = '3';
      }

      if (this.data) {
        const updateAsiento = {
          idAsiento: this.data.idAsiento.toString(),
          idTipoa: this.tipoa,
          idAvion: this.asientoForm.get('idAvion').value,
          ubicacion: this.asientoForm.get('ubicacion').value,
          precio: this.asientoForm.get('precio').value,
          estado: this.estado,
        };
        this._asientoService.updateAsiento(updateAsiento).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar(
              'Asiento actualizado correctamente!'
            );
            this._dialogRef.close(true);
            console.log(this.data);
            window.location.reload(); // Recargar la página
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    }
  }
}
