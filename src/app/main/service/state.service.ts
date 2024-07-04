import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { EntityType } from '../models/entity-type';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'states'

  getAllStates(): Observable<HttpArrayResponse<State>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<State>>(this.#BASE_URL + '/getStates', options);
  }

  getStateById(id: number): Observable<HttpObjectResponse<State>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<State>>(this.#BASE_URL + '/getStateById', options);
  }

  saveState(state: State): Observable<HttpObjectResponse<State>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = state;
    return this.http.post<HttpObjectResponse<EntityType>>(this.#BASE_URL + '/saveState', body, options);
  }

  deleteState(state: State): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: state.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteState', JSON.stringify(body), options);
  }


}
