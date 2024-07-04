import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { MessageService } from 'primeng/api';

import { AuthenticationService } from 'src/app/main/service/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup | null = null;
    
    _loading: boolean = false;

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
        if (value) {
            this.loginForm?.disable();
        } else {
            this.loginForm?.enable();
        }
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private titleService: Title,
        private messageService: MessageService,
        public utils: UtilsService
    ) {
        // LoginProbar
        if (this.authenticationService.isAuthenticated) {
            this.router.navigate(['/home']);
        } else {
            this.authenticationService.logout();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('SDA - Iniciar Sesión');

        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberme: [false]
        });
    }

    setLoginData() {
        const data = this.loginForm?.value;

        let user = {
            username: data.username,
            password: data.password
        }

        return user;
    }

    login() {
        
        if (this.loginForm?.invalid) {
            this.loginForm?.markAllAsTouched();
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
            return;
        }

        this.loading = true

        const user = this.setLoginData();
        // LoginProbar
        this.authenticationService.login(user?.username, user?.password).subscribe({
            next: (response) => {
                if (!response) {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Nombre de usuario o contraseña invalidos', life: gc.NOTIFICATION_DURATION });
                    return;
                }

                this.router.navigate(['/home']);
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });

    }

}
