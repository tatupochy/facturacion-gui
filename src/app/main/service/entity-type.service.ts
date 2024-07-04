import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { EntityType } from '../models/entity-type';

@Injectable({
  providedIn: 'root'
})
export class EntityTypeService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'entityTypes'

  getAllEntityTypes(): Observable<HttpArrayResponse<EntityType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<EntityType>>(this.#BASE_URL + '/getEntityTypes', options);
  }

  getEntityTypeById(id: number): Observable<HttpObjectResponse<EntityType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<EntityType>>(this.#BASE_URL + '/getEntityTypeById', options);
  }

  saveEntityType(entityType: EntityType): Observable<HttpObjectResponse<EntityType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = entityType;
    return this.http.post<HttpObjectResponse<EntityType>>(this.#BASE_URL + '/saveEntityType', body, options);
  }

  deleteEntityType(entityType: EntityType): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: entityType.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteEntityType', JSON.stringify(body), options);
  }


}
