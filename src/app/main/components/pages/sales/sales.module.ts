import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgIconsModule } from '@ng-icons/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';;
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { AppComponent } from 'src/app/app.component';
import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales-routing.module';

@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    SalesRoutingModule,

    NgIconsModule,

    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    DialogModule,
    InputNumberModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class SalesModule { }
