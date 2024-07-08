import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoicesComponent } from './invoices.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InvoicesComponent }
    ])],
    declarations: [],
})

export class IvoicesRoutingModule { }
