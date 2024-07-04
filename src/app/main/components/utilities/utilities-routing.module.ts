import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'view-pdf', component: PdfViewerComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UtilitiesRoutingModule { }
