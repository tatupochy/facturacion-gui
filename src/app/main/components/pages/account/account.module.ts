import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AppComponent } from 'src/app/app.component';
import {AccountComponent} from "./account.component";
import { AccountRoutingModule } from './account-routing.module';
import {RouterLink} from "@angular/router";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";





@NgModule({
    imports: [
        CommonModule,
        AccountRoutingModule,
        ReactiveFormsModule,
        FormsModule,

        TableModule,
        ToolbarModule,
        FileUploadModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ConfirmDialogModule,
        RouterLink,
        InputSwitchModule,
        PasswordModule,

    ],
    declarations: [
        AccountComponent
    ],
    providers: [],
    bootstrap: [AppComponent]

})
export class AccountModule { }
