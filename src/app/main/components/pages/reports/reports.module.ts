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
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ReportsRoutingModule,

    NgIconsModule,

    TableModule,
    CalendarModule,
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
export class ReportsModule { }
