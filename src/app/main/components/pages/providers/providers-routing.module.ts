import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProvidersComponent } from './providers.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProvidersComponent }
    ])],
    declarations: [],
})

export class ProvidersRoutingModule { }
