import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CustomersComponent }
    ])],
    declarations: [],
})

export class CustomersRoutingModule { }
