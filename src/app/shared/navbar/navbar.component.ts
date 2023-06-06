import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const login = document.getElementById('login');
    const perfil = document.getElementById('perfil');
    const admin = document.getElementById('admin');
    const admin2 = document.getElementById('admin2');
    const home = document.getElementById('home');
    const vuelos = document.getElementById('vuelos');
    const seccion = document.getElementById('seccion');
    const flowair = document.getElementById('flowair');
    const nav = document.getElementById('nav');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (localStorage.getItem('usuario')) {
      if (usuario.rol === 'Cliente') {
        admin.style.display = 'none';
        seccion.style.display = 'none';
        perfil.style.display = 'block';
        login.style.display = 'none';
      } else {
        perfil.style.display = 'none';
        login.style.display = 'none';
        nav.style.background = '#0077be';
        flowair.style.color = '#fff';
        seccion.style.color = '#fff';
        seccion.style.fontWeight = 'bold';
        seccion.style.display = 'block';
        admin.style.display = 'block';
        admin2.style.color = '#fff';
        home.style.color = '#fff';
        vuelos.style.color = '#fff';
      }
    } else {
      perfil.style.display = 'none';
      login.style.display = 'block';
      seccion.style.display = 'none';
      admin.style.display = 'none';
    }
  }
}
