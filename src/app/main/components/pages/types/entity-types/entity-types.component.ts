import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';

import { EntityType } from 'src/app/main/models/entity-type';
import { EntityTypeService } from 'src/app/main/service/entity-type.service';

@Component({
  selector: 'app-entity-types',
  templateUrl: './entity-types.component.html',
  styleUrls: ['./entity-types.component.scss'],
})
export class EntityTypesComponent implements OnInit {

  colsEntityType: any[] = [];
  entityTypes: EntityType[] = [];
  selectedEntityType: EntityType = new EntityType();
  entityTypeForm: FormGroup = new FormGroup({});

  isLoadingTable: boolean = false;
  displayEntityTypeDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private entityTypeService: EntityTypeService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Tipos de Entidades');
    
    this.colsEntityType = [
      { field: 'code', header: 'Código', width: '10%', order: true, center: true },
      { field: 'name', header: 'Nombre', width: '90%', order: true, center: false },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getEntityTypes();

    this.getEntityTypes();
    
  }

  // Forms

  initEntityTypeForm() {
    this.entityTypeForm = this.fb.group({
      id: [this.selectedEntityType.id],
      name: [this.selectedEntityType.name, [Validators.required, Validators.maxLength(255)]],
      code: [this.selectedEntityType.code, [Validators.required, Validators.maxLength(5)]],
    });
  }

  // EntityType

  showEntityTypeDialog(entityType?: EntityType) {

    this.selectedEntityType = entityType || new EntityType();

    this.initEntityTypeForm();

    this.displayEntityTypeDialog = true;

  }

  closeEntityTypeDialog() {

    this.displayEntityTypeDialog = false;

    this.selectedEntityType = new EntityType();

  }

  setEntityTypeData() {

    const data = this.entityTypeForm.value;

    let entityType = new EntityType();

    entityType.id = data.id;
    entityType.name = data.name;
    entityType.code = data.code;

    return entityType;

  }

  saveEntityType() {

    const entityType = this.setEntityTypeData();

    this.entityTypeService.saveEntityType(entityType).subscribe({
      next: (response) => {
        let responseEntityType = response.responseObject;

        if (responseEntityType.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar el tipo de entidad', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.entityTypes.findIndex((entityTypes) => entityTypes.id === responseEntityType.id);
        if (index !== -1) {
          this.entityTypes[index] = responseEntityType;
        } else {
          this.entityTypes.push(responseEntityType);
        }
        this.entityTypes = [...this.entityTypes];
        this.closeEntityTypeDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente el tipo de entidad', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteEntityType(entityType: EntityType, index: number) {
    this.entityTypeService.deleteEntityType(entityType).subscribe({
      next: (response) => {
        if (response.responseObject !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el tipo de entidad', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.entityTypes.splice(index, 1);
        this.entityTypes = [...this.entityTypes];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el tipo de entidad', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  showConfirmSaveEntityType() {

    if (this.entityTypeForm.invalid) {
      this.entityTypeForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveEntityType()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteEntityType(entityType: EntityType, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteEntityType(entityType, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditEntityType() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeEntityTypeDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getEntityTypes(update?: boolean) {

    this.isLoadingTable = true;

    this.entityTypeService.getAllEntityTypes().subscribe({
      next: (response) => {
        if (update) {
          this.messageService.add({ severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado correctamente los tipos de entidades', life: gc.NOTIFICATION_DURATION });
        }
        
        this.entityTypes = response.responseObject;
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
