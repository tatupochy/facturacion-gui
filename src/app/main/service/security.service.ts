import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalConstans as gc } from 'src/app/common/global-constans';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) { }
  // LoginProbar - servicio para verificar si se tiene los permisos necesarios para ingresar a alguna ruta
  canActivate(neededRoles: string[]): boolean {
    // if (this.authenticationService.isAuthenticated) {
    //   if (this.authenticationService.hasRoles(neededRoles)) {
        return true;
    //   } else {
    //     this.handleUnauthorizedRole();
    //     return false;
    //   }
    // } else {
    //   this.handleUnauthorizedAccess();
    //   return false;
    // }
  }

  private handleUnauthorizedAccess() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debes iniciar sesión para acceder a esta página.', life: gc.NOTIFICATION_DURATION});
    this.router.parseUrl('auth/login');
  }

  private handleUnauthorizedRole() {
    this.messageService.add({ severity: 'error', summary: 'Acceso denegado', detail: 'No tienes los permisos necesarios para acceder a esta página.', life: gc.NOTIFICATION_DURATION});
  }
}
