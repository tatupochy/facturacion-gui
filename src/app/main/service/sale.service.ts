import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Sale } from '../models/sale';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + '/ventas'

  getAllSales(): Observable<Sale[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/listar/`, options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de ventas');
        }
      })
    );
  }


  saveSale(sale: Sale): Observable<Sale> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = JSON.stringify(sale); // Convertir el objeto a JSON

    if (sale.id) {
      // Actualización del venta
      return this.http.put<any>(`${this.#BASE_URL}/actualizar/${sale.id}/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el venta actualizado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un venta');
          }
        })
      );
    } else {
      // Creación de un nuevo venta
      return this.http.post<any>(`${this.#BASE_URL}/crear/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el venta creado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un venta');
          }
        })
      );
    }
  }

  deleteSale(sale: Sale): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: sale.id
    }
    return this.http.post<number>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
