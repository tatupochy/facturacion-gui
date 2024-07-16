import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Purchase } from '../models/purchase';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + '/compras'

  getAllPurchases(): Observable<Purchase[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/listar/`, options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de compras');
        }
      })
    );
  }


  savePurchase(purchase: Purchase): Observable<Purchase> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = JSON.stringify(purchase); // Convertir el objeto a JSON

    if (purchase.id) {
      // Actualización del compra
      return this.http.put<any>(`${this.#BASE_URL}/actualizar/${purchase.id}/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el compra actualizado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un compra');
          }
        })
      );
    } else {
      // Creación de un nuevo compra
      return this.http.post<any>(`${this.#BASE_URL}/crear/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el compra creado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un compra');
          }
        })
      );
    }
  }

  deletePurchase(purchase: Purchase): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: purchase.id
    }
    return this.http.post<number>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
