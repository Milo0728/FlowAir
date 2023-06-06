import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      window.location.href = '/';
    } else if (usuario.rol !== 'Administrador') {
      window.location.href = '/';
    }
  }

  cerrarSesion() {
    event.preventDefault();
    localStorage.removeItem('usuario');
    window.location.href = '../login';
  }
}
