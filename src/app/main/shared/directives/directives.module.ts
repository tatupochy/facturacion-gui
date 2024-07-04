import { NgModule } from '@angular/core';
import { DateMaskDirective } from './p-calendar-mask';

@NgModule({
  declarations: [
    DateMaskDirective
  ],
  exports: [
    DateMaskDirective
  ]
})
export class DirectivesModule { }