import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsientoService {

  constructor(
    private _http: HttpClient
  ) { }

  addAsiento(nuevoAeropuerto: any): Observable<any> {
    return this._http.post('http://localhost:8080/asiento/agregarAsiento', nuevoAeropuerto);
  }

  updateAsiento(updateAeropuerto: any): Observable<any> {
    return this._http.put(`http://localhost:8080/asiento/updateAsiento`, updateAeropuerto)
  }

  getAsientoList(): Observable<any> {
    return this._http.get(`http://localhost:8080/asiento/obtenerAsientos`);
  }

  deleteAsiento(id: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/asiento/deleteAsiento/${id}`)
  }

}