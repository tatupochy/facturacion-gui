import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { Transfer } from '../models/transfer';
import { Entity } from '../models/entity';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'transfers'

  getAllTransfers(): Observable<HttpArrayResponse<Transfer>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<Transfer>>(this.#BASE_URL + '/getTransfers', options);
  }

  getTransferById(id: number): Observable<HttpObjectResponse<Transfer>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<Transfer>>(this.#BASE_URL + '/getTransferById', options);
  }

  getTransfersByFilter(filter: any): Observable<HttpArrayResponse<Transfer>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      entity: filter.entity,
      documentarySerie: filter.documentarySerie,
      identifier: filter.identifier,
      transferDateStart: filter.transferDateStart,
      transferDateEnd: filter.transferDateEnd,
    }
    return this.http.post<HttpArrayResponse<Transfer>>(this.#BASE_URL + '/getTransfersByFilter', JSON.stringify(body), options);
  }

  saveTransfer(transfer: Transfer): Observable<HttpObjectResponse<Transfer>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = transfer
    return this.http.post<HttpObjectResponse<Transfer>>(this.#BASE_URL + '/saveTransfer', JSON.stringify(body), options);
  }

  deleteTransfer(transfer: Transfer): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: transfer.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteTransfer', JSON.stringify(body), options);
  }


}
