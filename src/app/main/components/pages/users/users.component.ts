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
import { UserState } from 'src/app/main/models/user-state';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

    colsUsers: any[] = [];
    users: User[] = [];
    originalUsers: User[] = [];
    userRoles: UserRole[] = [];

    displayUserDialog: boolean = false;

    userForm: FormGroup = new FormGroup({});
    selectedUser: User = new User();

    selectedFilterRole: any = null;
    filtersRoles: any[] = [];

    isLoadingTable: boolean = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public utils: UtilsService,
        private titleService: Title,
        private userService: UserService,
        private userRoleService: UserRoleService,
    ) {}

    ngOnInit(): void {

        this.titleService.setTitle('SDA - Usuarios');

        this.colsUsers = [
            { field: 'name', header: 'Nombre de Usuario', width: '35%', order: true, center: false },
            { field: 'roleNames', header: 'Rol', width: '20%', order: true, center: false },
            { field: 'email', header: 'Mail', width: '35%', order: true, center: false },
            { field: 'state.name', header: 'Estado', width: '10%', order: true, center: true },
            { field: 'actions', header: '', width: '100px', order: false, center: false },
        ];

        this.loadDataFromApi();

    }

    loadDataFromApi(): void {
        this.getUsers();
        this.getAllUserRoles();
    }

    getUsers(update?: boolean): void {
        this.isLoadingTable = true;
        this.userService.getUsers().subscribe({
            next: (response) => {
                if (update) {
                    this.messageService.add({severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado los datos de los usuarios'});
                }
                this.users = response.responseObject;
                this.originalUsers = [...this.users];
            },
            error: (error: any) => {
                console.error(error);
                this.isLoadingTable = false;
            },
            complete: () => { this.isLoadingTable = false }
        })
    }

    updateUserState(user: User, event: any): void {

        // Determinar el nuevo estado del usuario basado en el valor del evento
        const newStateId = event.checked ? 1 : 2; // Si event es true, establece el estado en activo (id: 1), de lo contrario, en inactivo (id: 2)

        let newUser = new User();

        newUser.id = user.id;
        newUser.name = user.name;
        newUser.password = null;
        newUser.email = user.email;
        newUser.roles = user.roles;
        newUser.roleNames = user.roleNames;
        newUser.state = new UserState(newStateId); // Se establece el nuevo estado del usuario

        // Llamar al servicio para actualizar el estado del usuario en la base de datos
        this.userService.saveUser(newUser).subscribe({
            next: (response) => {
                this.loadDataFromApi();
                this.messageService.add({severity: 'success', summary: 'Usuario Guardado', detail: 'Estado de usuario actualizado correctamente'});
            },
            error: (error) => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del usuario'});
                console.error(error);
            }
        });
    }

    initUserForm() {
        this.userForm = this.fb.group({
            id: [this.selectedUser.id || null],
            name:[this.selectedUser.name || null],
            email: [this.selectedUser.email || null],
            password: [null],
            confirmPassword: [null],
            role: [this.selectedUser.roles[0] || null, [Validators.required]],
            roleNames: [this.selectedUser.roles[0].name || null],
            state: [this.selectedUser.state || null],
            validator: this.passwordMatchValidator // Validador personalizado para verificar que las contraseñas coincidan;
        });
    }

    // Procedure Nature

    showUserDialog(user?: User) {

        this.selectedUser = user || new User();

        this.initUserForm();

        this.displayUserDialog = true;

    }

    closeUserDialog() {

        this.displayUserDialog = false;

        this.selectedUser = new User();

        this.userForm = new FormGroup({});

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
        user.state  = data?.state || null;

        return user;
    }

    saveUser() {
        const user = this.setUserData();
        this.userService.saveUser(user).subscribe({
            next: (response) => {
                this.loadDataFromApi();
                this.closeUserDialog();
                this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente el usuario', life: gc.NOTIFICATION_DURATION});
            },
            error: (error: any) => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar el usuario', life: gc.NOTIFICATION_DURATION});
                console.error(error);
            }
        });
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

    isSupervisorRole(user: User): boolean {
        // Verifica si el rol del usuario es "Supervisor"
        return user && user.roles && user.roles.some(role => role.name === "Supervisor");
    }

    showConfirmsaveUser() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos obligatorios', life: gc.NOTIFICATION_DURATION});
            return;
        }

        this.confirmationService.confirm({
            key: 'saveConfirm',
            message: '¿Está seguro/a que desea guardar el usuario?',
            accept: () => {
                this.saveUser()
            },
        });
    }

    showConfirmCancelEditUser() {
        this.confirmationService.confirm({
            key: 'cancelConfirm',
            message: '¿Está seguro/a que desea cancelar?',
            accept: () => {
                this.closeUserDialog();
            },
        });
    }

    showConfirmDeleteUser(user: any, index: number) {
        this.confirmationService.confirm({
            key: 'deleteConfirm',
            message: '¿Está seguro/a que desea eliminar el usuario?',
            accept: () => {
                this.deleteUser(user, index);
            },
        });
    }

    deleteUser(user: User , index: number): void {
        this.userService.deleteUser(user).subscribe({
            next: (response) => {
                this.users.splice(index, 1);
                this.users = [...this.users];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Datos Eliminados',
                    detail: 'Se ha eliminado correctamente el usuario',
                    life: gc.NOTIFICATION_DURATION,
                });
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se ha podido eliminar el usuario',
                    life: gc.NOTIFICATION_DURATION,
                });
                console.error(error);
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
        this.filtersRoles.push({label: 'Todos', value: 'all'});

        this.userRoles.forEach((userRole: UserRole) => {
            this.filtersRoles.push({
                label: userRole.name,
                value: userRole.name,
            });
        });

        this.selectedFilterRole = this.filtersRoles[0];
    }

    filterUsersByRole() {
        if (this.selectedFilterRole.value !== 'all') {
            this.users = this.originalUsers.filter((user: User) => {
                return user.roleNames.includes(this.selectedFilterRole?.value);
            });
        } else {
            this.users = [...this.originalUsers];
        }

    }

}
