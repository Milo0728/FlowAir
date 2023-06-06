import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvionService } from 'src/app/services/Avion/avion.service';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-edit-avion',
  templateUrl: './add-edit-avion.component.html',
  styleUrls: ['./add-edit-avion.component.css']
})
export class AddEditAvionComponent implements OnInit {

  avionForm: FormGroup;

  estado = ''

  constructor(
    private _fb: FormBuilder,
    private _avionService: AvionService,
    private _dialogRef: MatDialogRef<AddEditAvionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService
  ) {

    this.avionForm = this._fb.group({
      id: '',
      aerolineaAvion: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u00FF\s]+$/)]],
      estado: ['', Validators.required]
    });

    if (this.data && this.data.aerolinea) {
      const idAvion = this.data.idAvion;
      const aerolineaAvion = this.data.aerolineaAvion; // Obtén el valor de aerolinea del objeto data
      this.avionForm.get('id').setValue(idAvion); // Establece el valor del campo 'id'
      this.avionForm.get('aerolineaAvion').setValue(aerolineaAvion); // Establece el valor del campo 'aerolinea'
      this.avionForm.patchValue(this.data);
    }
  }

  ngOnInit(): void {
    this.avionForm.patchValue(this.data)
  }

  onNoClick(): void {
    this._dialogRef.close(false);
  }

  capitalizeWords(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  
  capitalizeInput(controlName: string): void {
    const control = this.avionForm.get(controlName);
    if (control && control.value) {
      control.setValue(this.capitalizeWords(control.value), { emitEvent: false });
    }
  }

  onFormSubmit() {
    if (this.avionForm.valid) {

      this.estado = this.avionForm.get('estado').value

      if (this.estado == 'Activo') {
        this.estado = 'A'
      } else {
        this.estado = 'I'
      }

      if (this.data) {

        const updateAvion = {
          idAvion: this.data.idAvion.toString(), // Corregir aquí: usar 'id' en lugar de 'idAvion'
          aerolineaAvion: this.avionForm.get('aerolineaAvion').value,
          estado: this.estado
        };

        this._avionService.updateAvion(updateAvion).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar('Avion actualizado correctamente!')
            this._dialogRef.close(true);
            console.log(this.data)
            console.log('Avion actualizado:', updateAvion)
          },
          error: (err: any) => {
            console.log(err)
          }
        });
      } else {

        const newAvion = {
          idAvion: '1000',
          aerolineaAvion: this.avionForm.get('aerolineaAvion').value,
          estado: this.estado
        }

        console.log('nuevo: ', newAvion)

        this._avionService.addAvion(newAvion).subscribe({
          next: (val: any) => {
            console.log('Avion creado: ', newAvion)
            this._mensajeService.openSnackBar('Avion añadido correctamente!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err)
            console.log(newAvion)
          }
        });
      }
    }
  }
}

