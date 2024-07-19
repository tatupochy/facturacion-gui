import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Sale } from 'src/app/main/models/sale';

import { SaleService } from 'src/app/main/service/sale.service';
import { InputSwitch } from 'primeng/inputswitch';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {

  colsSale: any[] = [];
  sales: Sale[] = [];
  selectedSale: Sale = new Sale();
  saleForm: FormGroup = new FormGroup({});

  isLoadingTable: boolean = false;
  displaySaleDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private saleService: SaleService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Ventas');
    
    this.colsSale = [
     
      { field: 'cliente.nombre', header: 'Cliente', width: '40%', order: true, center: false },
      { field: 'cantidad', header: 'Cantidad', width: '20%', order: true, center: true },
      { field: 'producto.nombre', header: 'Producto', width: '20%', order: true, center: true },
      { field: 'producto.precio', header: 'Precio', width: '1a0%', order: true, center: true },
      { field: 'factura.numeracion', header: 'Factura', width: '10%', order: true, center: true }
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getSales();

   
    
  }

  // Forms

  initSaleForm() {
    this.saleForm = this.fb.group({
      id: [this.selectedSale.id],
      nombre: [this.selectedSale.cliente.nombre, Validators.required],
      cantidad: [this.selectedSale.cantidad, Validators.required],
      producto: [this.selectedSale.producto, Validators.required],
      factura: [this.selectedSale.factura.numeracion, Validators.required]
    });
  }

  // Sale

  showSaleDialog(sale?: Sale) {

    this.selectedSale = sale || new Sale();

    this.initSaleForm();

    this.displaySaleDialog = true;

  }

  closeSaleDialog() {

    this.displaySaleDialog = false;

    this.selectedSale = new Sale();

  }

  setSaleData() {

    const data = this.saleForm.value;

    let sale = new Sale();

    sale.id = data.id;
    sale.cliente.nombre = data.nombre;
    sale.cantidad = data.cantidad;
    sale.producto = data.producto;
    sale.factura.numeracion = data.factura;

    return sale;

  }

  saveSale() {
    const sale = this.setSaleData();
  
    this.saleService.saveSale(sale).subscribe({
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
        const index = this.sales.findIndex(p => p.id === response.id);
  
        if (index !== -1) {
          // Si el venta existe, actualizarlo en la lista
          this.sales[index] = response;
        } else {
          // Si el venta no existe, añadirlo a la lista
          this.sales.push(response);
        }
  
        // Crear una nueva referencia de la lista para que Angular detecte el cambio
        this.sales = [...this.sales];
  
        // Cerrar el diálogo del venta
        this.closeSaleDialog();
  
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

  deleteSale(sale: Sale, index: number) {
    this.saleService.deleteSale(sale).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el venta', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.sales.splice(index, 1);
        this.sales = [...this.sales];
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

  updateSaleState(sale: Sale, element: InputSwitch) {
    console.log('Element:', element)
    this.saleService.saveSale(sale).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado del venta', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(sale, response);
        
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

  showConfirmSaveSale() {

    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveSale()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteSale(sales: Sale, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteSale(sales, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditSale() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeSaleDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getSales(update?: boolean) {
    this.isLoadingTable = true;
  
    this.saleService.getAllSales().subscribe({
      next: (response) => {
        this.sales = response;
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
