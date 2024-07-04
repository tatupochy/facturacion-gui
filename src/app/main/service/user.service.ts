import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User } from '../models/user';
import { HttpObjectResponse } from '../models/http-object-response';
import { HttpArrayResponse } from "../models/http-array.response";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    #BASE_URL_SECURITY = environment.apiUrlSifSecurity + '/api/user';

    constructor(private http: HttpClient) {}

    saveUser(user: User): Observable<HttpObjectResponse<User>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = JSON.stringify(user);
        return this.http.post<HttpObjectResponse<User>>(this.#BASE_URL_SECURITY + '/save', body, { headers });
    }

    deleteUser(user: User): Observable<HttpObjectResponse<number>> {
        return this.http.post<HttpObjectResponse<number>>(this.#BASE_URL_SECURITY + '/delete', user);
    }

    getUsers(): Observable<HttpArrayResponse<User>> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get<HttpArrayResponse<User>>(this.#BASE_URL_SECURITY + '/getAll', { headers });
    }

    getByUsername(username?: string): Observable<any>  {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const params = new HttpParams().set('userName', username || '');
        const options = { headers, params };
        return this.http.get<HttpObjectResponse<User>>(this.#BASE_URL_SECURITY + '/getByUserName?', options);
    }

}
