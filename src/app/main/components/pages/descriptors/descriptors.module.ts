import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgIconsModule } from '@ng-icons/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';

import { AppComponent } from 'src/app/app.component';
import { DescriptorsComponent } from './descriptors.component';
import { DescriptorsRoutingModule } from './descriptors-routing.module';

@NgModule({
  declarations: [
    DescriptorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    DescriptorsRoutingModule,

    NgIconsModule,

    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputSwitchModule,
    DialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class DescriptorsModule { }
