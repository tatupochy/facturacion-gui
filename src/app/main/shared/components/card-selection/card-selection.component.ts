import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
@Component({
  selector: 'app-card-selection',
  standalone: true,
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.scss'],
  imports: [
    CommonModule,
    NgIconsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardSelectionComponent),
      multi: true
  }
  ]
})
export class CardSelectionComponent implements ControlValueAccessor {

  @Input() options: any[] = [];
  @Input() width: string = "'10rem'";
  @Input() height: string = "'10rem'";

  value: any = null;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {}

  selectOption(value: any) {
    if (this.value.id !== value.id) {
      this.value = value;
      this.onChange(value);
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}