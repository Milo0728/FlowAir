import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolUsuario } from 'src/app/models/RolUsuario';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';

@Component({
  selector: 'app-add-edit-usuario',
  templateUrl: './add-edit-usuario.component.html',
  styleUrls: ['./add-edit-usuario.component.css']
})
export class AddEditUsuarioComponent implements OnInit {

  usuarioForm: FormGroup;

  rol = ''
  disponible = false

  usuarios: any[]
  estado = ''

  constructor(
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _dialogRef: MatDialogRef<AddEditUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mensajeService: MensajesService,
  ) {
    this.usuarioForm = this._fb.group({
      id: '',
      idRolusuario: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u00FF]+(\s[a-zA-Z\u00C0-\u00FF]+)*$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u00FF]+(\s[a-zA-Z\u00C0-\u00FF]+)*$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      estado: ['', Validators.required]
    });

    const cedulaControl = this.usuarioForm.get('cedula') as FormControl;

    this.usuarioForm
      .get('cedula')
      .setValidators([
        Validators.required,
        (control) => this.validarCedula(cedulaControl),
      ]);

    if (this.data && this.data.nombre) {
      const cedula = this.data.cedula;
      const nombreUsuario = this.data.nombre; // Obtén el valor de aerolinea del objeto data
      this.usuarioForm.get('id').setValue(cedula); // Establece el valor del campo 'id'
      this.usuarioForm.get('nombre').setValue(nombreUsuario); // Establece el valor del campo 'aerolinea'
      this.usuarioForm.patchValue(this.data);
    }


  }

  validarCedula(control: FormControl): { [key: string]: any } | null {
    this.disponible = this.getCedulas(control.value);

    if (this.disponible === true) {
      return { cedulaNoDisponible: true };
    }

    return null;
  }

  getCedulas(cedula: string): boolean {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (cedula === this.usuarios[i].cedula) {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
    this.usuarioForm.patchValue(this.data)
    this.getUsuarios();
  }

  getUsuarios(): void {
    this._usuarioService.getUsuarioList().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  capitalizeWords(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  capitalizeInput(controlName: string): void {
    const control = this.usuarioForm.get(controlName);
    if (control && control.value) {
      control.setValue(this.capitalizeWords(control.value), { emitEvent: false });
    }
  }

  onFormSubmit() {

    if (this.usuarioForm.valid) {

      this.estado = this.usuarioForm.get('estado').value

      if (this.estado == 'Activo') {
        this.estado = 'A'
      } else {
        this.estado = 'I'
      }

      if (this.data) {

        this.rol = this.usuarioForm.get('idRolusuario').value

        if (this.rol === 'Cliente') {
          this.rol = '2'
        } else {
          this.rol = '1'
        }

        const updateUsuario = {
          idUsuario: this.data.idUsuario.toString(), // Corregir aquí: usar 'id' en lugar de 'idAvion'
          idRolusuario: this.rol,
          cedula: this.usuarioForm.get('cedula').value,
          nombre: this.usuarioForm.get('nombre').value,
          apellido: this.usuarioForm.get('apellido').value,
          correo: this.usuarioForm.get('correo').value,
          estado: this.estado
        };

        console.log('uupdate: ', updateUsuario)

        this._usuarioService.updateUsuario(updateUsuario)
          .subscribe({
            next: (val: any) => {
              this._mensajeService.openSnackBar('Usuario actualizado correctamente!')
              this._dialogRef.close(true);
              console.log(this.data)
              console.log('Usuario actualizado:', updateUsuario)
            },
            error: (err: any) => {
              console.log(err)
            }
          })
      } else {

        this.rol = this.usuarioForm.get('idRolusuario').value

        if (this.rol === 'Cliente') {
          this.rol = '2'
        } else {
          this.rol = '1'
        }

        const newUsuario = {
          idUsuario: '1000',
          idRolusuario: this.rol,
          cedula: this.usuarioForm.get('cedula').value,
          nombre: this.usuarioForm.get('nombre').value,
          apellido: this.usuarioForm.get('apellido').value,
          correo: this.usuarioForm.get('correo').value,
          estado: this.estado
        };

        console.log('nuevo usuario: ', newUsuario)

        this._usuarioService.addUsuario(newUsuario).subscribe({
          next: (val: any) => {
            this._mensajeService.openSnackBar('Usuario actualizado correctamente!')

            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err)
            this._mensajeService.openSnackBar(err.error.mensaje)

          }
        })
      }

    }

  }

}
