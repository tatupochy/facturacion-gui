import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) {}

  #BASE_URL_SECURITY = environment.apiUrlSifSecurity + '/api/role'

  getAllUserRoles(): Observable<HttpArrayResponse<UserRole>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };
    return this.http.get<HttpArrayResponse<UserRole>>(this.#BASE_URL_SECURITY + '/getAll', options);
  }

}
