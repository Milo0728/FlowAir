import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { MensajesService } from 'src/app/services/Mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/Usuarios/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  usuarios: any[];
  disponible = false;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _mensajeService: MensajesService
  ) {
    this.registrationForm = this._formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      correo: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]],
    });

    const cedulaControl = this.registrationForm.get('cedula') as FormControl;

    this.registrationForm
      .get('cedula')
      .setValidators([
        Validators.required,
        (control) => this.validarCedula(cedulaControl),
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

  onFormSubmit() {
    if (this.registrationForm.valid) {
      const newUsuario = {
        idUsuario: 1000,
        idRolusuario: '2',
        cedula: this.registrationForm.get('cedula').value,
        nombre: this.registrationForm.get('nombre').value,
        apellido: this.registrationForm.get('apellido').value,
        correo: this.registrationForm.get('correo').value,
        estado: 'A',
      };

      this._usuarioService.addUsuario(newUsuario).subscribe({
        next: (val: any) => {
          this._mensajeService.openSnackBar('Usuario creado correctamente!');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this._mensajeService.openSnackBar(err.error.mensaje)
          console.log(err);
        },
      });
    }
  }
}
