import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import localePy from '@angular/common/locales/es-PY';
registerLocaleData(localePy, 'PY');

import { GlobalConstans } from 'src/app/common/global-constans';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {}

  getValidationErrorMessage(form: FormGroup, controlName: string): string | null {
    const currencyPipe = new CurrencyPipe('PY');
    const control = form.get(controlName);
    let label = GlobalConstans.VALIDATORS_LABEL[controlName];
  
    if (!label && controlName.includes('.')) {
      const childControlName = controlName.split('.').pop();
      label = GlobalConstans.VALIDATORS_LABEL[childControlName];
    }

    if(!label) {
      label = 'completar este campo';
    }
  
    if (control?.errors) {
      const errorNames = Object.keys(control.errors);
      for (let errorName of errorNames) {
        if (errorName === 'required') {
          return `Se requiere ${label}`;
        }
        const error = control.getError(errorName);
        const errorMessages = {
          'minlength': `Se requiere mínimo ${error.requiredLength} caracteres`,
          'email': `Dirección de correo electrónico inválida`,
          'min': `Valor introducido inválido`,
          'max': `Valor máximo permitido ${currencyPipe.transform(error.max || 0, 'PYG', 'symbol', '1.0-0')}`,
          'ccNumber': `Número de tarjeta de crédito inválido`,
        };
        const getErrorMessage = errorMessages[errorName];
        if (getErrorMessage) {
          return getErrorMessage;
        }
      }
    }
  
    return null;
  }

  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onGlobalFilter(table: Table, event: any) {
    if (event instanceof InputEvent || event instanceof Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    } else {
      table.filterGlobal(event, 'contains');
    }
  }

  getNestedValue(obj: any, col: any): any {
    if (col.field.includes('.')) {
      const fields = col.field.split('.');
      let value = obj;
      for (const f of fields) {
        if (!value || value === null) return 'No Establecido';
        value = value[f];
      }

      return value;

    } else {
      return obj[col.field] || 'No Establecido';
    }
  }

  isFormEmpty(form: FormGroup): boolean {
    for (let controlName in form.controls) {
      let controlValue = form.get(controlName).value;
      if (controlValue !== null && controlValue !== '') {
        return false;
      }
    }
    return true;
  }

  rowTrackByFunction(index: number, item: any) {
    return item.id;
  }

  base64ToFile(base64Data: string, fileName: string, fileType: string): File {
    let binaryString;
    
    if (base64Data == null || base64Data == '') {
      return null;
    }

    if (base64Data.includes(',')) {
      const base64Array = base64Data.split(',');
      binaryString = atob(base64Array[1]);
    } else {
      binaryString = atob(base64Data);
    }
    
    let length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    
    while(length--){
      uint8Array[length] = binaryString.charCodeAt(length);
    }
    
    return new File([uint8Array], fileName, {type: fileType});
  }

  downloadBlobFile(file: Blob | File, contentType: string, filename: string) {
    const blob = new Blob([file], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
