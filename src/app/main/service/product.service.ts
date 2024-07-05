import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Product } from '../models/product';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + '/productos'

  getAllProducts(): Observable<Product[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    return this.http.get<any>(`${this.#BASE_URL}/listar/`, options).pipe(
      map(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Respuesta inesperada del servidor:', response);
          throw new Error('La respuesta no es un arreglo de productos');
        }
      })
    );
  }


  saveProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = JSON.stringify(product); // Convertir el objeto a JSON

    if (product.id) {
      // Actualización del producto
      return this.http.put<any>(`${this.#BASE_URL}/actualizar/${product.id}/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el producto actualizado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un producto');
          }
        })
      );
    } else {
      // Creación de un nuevo producto
      return this.http.post<any>(`${this.#BASE_URL}/crear/`, body, options).pipe(
        map(response => {
          if (response.status === 'success') {
            return response.data; // Retornar el producto creado
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            throw new Error('La respuesta no es un producto');
          }
        })
      );
    }
  }

  deleteProduct(product: Product): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: product.id
    }
    return this.http.post<number>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
