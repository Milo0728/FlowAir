import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { Asiento } from 'src/app/models/Asiento';
import { Avion } from 'src/app/models/Avion';
import { Vuelo } from 'src/app/models/Vuelo';

@Injectable({
  providedIn: 'root'
})
export class AvionService {

  constructor(
    private _http: HttpClient
  ) { }

  addAvion(nuevoAvion: any): Observable<any> {
    return this._http.post('http://localhost:8080/aviones/agregarAvion', nuevoAvion);
  }

  updateAvion(updateAvion: any): Observable<any> {
    return this._http.put(`http://localhost:8080/aviones/updateAvion`, updateAvion)
  }

  getAvion(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/aviones/${id}`)
  }

  getAvionList(): Observable<any> {
    return this._http.get(`http://localhost:8080/aviones/obtenerAviones`);
  }
  
  getAvionActivoList(): Observable<any> {
    return this._http.get(`http://localhost:8080/aviones/obtenerAvionesActivos`);
  }

  deleteAvion(id: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/aviones/deleteAvion/${id}`)
  }

}
