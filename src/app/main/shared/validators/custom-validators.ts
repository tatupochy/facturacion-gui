import { AbstractControl, ValidationErrors } from '@angular/forms';

export function isArrayEmpty(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (Array.isArray(value) && value.length === 0) {
    return { arrayEmpty: true };
  }
  return null;
}