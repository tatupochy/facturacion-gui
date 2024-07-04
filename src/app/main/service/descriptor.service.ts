import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { Descriptor } from '../models/descriptor';

@Injectable({
  providedIn: 'root'
})
export class DescriptorService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'descriptors'

  getAllDescriptors(): Observable<HttpArrayResponse<Descriptor>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<Descriptor>>(this.#BASE_URL + '/getDescriptors', options);
  }

  getDescriptorTypeById(id: number): Observable<HttpObjectResponse<Descriptor>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<Descriptor>>(this.#BASE_URL + '/getDescriptorById', options);
  }

  saveDescriptor(descriptor: Descriptor): Observable<HttpObjectResponse<Descriptor>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = descriptor
    return this.http.post<HttpObjectResponse<Descriptor>>(this.#BASE_URL + '/saveDescriptor', JSON.stringify(body), options);
  }

  deleteDescriptor(descriptor: Descriptor): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: descriptor.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteDescriptor', JSON.stringify(body), options);
  }


}
