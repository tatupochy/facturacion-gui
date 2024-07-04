import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { DataType } from '../models/data-type';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'dataTypes'

  getAllDataTypes(): Observable<HttpArrayResponse<DataType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<DataType>>(this.#BASE_URL + '/getDataTypes', options);
  }

  getDataTypeById(id: number): Observable<HttpObjectResponse<DataType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<DataType>>(this.#BASE_URL + '/getStateById', options);
  }

  saveDataType(dataType: DataType): Observable<HttpObjectResponse<DataType>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = dataType;
    return this.http.post<HttpObjectResponse<DataType>>(this.#BASE_URL + '/saveDataType', JSON.stringify(body), options);
  }

  deleteDataType(dataType: DataType): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: dataType.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteDataType', JSON.stringify(body), options);
  }


}
