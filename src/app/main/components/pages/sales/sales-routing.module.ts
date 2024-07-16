import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SalesComponent }
    ])],
    declarations: [],
})

export class SalesRoutingModule { }
