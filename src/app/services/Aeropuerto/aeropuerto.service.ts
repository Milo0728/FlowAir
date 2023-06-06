import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AeropuertoService {

  constructor(
    private _http: HttpClient
  ) { }

  addAeropuerto(nuevoAeropuerto: any): Observable<any> {
    return this._http.post('http://localhost:8080/aeropuerto/agregarAeropuerto', nuevoAeropuerto);
  }

  updateAeropuerto(updateAeropuerto: any): Observable<any> {
    return this._http.put(`http://localhost:8080/aeropuerto/updateAeropuerto`, updateAeropuerto)
  }

  getAeropuertoList(): Observable<any> {
    return this._http.get(`http://localhost:8080/aeropuerto/obtenerAeropuertos`);
  }
  
  getAeropuertosActivos(): Observable<any> {
    return this._http.get(`http://localhost:8080/aeropuerto/obtenerAeropuertosActivos`);
  }

  deleteAeropuerto(id: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/aeropuerto/deleteAeropuerto/${id}`)
  }
}
