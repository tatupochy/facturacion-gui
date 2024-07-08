import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Provider } from 'src/app/main/models/provider';

import { ProviderService } from 'src/app/main/service/provider.service';
import { State } from 'src/app/main/models/state';
import { InputSwitch } from 'primeng/inputswitch';


@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit {

  colsProvider: any[] = [];
  providers: Provider[] = [];
  selectedProvider: Provider = new Provider();
  providerForm: FormGroup = new FormGroup({});


  states: State[] = []

  isLoadingTable: boolean = false;
  displayProviderDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private providerService: ProviderService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Proveedores');
    
    this.colsProvider = [
     
      { field: 'nombre', header: 'Nombre', width: '20%', order: true, center: false },
      { field: 'direccion', header: 'Direccion', width: '20%', order: true, center: false },
      { field: 'telefono', header: 'Telefono', width: '15%', order: true, center: false },
      { field: 'email', header: 'Email', width: '20%', order: true, center: false },
      { field: 'ruc', header: 'Ruc', width: '10%', order: true, center: false },
      { field: 'pais', header: 'Pais', width: '10%', order: true, center: false },
      { field: 'activo', header: 'Activo', width: '10%', order: true, center: false },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getProviders();

   
    
  }

  // Forms

  initProviderForm() {
    this.providerForm = this.fb.group({
      id: [this.selectedProvider.id],
      nombre: [this.selectedProvider.nombre, [Validators.required, Validators.maxLength(255)]],
      direccion: [this.selectedProvider.direccion, [Validators.required, Validators.maxLength(255)]],
      telefono: [this.selectedProvider.telefono, [Validators.required, Validators.maxLength(255)]],
      email: [this.selectedProvider.email, [Validators.required, Validators.maxLength(255)]],
      ruc: [this.selectedProvider.ruc, [Validators.required, Validators.maxLength(255)]],
      pais: [this.selectedProvider.pais, [Validators.required, Validators.maxLength(255)]],
      activo: [this.selectedProvider.activo]
    });
  }

  // Provider

  showProviderDialog(provider?: Provider) {

    this.selectedProvider = provider || new Provider();

    this.initProviderForm();

    this.displayProviderDialog = true;

  }

  closeProviderDialog() {

    this.displayProviderDialog = false;

    this.selectedProvider = new Provider();

  }

  setProviderData() {

    const data = this.providerForm.value;

    let provider = new Provider();

    provider.id = data.id;
    provider.nombre = data.nombre;
    provider.direccion = data.direccion;
    provider.telefono = data.telefono;
    provider.email = data.email;
    provider.ruc = data.ruc;
    provider.pais = data.pais;
    provider.activo = data.activo

    return provider;

  }

  saveProvider() {
    const provider = this.setProviderData();
    console.log('Proveedor', provider)

    this.providerService.saveProvider(provider).subscribe({
      next: (response) => {
        if (!response || !response.id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido guardar el proveedor',
            life: gc.NOTIFICATION_DURATION
          });
          return;
        }
  
        // Encuentra el índice del proveedor en la lista
        const index = this.providers.findIndex(p => p.id === response.id);
  
        if (index !== -1) {
          // Si el proveedor existe, actualizarlo en la lista
          this.providers[index] = response;
        } else {
          // Si el proveedor no existe, añadirlo a la lista
          this.providers.push(response);
        }
  
        // Crear una nueva referencia de la lista para que Angular detecte el cambio
        this.providers = [...this.providers];
  
        // Cerrar el diálogo del proveedor
        this.closeProviderDialog();
  
        // Mostrar un mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Datos Guardados',
          detail: 'Se ha guardado correctamente el proveedor',
          life: gc.NOTIFICATION_DURATION
        });
      },
      error: (error: any) => {
        console.error('Error al guardar el proveedor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el proveedor',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  deleteProvider(provider: Provider, index: number) {
    this.providerService.deleteProvider(provider).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el proveedor', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.providers.splice(index, 1);
        this.providers = [...this.providers];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el proveedor', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  updateProviderState(provider: Provider, element: InputSwitch) {
    console.log('Element:', element)
    provider.activo = element.modelValue;
    this.providerService.saveProvider(provider).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado del proveedor', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(provider, response);
        
        this.messageService.add({severity: 'success', summary: 'Estado Actualizado', detail: 'Se ha actualizado correctamente el estado del proveedor', life: gc.NOTIFICATION_DURATION});
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

  showConfirmSaveProvider() {

    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveProvider()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteProvider(providers: Provider, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteProvider(providers, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditProvider() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeProviderDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getProviders(update?: boolean) {
    this.isLoadingTable = true;
  
    this.providerService.getAllProviders().subscribe({
      next: (response) => {
        this.providers = response;
        if (update) {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos Actualizados',
            detail: 'Se han actualizado los datos de los proveedores',
            life: gc.NOTIFICATION_DURATION
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener proveedores:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener los proveedores',
          life: gc.NOTIFICATION_DURATION
        });
        this.isLoadingTable = false;
      },
      complete: () => {
        this.isLoadingTable = false;
      }
    });
  }

}
