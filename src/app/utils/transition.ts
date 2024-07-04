import { trigger, style, animate, transition } from '@angular/animations';

export const StepAnimation = trigger('step', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('1000ms ease-in', 
      style({ opacity: 1, transform: 'translateX(0%)' })
    ),
  ]),
  transition(':leave', [
    animate('1000ms ease-in', 
      style({ opacity: 0, transform: 'translateX(-100%)' })
    ),
  ]),
  transition('next => *', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('1000ms ease-in',
      style({
        opacity: 1,
        transform: 'translateX(0%)',
        animation: 'fadeinright 1000ms ease-in',
      })
    ),
  ]),
  transition('previous => *', [
    style({ opacity: 0, transform: 'translateX(-100%)' }),
    animate('1000ms ease-in',
      style({
        opacity: 1,
        transform: 'translateX(0%)',
        animation: 'fadeinleft 1000ms ease-in',
      })
    ),
  ]),
]);
