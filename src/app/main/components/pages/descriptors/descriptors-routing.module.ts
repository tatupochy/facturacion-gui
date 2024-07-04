import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DescriptorsComponent } from './descriptors.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DescriptorsComponent }
    ])],
    declarations: [],
})

export class DescriptorsRoutingModule { }
