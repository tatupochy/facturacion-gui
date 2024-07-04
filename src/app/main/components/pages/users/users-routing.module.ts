import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsersComponent }
    ])],
    declarations: [],
})
export class UsersRoutingModule { }
