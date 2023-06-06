import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrayectoService {

  constructor(
    private _http: HttpClient
  ) { }

  addTrayecto(nuevoTrayecto: any): Observable<any> {
    const id = this.generarNuevoId();
    nuevoTrayecto.id = id;
    return this._http.post('http://localhost:3000/trayecto', nuevoTrayecto);
  }

  updateTrayecto(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/trayecto/${id}`, data)
  }

  getTrayecto(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/trayecto/${id}`)
  }


  getTrayectoList(): Observable<any> {
    return this._http.get('http://localhost:3000/trayecto');
  }

  deleteTrayecto(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/trayecto/${id}`)
  }

  private generarNuevoId(): string {
    const numero = Math.floor(Math.random() * 1000) + 1;
    return `TRA-${numero.toString().padStart(3, '0')}`;
  }
}
