import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private apiUrl = 'http://localhost:3000/usuarios';

  constructor(
    private _http: HttpClient
  ) { }


  addUsuario(nuevoUsuario: any): Observable<any> {
    return this._http.post('http://localhost:8080/usuarios/agregarUsuario', nuevoUsuario);
  }

  getUsuarioList(): Observable<any> {
    return this._http.get(`http://localhost:8080/usuarios/obtenerUsuarios`);
  }
  
  getUsuarioActivoList(): Observable<any> {
    return this._http.get(`http://localhost:8080/usuarios/obtenerUsuariosActivos`);
  }

  getUsuario(userId: number): Observable<any> {
    return null;

  }

  deleteUsuario(userId: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/usuarios/deleteUsuario/${userId}`)
  }

  updateUsuario(data: any): Observable<any> {
    return this._http.put(`http://localhost:8080/usuarios/updateUsuario`, data);
  }


  validateCedula(cedula: string, idUsuario: number): Observable<boolean> {
    return this.getUsuarioList().pipe(
      map((usuarios: Usuario[]) => {
        const existingUsuario = usuarios.find(usuario => usuario.cedula === cedula && usuario.id !== idUsuario);
        return !existingUsuario;
      })
    );
  }
}
