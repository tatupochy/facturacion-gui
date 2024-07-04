import { Directive, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: 'p-calendar[DateMask]'
})
export class DateMaskDirective implements AfterViewInit {
  @Input() dateFormat: string;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const inputElement = this.el.nativeElement.querySelector('input');
    if (inputElement) {
      if (this.dateFormat.includes('/yy')) {
        inputElement.setAttribute('maxlength', (this.dateFormat.length + 2).toString());
      } else {
        inputElement.setAttribute('maxlength', this.dateFormat.length.toString());
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }

    const inputElement = this.el.nativeElement.querySelector('input');
    inputElement.value = value;
  }
}