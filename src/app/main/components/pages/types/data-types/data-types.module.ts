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
import { DialogModule } from 'primeng/dialog';

import { AppComponent } from 'src/app/app.component';
import { DataTypesComponent } from './data-types.component';
import { DataTypesRoutingModule } from './data-types-routing.module';

@NgModule({
  declarations: [
    DataTypesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    DataTypesRoutingModule,

    NgIconsModule,

    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class DataTypesModule { }
