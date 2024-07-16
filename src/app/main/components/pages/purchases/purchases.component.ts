import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Purchase } from 'src/app/main/models/purchase';

import { PurchaseService } from 'src/app/main/service/purchase.service';
import { State } from 'src/app/main/models/state';
import { InputSwitch } from 'primeng/inputswitch';
import { StateService } from 'src/app/main/service/state.service';


@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {

  colsPurchase: any[] = [];
  purchases: Purchase[] = [];
  selectedPurchase: Purchase = new Purchase();
  purchaseForm: FormGroup = new FormGroup({});


  states: State[] = []

  isLoadingTable: boolean = false;
  displayPurchaseDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private purchaseService: PurchaseService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Ventas');
    
    this.colsPurchase = [
     
      { field: 'proveedor.nombre', header: 'Proveedor', width: '40%', order: true, center: false },
      { field: 'cantidad', header: 'Cantidad', width: '20%', order: true, center: true },
      { field: 'producto.nombre', header: 'Producto', width: '20%', order: true, center: true },
      { field: 'producto.precio', header: 'Precio', width: '1a0%', order: true, center: true },
      { field: 'factura.numeracion', header: 'Factura', width: '10%', order: true, center: true }
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getPurchases();

   
    
  }

  // Forms

  initPurchaseForm() {
    this.purchaseForm = this.fb.group({
      id: [this.selectedPurchase.id],
      nombre: [this.selectedPurchase.proveedor.nombre, Validators.required],
      cantidad: [this.selectedPurchase.cantidad, Validators.required],
      producto: [this.selectedPurchase.producto, Validators.required],
      factura: [this.selectedPurchase.factura.numeracion, Validators.required]
    });
  }

  // Purchase

  showPurchaseDialog(purchase?: Purchase) {

    this.selectedPurchase = purchase || new Purchase();

    this.initPurchaseForm();

    this.displayPurchaseDialog = true;

  }

  closePurchaseDialog() {

    this.displayPurchaseDialog = false;

    this.selectedPurchase = new Purchase();

  }

  setPurchaseData() {

    const data = this.purchaseForm.value;

    let purchase = new Purchase();

    purchase.id = data.id;
    purchase.proveedor.nombre = data.nombre;
    purchase.cantidad = data.cantidad;
    purchase.producto = data.producto;
    purchase.factura.numeracion = data.factura;

    return purchase;

  }

  savePurchase() {
    const purchase = this.setPurchaseData();
  
    this.purchaseService.savePurchase(purchase).subscribe({
      next: (response) => {
        if (!response || !response.id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido guardar el venta',
            life: gc.NOTIFICATION_DURATION
          });
          return;
        }
  
        // Encuentra el índice del venta en la lista
        const index = this.purchases.findIndex(p => p.id === response.id);
  
        if (index !== -1) {
          // Si el venta existe, actualizarlo en la lista
          this.purchases[index] = response;
        } else {
          // Si el venta no existe, añadirlo a la lista
          this.purchases.push(response);
        }
  
        // Crear una nueva referencia de la lista para que Angular detecte el cambio
        this.purchases = [...this.purchases];
  
        // Cerrar el diálogo del venta
        this.closePurchaseDialog();
  
        // Mostrar un mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Datos Guardados',
          detail: 'Se ha guardado correctamente el venta',
          life: gc.NOTIFICATION_DURATION
        });
      },
      error: (error: any) => {
        console.error('Error al guardar el venta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el venta',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  deletePurchase(purchase: Purchase, index: number) {
    this.purchaseService.deletePurchase(purchase).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el venta', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.purchases.splice(index, 1);
        this.purchases = [...this.purchases];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el venta', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  updatePurchaseState(purchase: Purchase, element: InputSwitch) {
    console.log('Element:', element)
    this.purchaseService.savePurchase(purchase).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado del venta', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(purchase, response);
        
        this.messageService.add({severity: 'success', summary: 'Estado Actualizado', detail: 'Se ha actualizado correctamente el estado del venta', life: gc.NOTIFICATION_DURATION});
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

  showConfirmSavePurchase() {

    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.savePurchase()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeletePurchase(purchases: Purchase, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deletePurchase(purchases, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditPurchase() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closePurchaseDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getPurchases(update?: boolean) {
    this.isLoadingTable = true;
  
    this.purchaseService.getAllPurchases().subscribe({
      next: (response) => {
        this.purchases = response;
        if (update) {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos Actualizados',
            detail: 'Se han actualizado los datos de los ventas',
            life: gc.NOTIFICATION_DURATION
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener ventas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener los ventas',
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
