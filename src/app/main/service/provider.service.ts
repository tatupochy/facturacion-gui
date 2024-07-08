import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Provider } from '../models/provider';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + '/proveedores'

  getAllProviders(): Observable<Provider[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/listar/`, options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de proveedores');
        }
      })
    );
  }


  saveProvider(provider: Provider): Observable<Provider> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = JSON.stringify(provider); // Convertir el objeto a JSON

    if (provider.id) {
      // Actualización del proveedor
      return this.http.put<any>(`${this.#BASE_URL}/actualizar/${provider.id}/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el proveedor actualizado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un proveedor');
          }
        })
      );
    } else {
      // Creación de un nuevo proveedor
      return this.http.post<any>(`${this.#BASE_URL}/crear/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el proveedor creado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un proveedor');
          }
        })
      );
    }
  }

  deleteProvider(provider: Provider): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: provider.id
    }
    return this.http.post<number>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
