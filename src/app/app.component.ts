import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { PrimeNGConfig } from 'primeng/api';

import { GlobalConstans as gc } from './common/global-constans';

import { ScrollService } from './main/service/scroll.service';
import { AuthenticationService } from './main/service/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig, 
        private scrollService: ScrollService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {}

    ngOnInit() {

        this.primengConfig.ripple = true;

        this.primengConfig.setTranslation(gc.PRIMENG_SPANISH);

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)).subscribe(() => {
                this.scrollService.triggerScrollToTop();
            }
        );
        

        // LoginProbar
        const logged = sessionStorage.getItem('logged');

        if (!logged) {
            
            if (this.authenticationService.hasRoles(['Administrador', 'Escribano', 'Supervisor'])) {
                this.router.navigate(['/home']);
                sessionStorage.setItem('logged', 'true');
            } else {
                this.authenticationService.logout();
                this.router.navigate(['/auth/login']);
            }

        }

    }
}
