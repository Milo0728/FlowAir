import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Aeropuerto } from 'src/app/models/Aeropuerto';
import { AeropuertoService } from 'src/app/services/Aeropuerto/aeropuerto.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';

@Component({
  selector: 'app-add-edit-aeropuerto',
  templateUrl: './add-edit-aeropuerto.component.html',
  styleUrls: ['./add-edit-aeropuerto.component.css']
})
export class AddEditAeropuertoComponent {

  aeropuertos: Aeropuerto[]
  aeropuertoForm: FormGroup;

  estado = ''

  constructor(
    private _fb: FormBuilder,
    private _aeropuertoService: AeropuertoService,
    private _dialogRef: MatDialogRef<AddEditAeropuertoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService,
  ) {
    this.aeropuertoForm = this._fb.group({
      id: '',
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[\w\sáéíóúÁÉÍÓÚñÑ]+$/)]],
      iata: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern(/^[\w\sáéíóúÁÉÍÓÚñÑ]+$/)]],
      ubicacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[\w\sáéíóúÁÉÍÓÚñÑ]+$/)]],
      estado: ['', Validators.required],
    });
    if (this.data && this.data.nombre) {
      const idAeropuerto = this.data.idAeropuerto;
      const nombre = this.data.nombre; // Obtén el valor de aerolinea del objeto data
      this.aeropuertoForm.get('id').setValue(idAeropuerto); // Establece el valor del campo 'id'
      this.aeropuertoForm.get('nombre').setValue(nombre); // Establece el valor del campo 'aerolinea'
      this.aeropuertoForm.patchValue(this.data);


    }
  }

  ngOnInit(): void {
    // Obtener el vuelo actual del formulario
    this.aeropuertoForm.patchValue(this.data);
  }

  onFormSubmit() {

    if (this.aeropuertoForm.valid) {

      this.estado = this.aeropuertoForm.get('estado').value

      if (this.estado == 'Activo') {
        this.estado = 'A'
      } else {
        this.estado = 'I'
      }

      if (this.data) {
        const updateAeropuerto = {
          idAeropuerto: this.data.idAeropuerto.toString(),
          nombre: this.aeropuertoForm.get('nombre').value,
          iata: this.aeropuertoForm.get('iata').value,
          ubicacion: this.aeropuertoForm.get('ubicacion').value,
          estado: this.estado
        };

        this._aeropuertoService.updateAeropuerto(updateAeropuerto)
          .subscribe({
            next: (val: any) => {
              this._mensajeService.openSnackBar('Aeropuerto actualizado correctamente!')
              this._dialogRef.close(true);
              console.log(this.data)
            },
            error: (err: any) => {
              console.log(err)
            }
          })
      } else {

        const newAeropuerto = {
          idAeropuerto: '1000', // Corregir aquí: usar 'id' en lugar de 'idAvion'
          nombre: this.aeropuertoForm.get('nombre').value,
          iata: this.aeropuertoForm.get('iata').value,
          ubicacion: this.aeropuertoForm.get('ubicacion').value,
          estado: this.estado
        };

        this._aeropuertoService.addAeropuerto(newAeropuerto).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar('Aeropuerto actualizado correctamente!')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err)
          }
        })
      }

    }

  }

}
