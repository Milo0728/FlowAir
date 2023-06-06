import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  usuarios: any[];
  disponibleCorreo = false;
  disponibleCedula = false;

  constructor(
    private formBuilder: FormBuilder,
    private _mensajeService: MensajesService,
    private _usuarioService: UsuarioService
  ) {
    this.loginForm = this.formBuilder.group({
      correo: ['', Validators.required],
      cedula: ['', Validators.required],
    });

    const cedulaControl = this.loginForm.get('cedula') as FormControl;
    const correoControl = this.loginForm.get('correo') as FormControl;

    this.loginForm
      .get('cedula')
      .setValidators([
        Validators.required,
        (control) => this.validarCedula(cedulaControl),
      ]);

    this.loginForm
      .get('correo')
      .setValidators([
        Validators.required,
        (control) => this.validarCorreo(correoControl),
      ]);
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this._usuarioService.getUsuarioList().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  getCedulas(cedula: string): boolean {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (cedula === this.usuarios[i].cedula) {
        return false;
      }
    }
    return true;
  }

  getCorreos(correo: string): boolean {
    for (let i = 0; i < this.usuarios.length; i++) {
      if (correo === this.usuarios[i].correo) {
        return false;
      }
    }
    return true;
  }

  validarCedula(control: FormControl): { [key: string]: any } | null {
    this.disponibleCedula = this.getCedulas(control.value);

    if (this.disponibleCedula === true) {
      return { cedulaNoDisponible: true };
    }

    return null; // Retorna null si el asiento está disponible
  }

  validarCorreo(control: FormControl): { [key: string]: any } | null {
    this.disponibleCorreo = this.getCorreos(control.value);

    if (this.disponibleCorreo === true) {
      return { correoNoDisponible: true };
    }

    return null; // Retorna null si el asiento está disponible
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      const correo = this.loginForm.get('correo').value;
      const cedula = this.loginForm.get('cedula').value;

      for (let i = 0; i < this.usuarios.length; i++) {
        if (correo === this.usuarios[i].correo && cedula === this.usuarios[i].cedula) {
          if (this.usuarios[i].idRolusuario === 1) {
            const usuario = {
              id: this.usuarios[i].idUsuario,
              nombre: this.usuarios[i].nombre,
              apellido: this.usuarios[i].apellido,
              rol: 'Administrador',
            };

            const usuarioJSON = JSON.stringify(usuario);

            // Almacenar el objeto JSON en el localStorage
            localStorage.setItem('usuario', usuarioJSON);
            window.location.href = '/admin';
            i = this.usuarios.length + 1;
          } else {
            const usuario = {
              id: this.usuarios[i].idUsuario,
              nombre: this.usuarios[i].nombre,
              apellido: this.usuarios[i].apellido,
              rol: 'Cliente',
            };

            const usuarioJSON = JSON.stringify(usuario);

            // Almacenar el objeto JSON en el localStorage
            localStorage.setItem('usuario', usuarioJSON);
            window.location.href = '/vuelos';
            i = this.usuarios.length + 1;
          }
        } else {
          this._mensajeService.openSnackBar('¡Credenciales incorrectas!');
        }
      }
    }
  }


}
