import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProductsComponent }
    ])],
    declarations: [],
})

export class ProductsRoutingModule { }
