import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Descriptor } from 'src/app/main/models/descriptor';
import { DataType } from 'src/app/main/models/data-type';

import { DescriptorService } from 'src/app/main/service/descriptor.service';
import { DataTypeService } from 'src/app/main/service/data-type.service';


@Component({
  selector: 'app-descriptors',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.scss'],
})
export class DescriptorsComponent implements OnInit {

  colsDescriptor: any[] = [];
  descriptors: Descriptor[] = [];
  selectedDescriptor: Descriptor = new Descriptor();
  descriptorForm: FormGroup = new FormGroup({});

  dataTypes: DataType[] = [];

  isLoadingTable: boolean = false;
  displayDescriptorDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private descriptorService: DescriptorService,
    private dataTypeService: DataTypeService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Descriptores');
    
    this.colsDescriptor = [
      { field: 'code', header: 'Código', width: '10%', order: true, center: true },
      { field: 'name', header: 'Nombre', width: '40%', order: true, center: false },
      { field: 'minLen', header: 'Longitud Mínima', width: '15%', order: true, center: true },
      { field: 'maxLen', header: 'Longitud Máxima', width: '15%', order: true, center: true },
      { field: 'dataType.displayLabel', header: 'Tipo de Dato', width: '20%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getDescriptors();

    this.getDataTypes();
    
  }

  // Forms

  initDescriptorForm() {
    this.descriptorForm = this.fb.group({
      id: [this.selectedDescriptor.id],
      code: [this.selectedDescriptor.code, [Validators.required, Validators.maxLength(10)]],
      name: [this.selectedDescriptor.name, [Validators.required, Validators.maxLength(50)]],
      minLen: [this.selectedDescriptor.minLen, [Validators.required]],
      maxLen: [this.selectedDescriptor.maxLen, [Validators.required]],
      dataType: [this.selectedDescriptor.dataType, [Validators.required]],
    });
  }

  // Descriptor

  showDescriptorDialog(descriptor?: Descriptor) {

    this.selectedDescriptor = descriptor || new Descriptor();

    this.initDescriptorForm();

    this.displayDescriptorDialog = true;

  }

  closeDescriptorDialog() {

    this.displayDescriptorDialog = false;

    this.selectedDescriptor = new Descriptor();

  }

  setDescriptorData() {

    const data = this.descriptorForm.value;

    let descriptor = new Descriptor();

    descriptor.id = data.id;
    descriptor.code = data.code;
    descriptor.name = data.name;
    descriptor.minLen = data.minLen;
    descriptor.maxLen = data.maxLen;
    descriptor.dataType = data.dataType;

    return descriptor;

  }

  saveDescriptor() {

    const descriptor = this.setDescriptorData();

    this.descriptorService.saveDescriptor(descriptor).subscribe({
      next: (response) => {
        let responseDescriptor = response.responseObject;

        if (responseDescriptor.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar el descriptor', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.descriptors.findIndex((descriptors) => descriptors.id === responseDescriptor.id);
        if (index !== -1) {
          this.descriptors[index] = responseDescriptor;
        } else {
          this.descriptors.push(responseDescriptor);
        }
        this.descriptors = [...this.descriptors];
        this.closeDescriptorDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente el descriptor', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteDescriptor(descriptor: Descriptor, index: number) {
    this.descriptorService.deleteDescriptor(descriptor).subscribe({
      next: (response) => {
        if (response.responseObject !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el descriptor', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.descriptors.splice(index, 1);
        this.descriptors = [...this.descriptors];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el descriptor', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  showConfirmSaveDescriptor() {

    if (this.descriptorForm.invalid) {
      this.descriptorForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar el descriptor?',
      accept: () => {
        this.saveDescriptor()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteDescriptor(descriptor: Descriptor, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar el descriptor?',
      accept: () => {
        this.deleteDescriptor(descriptor, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditDescriptor() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeDescriptorDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getDescriptors(update?: boolean) {
    this.isLoadingTable = true;

      this.descriptorService.getAllDescriptors().subscribe({
        next: (response) => {
          if (update) {
            this.messageService.add({severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado los datos de las entidades', sticky: true});
          }
          this.descriptors = response.responseObject;
        },
        error: (error: HttpError) => {
          console.error(error);
          if (error instanceof HttpError) {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
          }
          this.isLoadingTable = false
        },
        complete: () => {
          this.isLoadingTable = false
        }
     });

  }

  getDataTypes() {
    this.dataTypeService.getAllDataTypes().subscribe({
      next: (response) => {
        this.dataTypes = response.responseObject;
      },
      error: (error: HttpError) => {
        console.error(error);
      }
    });
  }

}
