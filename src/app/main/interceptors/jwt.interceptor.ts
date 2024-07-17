import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { JwtUser } from '../models/jwt-user';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // LoginProbar
        let authReq = request;

        let url = authReq.url;
        if(!url.includes('login') && !url.includes('logout')) {

            let currentUserObj = localStorage.getItem('currentUser');
            if(currentUserObj !== undefined && currentUserObj !== null) {

                let currentUser = currentUserObj as string;

                const expiredToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3OCIsImlhdCI6MTcxNDQ3OTgyNiwiZXhwIjoxNzE0NTE1ODI2fQ.BOdAPdgDriY-_T10RWWGl1JtdyuhRjBsc2uZ7jJ13hg'
                
                let user: JwtUser = JSON.parse(currentUser);
                let token : string = user.access;
                let refreshToken : string = user.refresh;

                if (token != null) {
                    authReq = request.clone({  });
                }

            }

        }

        return next.handle(authReq);
    }


}

