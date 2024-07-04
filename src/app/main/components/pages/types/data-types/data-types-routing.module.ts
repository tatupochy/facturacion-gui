import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTypesComponent } from './data-types.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DataTypesComponent }
    ])],
    declarations: [],
})

export class DataTypesRoutingModule { }
