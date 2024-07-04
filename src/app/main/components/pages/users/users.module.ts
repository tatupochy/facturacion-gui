import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

import { NgIconsModule } from '@ng-icons/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from "primeng/password";

import { AppComponent } from 'src/app/app.component';
import { UsersComponent } from "./users.component";
import { UsersRoutingModule } from './users-routing.module';
import { InputSwitchModule } from "primeng/inputswitch";

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        ReactiveFormsModule,
        FormsModule,

        TableModule,
        NgIconsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        DialogModule,
        RouterLink,
        InputSwitchModule,
        PasswordModule,

    ],
    declarations: [
        UsersComponent
    ],
    providers: [],
    bootstrap: [AppComponent]

})
export class UsersModule { }
