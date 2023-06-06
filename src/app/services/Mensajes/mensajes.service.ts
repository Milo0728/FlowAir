import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  openSnackBar(mensaje: string, action: string = 'Entendido') {
    this._snackBar.open(mensaje, action, {
      duration: 3000
    })
  }
}
