import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Invoice } from '../models/invoice';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + '/facturas'

  getAllInvoices(): Observable<Invoice[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/listar/`, options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de facturas');
        }
      })
    );
  }

  searchInvoicesByFilter(filter: any): Observable<Invoice[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      operacion: filter.operacion,
      fecha_inicio: filter.fecha_inicio,
    }
    return this.http.post<any>(`${this.#BASE_URL}/buscar/`, JSON.stringify(body), options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de facturas');
        }
      })
    );
  }

  getInvoiceById(id: number): Observable<Invoice> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/detalle/${id}/`, options).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de facturas');
        }
      })
    );
  }


  saveInvoice(Invoice: Invoice): Observable<Invoice> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = JSON.stringify(Invoice); // Convertir el objeto a JSON

    if (Invoice.id) {
      // Actualización del factrura
      return this.http.put<any>(`${this.#BASE_URL}/actualizar/${Invoice.id}/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el factrura actualizado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un factrura');
          }
        })
      );
    } else {
      // Creación de un nuevo factrura
      return this.http.post<any>(`${this.#BASE_URL}/crear/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el factrura creado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un factrura');
          }
        })
      );
    }
  }

  deleteInvoice(Invoice: Invoice): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: Invoice.id
    }
    return this.http.post<number>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
