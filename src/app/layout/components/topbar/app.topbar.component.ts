import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/service/authentication.service';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../../service/app.layout.service";
import { Button } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    username: string = '';

    @ViewChild('menubutton') menuButton!: Button;

    @ViewChild('topbarmenubutton') topbarMenuButton!: Button;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, public router: Router, public authenticationService: AuthenticationService) { }

    // LoginProbar
    ngOnInit(): void {

        this.username = this.authenticationService?.loggedUser?.name || 'Perfil'
        
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['auth/login'])
        .then(() => {
            window.location.reload();
        });
    }

}
