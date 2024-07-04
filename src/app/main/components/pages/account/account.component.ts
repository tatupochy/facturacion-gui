import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MessageService, ConfirmationService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { UserService } from 'src/app/main/service/user.service';
import { User } from 'src/app/main/models/user';
import { UserRoleService } from 'src/app/main/service/user-role.service';
import { UserRole } from 'src/app/main/models/user-role';
import { AuthenticationService } from 'src/app/main/service/authentication.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    colsUsers: any[] = [];
    users: User[] = [];
    originalUsers: User[] = [];
    userRoles: UserRole[] = [];

    username: string = '';

    displayAccountDialog: boolean = false;

    userForm: FormGroup = new FormGroup({});
    selectedUser:  User = new User();


    selectedFilterRole: any = null;
    filtersRoles: any[] = [];

    isLoadingTable: boolean = false;
    displayTagDialog: boolean = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public utils: UtilsService,
        private titleService: Title,
        private userService: UserService,
        private userRoleService: UserRoleService,
        private authenticationService: AuthenticationService,
    ) {
    }

    ngOnInit(): void {

        this.titleService.setTitle('SDA - Cuenta');

        this.username = this.authenticationService.loggedUser?.name || 'Usuario'

        this.colsUsers = [
            {field: 'name', header: 'Nombre', width: '40%', order: false, center: false},
            {field: 'roleNames', header: 'Rol', width: '15%', order: false, center: false},
            {field: 'email', header: 'Mail', width: '35%', order: true, center: false},
            {field: 'state.name', header: 'Estado', width: '10%', order: false, center: true},
            {field: '', header: '', width: '100px', order: false, center: false},
        ];


        this.loadDataFromApi();

    }

    loadDataFromApi(): void {
        this.isLoadingTable = true;
        this.getAllUserRoles();
        this.getByUsername()
    }



    initUserForm() {
        this.getByUsername()

            this.userForm = this.fb.group({
                    id: [this.selectedUser.id || null],
                    name: [this.selectedUser.name || null],
                    email: [this.selectedUser.email || null],
                    /*password: [this.selectedUser.password || null, [Validators.required]],*/
                    password: ['' || null, [Validators.required]],
                    confirmPassword: ['' || null, [Validators.required]], // Nuevo campo para repetir contraseña

                    role: [this.selectedUser.roles[0] || null],
                    roleNames: [this.selectedUser.roles[0].name || null],
                    state: [this.selectedUser.state || null],
                },
                {
                    validator: this.passwordMatchValidator // Validador personalizado para verificar que las contraseñas coincidan
                });

    }

    // Account

    showUserDialog(user?: User) {

        this.selectedUser = user || new User();

        this.initUserForm();

        this.displayAccountDialog = true;

    }

    closeUserDialog() {

        this.displayAccountDialog = false;

        this.selectedUser = new User();

        this.userForm = new FormGroup({});

        this.getByUsername()

    }

    setUserData() {
        const data = this.userForm.value;

        let user = new User();


        user.id = this.selectedUser?.id || null;
        user.name = data?.name || null;
        user.password = data?.password || null;
        user.email = data?.email || null;
        user.roles = [data?.role] || null;
        user.roleNames = data?.role?.name || null;
        user.state = data?.state || null;


        return user;
    }

    saveUser() {

        const user = this.setUserData();

        console.log('user', user)

        this.userService.saveUser(user).subscribe(
            (response) => {
                let responseUser = response;
                this.selectedUser = response.responseObject;
                console.log('this.selectedUser',this.selectedUser)
                this.closeUserDialog();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Datos Guardados',
                    detail: 'Se ha guardado correctamente el usuario',
                    life: gc.NOTIFICATION_DURATION
                });
                this.loadDataFromApi();
            },
            (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se ha podido guardar el usuario',
                    life: gc.NOTIFICATION_DURATION
                });
                console.error(error);
            }
        );
    }

    // Validador personalizado para verificar que las contraseñas coincidan
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({'passwordMismatch': true});

        } else {
            confirmPassword.setErrors(null);
        }
    }


    showConfirmsaveUser() {

        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe completar todos los campos obligatorios',
                life: gc.NOTIFICATION_DURATION
            });
            return;
        }

        this.confirmationService.confirm({
            key: 'saveConfirm',
            message: '¿Está seguro/a que desea guardar el usuario?',
            accept: () => {
                this.saveUser()
            },
            reject: () => {
            }
        });
    }

    showConfirmCancelEditUser() {
        this.confirmationService.confirm({
            key: 'cancelConfirm',
            message: '¿Está seguro/a que desea cancelar?',
            accept: () => {
                this.closeUserDialog();
            },
            reject: () => {
            }
        });
    }

    getAllUserRoles(): void {
        this.userRoleService.getAllUserRoles().subscribe({
            next: (response) => {
                this.userRoles = response.responseObject;
                this.createRoleOptionsFilter();
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    createRoleOptionsFilter() {
        this.filtersRoles.push({label: 'Todos', value: ''});

        this.userRoles.forEach((userRole: UserRole) => {
            this.filtersRoles.push({
                label: userRole.name,
                value: userRole.name,
            });
        });

        this.selectedFilterRole = this.filtersRoles[0];
    }

    filterUsersByRole() {
        if (this.selectedFilterRole.value !== '') {
            this.users = this.originalUsers.filter((user: User) => {
                return user.roleNames.includes(this.selectedFilterRole?.value);
            });
        } else {
            this.users = [...this.originalUsers];
        }

    }

    getByUsername() {
        this.userService.getByUsername(this.username).subscribe(
            (response) => {
                console.log('response', response)
                this.selectedUser = response.responseObject;
                console.log('this.users', this.selectedUser)
                // Inicializa el formulario de usuario con los datos del usuario logueado

            });
    }
}
