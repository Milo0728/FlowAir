import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoasientoService {

  constructor(
    private _http: HttpClient
  ) { }

  addTipoAsiento(nuevoTipoAsiento: any): Observable<any> {
    const id = this.generarNuevoId();
    nuevoTipoAsiento.id = id;
    return this._http.post('http://localhost:3000/tipoAsientos', nuevoTipoAsiento);
  }

  updateTipoAsiento(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/tipoAsientos/${id}`, data)
  }

  getTipoAsiento(id: string): Observable<any> {
    return this._http.get(`http://localhost:3000/tipoAsientos/${id}`)
  }


  getTipoAsientoList(): Observable<any> {
    return this._http.get('http://localhost:3000/tipoAsientos');
  }

  deleteTipoAsiento(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/tipoAsientos/${id}`)
  }

  private generarNuevoId(): string {
    const numero = Math.floor(Math.random() * 1000) + 1;
    return `T-AS-${numero.toString().padStart(3, '0')}`;
  }
}
