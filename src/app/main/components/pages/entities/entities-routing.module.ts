import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntitiesComponent } from './entities.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EntitiesComponent }
    ])],
    declarations: [],
})

export class EntitiesRoutingModule { }
