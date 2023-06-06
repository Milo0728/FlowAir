import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VueloService {

  constructor(private _http: HttpClient) { }

  addVuelo(nuevoVuelo: any): Observable<any> | any {
    try {
      console.log('desde service: ', nuevoVuelo)
      return this._http.post('http://localhost:8080/vuelo/guardarVuelo', nuevoVuelo);
    } catch (error) {
      console.log(error);
      return ''
    }
  }

  getVueloList(): Observable<any> {
    return this._http.get(`http://localhost:8080/vuelo/obtenerVuelos`);
  }

  getVueloActivoList(): Observable<any> {
    return this._http.get(`http://localhost:8080/vuelo/obtenerVuelosActivos`);
  }

  getVuelo(vueloId: number): Observable<any> {
    return this._http.get(`http://localhost:8080/vuelo/obtenerVuelo/${vueloId}`);;
  }

  deleteVuelo(vueloId: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/vuelo/deleteVuelo/${vueloId}`)
  }

  updateVuelo(data: any): Observable<any> {
    return this._http.put(`http://localhost:8080/vuelo/updateVuelo`, data);
  }
}

