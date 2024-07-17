import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpResponseBase
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpObjectResponse } from '../models/http-object-response';
import { HttpError } from '../models/http.error';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private msgService: MessageService,
    private authService: AuthenticationService,
    private confirmationService: ConfirmationService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body.error && 'code' in event?.body?.error && event?.body?.error?.code != '100' && event?.body?.error?.code != '32') {
          throw event.body.error;
        }
        return event;
      }),
      catchError((error: any) => {
        let errorResponse: HttpError = new HttpError(null, null);
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 500:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'Ha ocurrido un error en el servidor al procesar la solicitud.';
              break;
            case 503:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'El servidor no se encuentra disponible actualmente.';
              break;
            case 404:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'El recurso solicitado no se encontró en el servidor.';
              break;
            case 400:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'La estructura de la solicitud no es válida.';
              break;
            case 401:
              errorResponse.code = error.status.toString();
              if (error?.error?.code === 'token_not_valid') {
                const currentUser = localStorage.getItem('currentUser');
                console.log('currentUser', currentUser);
                const refreshToken = JSON.parse(currentUser).refresh;
                console.log('token', refreshToken);
                this.authService.refresh(refreshToken);
              } else {  
                errorResponse.message = 'No estás autorizado para realizar esta acción.';
              }
              break;
            case 403:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'No tienes permiso para acceder a este recurso.';
              break;
            case 408:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'La solicitud ha tardado demasiado tiempo en responder.';
              break;
            case 0:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'No se pudo establecer la conexión. Por favor, verifique su conexión a internet.';
              break;
            default:
              errorResponse.code = error.status.toString();
              errorResponse.message = 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.';
              break;
          }
          return throwError(() => (errorResponse as HttpError));

        } else if ('code' in error && error.code != '100' && error.code != null && error.code != '32') {
          Object.assign(errorResponse, error);
          return throwError(() => errorResponse as HttpError);
        }

        errorResponse.code = 'error';
        errorResponse.message = 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.';
        return throwError(() => { errorResponse as HttpError });
      })
    );
  }
}
