import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Entity } from '../models/entity';
import { HttpObjectResponse } from '../models/http-object-response';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'entities'

  getAllEntitities(): Observable<HttpArrayResponse<Entity>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<Entity>>(this.#BASE_URL + '/getEntities', options);
  }

  getEntityTypeById(id: number): Observable<HttpObjectResponse<Entity>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<Entity>>(this.#BASE_URL + '/getEntityById', options);
  }

  saveEntity(entity: Entity): Observable<HttpObjectResponse<Entity>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = entity
    return this.http.post<HttpObjectResponse<Entity>>(this.#BASE_URL + '/saveEntity', JSON.stringify(body), options);
  }

  deleteEntity(entity: Entity): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: entity.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteEntity', JSON.stringify(body), options);
  }


}
