import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgIconsModule } from '@ng-icons/core';

import { DirectivesModule } from 'src/app/main/shared/directives/directives.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { AppComponent } from 'src/app/app.component';
import { TransfersComponent } from './transfers.component';
import { TransfersRoutingModule } from './transfers-routing.module';

@NgModule({
  declarations: [
    TransfersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    TransfersRoutingModule,

    NgIconsModule,

    DirectivesModule,

    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputSwitchModule,
    DialogModule,
    CalendarModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class TransfersModule { }
