import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { TipoasientoService } from 'src/app/services/TipoAsiento/tipoasiento.service';

@Component({
  selector: 'app-add-edit-tipoasientos',
  templateUrl: './add-edit-tipoasientos.component.html',
  styleUrls: ['./add-edit-tipoasientos.component.css']
})
export class AddEditTipoasientosComponent implements OnInit {

  tipoAsientoForm: FormGroup;

  ngOnInit(): void {
    this.tipoAsientoForm.patchValue(this.data)
  }

  constructor(
    private _fb: FormBuilder,
    private _tipoAsientoService: TipoasientoService,
    private _dialogRef: MatDialogRef<AddEditTipoasientosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService,
  ) {
    this.tipoAsientoForm = this._fb.group({
      id: '',
      descripcion: '',
      estado: ''
    });

    if (this.data && this.data.id) {
      // Si estás editando un vuelo existente, extrae el número de vuelo de la cadena "VUE-xxx"
      const id = this.data.id.substring(3);
      this.tipoAsientoForm.get('id').setValue(`T-AS-${id}`);
      this.tipoAsientoForm.patchValue(this.data);
    }
  }

  onFormSubmit() {

    if (this.tipoAsientoForm.valid) {
      if (this.data) {
        this._tipoAsientoService.updateTipoAsiento(this.data.id, this.tipoAsientoForm.value)
          .subscribe({
            next: (val: any) => {
              this._mensajeService.openSnackBar('Tipo de asiento actualizado correctamente!')
              this._dialogRef.close(true);
              console.log(this.data)
            },
            error: (err: any) => {
              console.log(err)
            }
          })
      } else {
        this._tipoAsientoService.addTipoAsiento(this.tipoAsientoForm.value).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar('Tipo de asiento actualizado correctamente!')
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
