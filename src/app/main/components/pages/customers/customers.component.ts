import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Customer } from 'src/app/main/models/customer';

import { CustomerService } from 'src/app/main/service/customer.service';
import { State } from 'src/app/main/models/state';
import { InputSwitch } from 'primeng/inputswitch';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {

  colsCustomer: any[] = [];
  customers: Customer[] = [];
  selectedCustomer: Customer = new Customer();
  customerForm: FormGroup = new FormGroup({});


  states: State[] = []

  isLoadingTable: boolean = false;
  displayCustomerDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private customerService: CustomerService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Clientes');
    
    this.colsCustomer = [
     
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

    this.getCustomers();

   
    
  }

  // Forms

  initCustomerForm() {
    this.customerForm = this.fb.group({
      id: [this.selectedCustomer.id],
      nombre: [this.selectedCustomer.nombre, [Validators.required, Validators.maxLength(255)]],
      direccion: [this.selectedCustomer.direccion, [Validators.required, Validators.maxLength(255)]],
      telefono: [this.selectedCustomer.telefono, [Validators.required, Validators.maxLength(255)]],
      email: [this.selectedCustomer.email, [Validators.required, Validators.maxLength(255)]],
      ruc: [this.selectedCustomer.ruc, [Validators.required, Validators.maxLength(255)]],
      pais: [this.selectedCustomer.pais, [Validators.required, Validators.maxLength(255)]],
      activo: [this.selectedCustomer.activo]
    });
  }

  // Customer

  showCustomerDialog(customer?: Customer) {

    this.selectedCustomer = customer || new Customer();

    this.initCustomerForm();

    this.displayCustomerDialog = true;

  }

  closeCustomerDialog() {

    this.displayCustomerDialog = false;

    this.selectedCustomer = new Customer();

  }

  setCustomerData() {

    const data = this.customerForm.value;

    let customer = new Customer();

    customer.id = data.id;
    customer.nombre = data.nombre;
    customer.direccion = data.direccion;
    customer.telefono = data.telefono;
    customer.email = data.email;
    customer.ruc = data.ruc;
    customer.pais = data.pais;
    customer.activo = data.activo

    return customer;

  }

  saveCustomer() {
    const customer = this.setCustomerData();
    console.log('Cliente', customer)

    this.customerService.saveCustomer(customer).subscribe({
      next: (response) => {
        if (!response || !response.id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido guardar el cliente',
            life: gc.NOTIFICATION_DURATION
          });
          return;
        }
  
        // Encuentra el índice del cliente en la lista
        const index = this.customers.findIndex(p => p.id === response.id);
  
        if (index !== -1) {
          // Si el cliente existe, actualizarlo en la lista
          this.customers[index] = response;
        } else {
          // Si el cliente no existe, añadirlo a la lista
          this.customers.push(response);
        }
  
        // Crear una nueva referencia de la lista para que Angular detecte el cambio
        this.customers = [...this.customers];
  
        // Cerrar el diálogo del cliente
        this.closeCustomerDialog();
  
        // Mostrar un mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Datos Guardados',
          detail: 'Se ha guardado correctamente el cliente',
          life: gc.NOTIFICATION_DURATION
        });
      },
      error: (error: any) => {
        console.error('Error al guardar el cliente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el cliente',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  deleteCustomer(customer: Customer, index: number) {
    this.customerService.deleteCustomer(customer).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el cliente', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.customers.splice(index, 1);
        this.customers = [...this.customers];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el cliente', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  updateCustomerState(customer: Customer, element: InputSwitch) {
    console.log('Element:', element)
    customer.activo = element.modelValue;
    this.customerService.saveCustomer(customer).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado del cliente', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(customer, response);
        
        this.messageService.add({severity: 'success', summary: 'Estado Actualizado', detail: 'Se ha actualizado correctamente el estado del cliente', life: gc.NOTIFICATION_DURATION});
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

  showConfirmSaveCustomer() {

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveCustomer()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteCustomer(customers: Customer, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteCustomer(customers, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditCustomer() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeCustomerDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getCustomers(update?: boolean) {
    this.isLoadingTable = true;
  
    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = response;
        if (update) {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos Actualizados',
            detail: 'Se han actualizado los datos de los clientes',
            life: gc.NOTIFICATION_DURATION
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener los clientes',
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
