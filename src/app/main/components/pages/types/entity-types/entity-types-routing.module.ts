import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityTypesComponent } from './entity-types.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EntityTypesComponent }
    ])],
    declarations: [],
})

export class EntityTypesRoutingModule { }
