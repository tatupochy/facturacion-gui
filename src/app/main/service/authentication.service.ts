import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';


import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { environment } from 'src/environments/environment';

import { JwtUser } from '../models/jwt-user';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    #BASE_URL_SECURITY : string = environment.apiUrlSifSecurity

    loggedUser: JwtUser = null;

    isAuthenticated: boolean = false;

    // LoginProbar

    constructor( private http: HttpClient ) {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));

        if (storedUser && storedUser.accessToken) {
            this.isAuthenticated = true;
            this.loggedUser = storedUser;
        }
    }

    login(username : string, password : string) : Observable<JwtUser> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const options = { headers };
        const body = {
            username: username,
            password: password
        }
        console.log('body', body);
        return this.http.post<JwtUser>(this.#BASE_URL_SECURITY + '/login/', JSON.stringify(body), options)
            .pipe( map((user: JwtUser) => {

                if (user.access === null || user.access === "") {
                    return null;
                }

                console.log('user', user);

                localStorage.setItem('currentUser', JSON.stringify(user));

                this.loggedUser = user;

                this.isAuthenticated = true;

                return user;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    refresh(refreshToken: string): Observable<string> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const options = { headers };
        const body = { refresh: refreshToken };
        const url = this.#BASE_URL_SECURITY + '/refresh/';
        console.log('body', body);
        console.log('url', url);
    
        return this.http.post<{ access: string }>(url, JSON.stringify(body), options)
            .pipe(
                tap(response => {
                    console.log('HTTP request sent, response:', response);
                }),
                catchError(error => {
                    console.error('HTTP request error', error);
                    return throwError(error);
                }),
                map(response => {
                    console.log('response', response);
                    const access = response.access;
                    console.log('access', access);
                    if (!access) {
                        return null;
                    }
    
                    console.log('refreshToken', access);
    
                    this.loggedUser.access = access;
                    localStorage.setItem('currentUser', JSON.stringify(this.loggedUser));
    
                    return access;
                }),
                retry(1),
                catchError(this.handleError)
            );
    }       

    logout() {

        localStorage.removeItem('currentUser');

        this.loggedUser = null;

        this.isAuthenticated = false;

    }

    handleError(error: any) {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => {
            return errorMessage;
        });
    }

    hasRoles(roles : string[]) : boolean {

        let hasRoles = false;
    
        if (this.isAuthenticated) {

            let userRoles : string[] = this.loggedUser.roles

            roles.some(role => {
                // if (userRoles.includes(role)) {
                    hasRoles = true;
                // }
            });
        }
    
        return hasRoles;
    }

}
