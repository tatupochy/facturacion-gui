import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Product } from '../models/product';
import { HttpObjectResponse } from '../models/http-object-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'entities'

  getAllProducts(): Observable <Product[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<Product[]>(this.#BASE_URL + '/getEntities', options);
  }


  saveProduct(product: Product): Observable <Product> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = product
    return this.http.post<Product>(this.#BASE_URL + '/saveEntity', JSON.stringify(body), options);
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
