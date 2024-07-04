import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Entity } from 'src/app/main/models/entity';

import { EntityService } from 'src/app/main/service/entity.service';
import { EntityType } from 'src/app/main/models/entity-type';
import { State } from 'src/app/main/models/state';
import { EntityTypeService } from 'src/app/main/service/entity-type.service';
import { InputSwitch } from 'primeng/inputswitch';
import { StateService } from 'src/app/main/service/state.service';


@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
})
export class EntitiesComponent implements OnInit {

  colsEntity: any[] = [];
  entities: Entity[] = [];
  selectedEntity: Entity = new Entity();
  entityForm: FormGroup = new FormGroup({});

  entityTypes: EntityType[] = [];

  states: State[] = []

  isLoadingTable: boolean = false;
  displayEntityDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private entityService: EntityService,
    private entityTypeService: EntityTypeService,
    private stateService: StateService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Entidades');
    
    this.colsEntity = [
      { field: 'code', header: 'Código', width: '10%', order: true, center: true },
      { field: 'name', header: 'Nombre', width: '40%', order: true, center: false },
      { field: 'type.name', header: 'Tipo', width: '20%', order: true, center: true },
      { field: 'ruc', header: 'RUC', width: '20%', order: true, center: true },
      { field: 'state.name', header: 'Estado', width: '10%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getEntities();

    this.getEntityTypes();

    this.getStates();
    
  }

  // Forms

  initEntityForm() {
    this.entityForm = this.fb.group({
      id: [this.selectedEntity.id],
      name: [this.selectedEntity.name, [Validators.required, Validators.maxLength(255)]],
      fantasyName: [this.selectedEntity.fantasyName, [Validators.required, Validators.maxLength(255)]],
      ruc: [this.selectedEntity.ruc, [Validators.required, Validators.maxLength(10)]],
      code: [this.selectedEntity.code, [Validators.required, Validators.maxLength(10)]],
      state: [this.selectedEntity.state],
      entityType: [this.selectedEntity.type, [Validators.required]],
      documentsRootPath: [this.selectedEntity.documentsRootPath],
    });
  }

  // Entity

  showEntityDialog(entity?: Entity) {

    this.selectedEntity = entity || new Entity();

    this.initEntityForm();

    this.displayEntityDialog = true;

  }

  closeEntityDialog() {

    this.displayEntityDialog = false;

    this.selectedEntity = new Entity();

  }

  setEntityData() {

    const data = this.entityForm.value;

    let entity = new Entity();

    entity.id = data.id;
    entity.name = data.name;
    entity.fantasyName = data.fantasyName;
    entity.ruc = data.ruc;
    entity.code = data.code;
    entity.state = new State(1,"ACT","Activo");
    entity.type = data.entityType;
    entity.documentsRootPath = data.documentsRootPath;

    return entity;

  }

  saveEntity() {

    const entity = this.setEntityData();

    this.entityService.saveEntity(entity).subscribe({
      next: (response) => {
        let responseEntity = response.responseObject;

        if (responseEntity.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar la entidad', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.entities.findIndex((entities) => entities.id === responseEntity.id);
        if (index !== -1) {
          this.entities[index] = responseEntity;
        } else {
          this.entities.push(responseEntity);
        }
        this.entities = [...this.entities];
        this.closeEntityDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente la entidad', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteEntity(entity: Entity, index: number) {
    this.entityService.deleteEntity(entity).subscribe({
      next: (response) => {
        if (response.responseObject !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar la entidad', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.entities.splice(index, 1);
        this.entities = [...this.entities];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente la entidad', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  updateEntityState(entity: Entity, element: InputSwitch) {

    let updatedEntity = new Entity();

    Object.assign(updatedEntity, entity);

    updatedEntity.state = element.modelValue ? this.states.find((state) => state.code === 'ACT') : this.states.find((state) => state.code === 'INA');

    this.entityService.saveEntity(updatedEntity).subscribe({
      next: (response) => {
        let responseEntity = response.responseObject;

        if (responseEntity.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado de la entidad', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(entity, responseEntity);
        
        this.messageService.add({severity: 'success', summary: 'Estado Actualizado', detail: 'Se ha actualizado correctamente el estado de la entidad', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
        element.writeValue(!element.modelValue);
      }
    });

  }

  showConfirmSaveEntity() {

    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveEntity()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteEntity(entities: Entity, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteEntity(entities, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditEntity() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeEntityDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getEntities(update?: boolean) {
    this.isLoadingTable = true;

      this.entityService.getAllEntitities().subscribe({
        next: (response) => {
          if (update) {
            this.messageService.add({severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado los datos de las entidades', life: gc.NOTIFICATION_DURATION});
          }
          this.entities = response.responseObject;
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

  getEntityTypes() {
    this.entityTypeService.getAllEntityTypes().subscribe({
      next: (response) => {
        this.entityTypes = response.responseObject;
      },
      error: (error: HttpError) => {
        console.error(error);
      }
    });
  }

  getStates() {
    this.stateService.getAllStates().subscribe({
      next: (response) => {
        this.states = response.responseObject;
      },
      error: (error: HttpError) => {
        console.error(error);
      }
    });

  }

}
