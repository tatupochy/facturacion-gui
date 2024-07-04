import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { HttpObjectResponse } from '../models/http-object-response';
import { DocumentarySerie } from '../models/documentary-serie';

@Injectable({
  providedIn: 'root'
})
export class DocumentarySerieService {

  constructor(private http: HttpClient) {}

  #BASE_URL = environment.apiUrl + 'documentarySeries'

  getAllDocumentarySeries(): Observable<HttpArrayResponse<DocumentarySerie>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('criteria', '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<DocumentarySerie>>(this.#BASE_URL + '/getDocumentarySeries', options);
  }

  getDocumentarySerieTypeById(id: number): Observable<HttpObjectResponse<DocumentarySerie>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id', id ? id.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpObjectResponse<DocumentarySerie>>(this.#BASE_URL + '/getDocumentarySerieById', options);
  }

  getDocumentarySeriesByEntityId(entityId: number): Observable<HttpArrayResponse<DocumentarySerie>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('entityId', entityId ? entityId.toString() : '');
    const options = { headers, params };
    return this.http.get<HttpArrayResponse<DocumentarySerie>>(this.#BASE_URL + '/getDocumentarySeriesByEntityId', options);
  }

  saveDocumentarySerie(documentarySerie: DocumentarySerie): Observable<HttpObjectResponse<DocumentarySerie>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = documentarySerie
    return this.http.post<HttpObjectResponse<DocumentarySerie>>(this.#BASE_URL + '/saveDocumentarySerie', JSON.stringify(body), options);
  }

  deleteDocumentarySerie(documentarySerie: DocumentarySerie): Observable<HttpObjectResponse<number>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    const body = {
      id: documentarySerie.id
    }
    return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL + '/deleteDescriptor', JSON.stringify(body), options);
  }

}
