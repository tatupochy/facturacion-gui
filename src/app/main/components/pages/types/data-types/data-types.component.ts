import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';

import { DataType } from 'src/app/main/models/data-type';
import { DataTypeService } from 'src/app/main/service/data-type.service';

@Component({
  selector: 'app-data-types',
  templateUrl: './data-types.component.html',
  styleUrls: ['./data-types.component.scss'],
})
export class DataTypesComponent implements OnInit {

  colsDataType: any[] = [];
  dataTypes: DataType[] = [];
  selectedDataType: DataType = new DataType();
  dataTypeForm: FormGroup = new FormGroup({});

  isLoadingTable: boolean = false;
  displayDataTypeDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private dataTypeService: DataTypeService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Tipos de Datos');
    
    this.colsDataType = [
      { field: 'code', header: 'Código', width: '10%', order: true, center: true },
      { field: 'name', header: 'Nombre', width: '90%', order: true, center: false },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getDataTypes();
    
  }

  // Forms

  initDataTypeForm() {
    this.dataTypeForm = this.fb.group({
      id: [this.selectedDataType.id],
      name: [this.selectedDataType.name, [Validators.required, Validators.maxLength(50)]],
      code: [this.selectedDataType.code, [Validators.required, Validators.maxLength(10)]],
      displayLabel: [this.selectedDataType.displayLabel, [Validators.required, Validators.maxLength(50)]],
    });
  }

  // DataType

  showDataTypeDialog(dataType?: DataType) {

    this.selectedDataType = dataType || new DataType();

    this.initDataTypeForm();

    this.displayDataTypeDialog = true;

  }

  closeDataTypeDialog() {

    this.displayDataTypeDialog = false;

    this.selectedDataType = new DataType();

  }

  setDataTypeData() {

    const data = this.dataTypeForm.value;

    let dataType = new DataType();

    dataType.id = data.id;
    dataType.name = data.name;
    dataType.code = data.code;
    dataType.displayLabel = data.displayLabel

    return dataType;

  }

  saveDataType() {

    const dataType = this.setDataTypeData();

    this.dataTypeService.saveDataType(dataType).subscribe({
      next: (response) => {
        let responseDataType = response.responseObject;

        if (responseDataType.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar el tipo de dato', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.dataTypes.findIndex((dataTypes) => dataTypes.id === responseDataType.id);
        if (index !== -1) {
          this.dataTypes[index] = responseDataType;
        } else {
          this.dataTypes.push(responseDataType);
        }
        this.dataTypes = [...this.dataTypes];
        this.closeDataTypeDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente el tipo de dato', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteDataType(dataType: DataType, index: number) {
    this.dataTypeService.deleteDataType(dataType).subscribe({
      next: (response) => {
        if (response.responseObject !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el tipo de dato', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.dataTypes.splice(index, 1);
        this.dataTypes = [...this.dataTypes];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el tipo de dato', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  showConfirmSaveDataType() {

    if (this.dataTypeForm.invalid) {
      this.dataTypeForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar el tipo de dato?',
      accept: () => {
        this.saveDataType()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteDataType(dataType: DataType, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar el tipo de dato?',
      accept: () => {
        this.deleteDataType(dataType, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditDataType() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeDataTypeDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getDataTypes(update?: boolean) {

    this.isLoadingTable = true;

    this.dataTypeService.getAllDataTypes().subscribe({
      next: (response) => {
        if (update) {
          this.messageService.add({ severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado correctamente los tipos de datos', life: gc.NOTIFICATION_DURATION });
        }
        
        this.dataTypes = response.responseObject;
      },
      error: (error: HttpError) => {
        console.error(error);
        this.isLoadingTable = false;
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      },
      complete: () => { this.isLoadingTable = false }
    });
  }

}
