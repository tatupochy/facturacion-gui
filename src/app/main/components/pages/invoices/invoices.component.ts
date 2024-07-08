import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { firstValueFrom, Subscription } from 'rxjs';

import { format, parse } from 'date-fns';

import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Invoice } from 'src/app/main/models/invoice';
import { InvoiceItem } from 'src/app/main/models/invoice-item';

import { InvoiceService } from 'src/app/main/service/invoice.service';
import { ProductService } from 'src/app/main/service/product.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit, OnDestroy {

  colsInvoice: any[] = [];
  invoices: Invoice[] = [];
  selectedInvoice: Invoice = new Invoice();
  invoiceForm: FormGroup = new FormGroup({});
  displayNewInvoiceDialog: boolean = false;

  filterForm: FormGroup = new FormGroup({});
 
  isLoadingNewInvoice: boolean = false;

  currentDate: Date = new Date();

  colsNewInvoiceItems: any[] = [];

  displayInvoiceItemsDialog: boolean = false;
  invoiceItems: InvoiceItem[] = []
  colsInvoiceItems: any[] = [];
  isLoadingInvoiceItems: boolean = false;
  isLoadingInvoiceItemsIndex: number = 0;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private invoiceService: InvoiceService,
    private productService: ProductService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Invoiceencias');
    
    this.colsInvoice = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'invoiceNumber', header: 'N° de Acta', width: '25%', order: true, center: true },
      { field: 'invoiceDateStr', header: 'Fecha de Creación', width: '25%', order: true, center: true },
      { field: 'updateUser', header: 'Usuario', width: '20%', order: true, center: true },
      { field: 'state.name', header: 'Estado', width: '25%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.colsNewInvoiceItems = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'identifier', header: 'N° de Documento', width: '25%', order: true, center: true },
      { field: 'updateDateStr', header: 'Fecha de Documento', width: '25%', order: true, center: true },
      { field: 'stored', header: 'Inventariado', width: '25%', order: true, center: true },
      { field: 'box.number', header: 'N° de Caja', width: '20%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.colsInvoiceItems = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'identifier', header: 'N° de Documento', width: '25%', order: true, center: true },
      { field: 'updateDateStr', header: 'Fecha de Documento', width: '25%', order: true, center: true },
      { field: 'stored', header: 'Inventariado', width: '25%', order: true, center: true },
      { field: 'box.number', header: 'N° de Caja', width: '20%', order: true, center: true },
    ];

    this.loadDataFromApi();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  loadDataFromApi() {

    // this.getEntities();
    
  }
  // Forms

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      id: [this.selectedInvoice.id],
      numero: [this.selectedInvoice.numero, [Validators.required, Validators.maxLength(100)]],
      numeracion: [this.selectedInvoice.numeracion, [Validators.required, Validators.maxLength(100)]],
      fecha_emision: [this.selectedInvoice.fecha_emision, [Validators.required]],
      cliente: [this.selectedInvoice.cliente, [Validators.required]],
      sub_total: [this.selectedInvoice.sub_total, [Validators.required, Validators.min(0)]],
      total: [this.selectedInvoice.total, [Validators.required, Validators.min(0)]],
      establecimiento: [this.selectedInvoice.establecimiento, [Validators.required, Validators.maxLength(100)]],
      punto_expedicion: [this.selectedInvoice.punto_expedicion, [Validators.required, Validators.maxLength(100)]],
      fecha_vencimiento: [this.selectedInvoice.fecha_vencimiento, [Validators.required]],
      timbrado: [this.selectedInvoice.timbrado, [Validators.required, Validators.maxLength(100)]],
      condicion_venta: [this.selectedInvoice.condicion_venta, [Validators.required]],
      total_iva_5: [this.selectedInvoice.total_iva_5, [Validators.required, Validators.min(0)]],
      sub_total_iva_5: [this.selectedInvoice.sub_total_iva_5, [Validators.required, Validators.min(0)]],
      total_iva_10: [this.selectedInvoice.total_iva_10, [Validators.required, Validators.min(0)]],
      sub_total_iva_10: [this.selectedInvoice.sub_total_iva_10, [Validators.required, Validators.min(0)]],
      total_iva: [this.selectedInvoice.total_iva, [Validators.required, Validators.min(0)]],
      sub_total_iva: [this.selectedInvoice.sub_total_iva, [Validators.required, Validators.min(0)]],
      items: this.fb.array([])
    });
  }

  // Invoice

  async showInvoiceDialog(invoice?: Invoice) {
    this.selectedInvoice = invoice ? invoice : new Invoice();
    this.initInvoiceForm();
    this.displayNewInvoiceDialog = true;
  }

  closeInvoiceDialog() {
    this.displayNewInvoiceDialog = false;
  }

  setInvoiceData() {

    const data = this.invoiceForm.value;
    
    let invoice = new Invoice();

    invoice.id = data.id,
    invoice.numero = data.numero,
    invoice.numeracion = data.numeracion,
    invoice.fecha_emision = data.fecha_emision,
    invoice.cliente = data.cliente,
    invoice.sub_total = data.sub_total,
    invoice.total = data.total,
    invoice.establecimiento = data.establecimiento,
    invoice.punto_expedicion = data.punto_expedicion,
    invoice.fecha_vencimiento = data.fecha_vencimiento,
    invoice.timbrado = data.timbrado,
    invoice.condicion_venta = data.condicion_venta,
    invoice.total_iva_5 = data.total_iva_5,
    invoice.sub_total_iva_5 = data.sub_total_iva_5,
    invoice.total_iva_10 = data.total_iva_10,
    invoice.sub_total_iva_10 = data.sub_total_iva_10,
    invoice.total_iva = data.total_iva,
    invoice.sub_total_iva = data.sub_total_iva,
    invoice.items = data.items

    return invoice;


  }

  saveInvoice() {
    const invoice = this.setInvoiceData();
    console.log('Factura', invoice);

    this.invoiceService.saveInvoice(invoice).subscribe({
      next: (response) => {
        if (!response || !response.id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido guardar la factura',
            life: gc.NOTIFICATION_DURATION
          });
          return;
        }

        const index = this.invoices.findIndex(p => p.id === response.id);

        if (index !== -1) {
          this.invoices[index] = response;
        } else {
          this.invoices.push(response);
        }

        this.invoices = [...this.invoices];
        this.closeInvoiceDialog();

        this.messageService.add({
          severity: 'success',
          summary: 'Datos Guardados',
          detail: 'Se ha guardado correctamente la factura',
          life: gc.NOTIFICATION_DURATION
        });
      },
      error: (error: any) => {
        console.error('Error al guardar la factura:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar la factura',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  deleteInvoice(invoice: Invoice, index: number) {
    this.invoiceService.deleteInvoice(invoice).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido eliminar la factura',
            life: gc.NOTIFICATION_DURATION
          });
          return;
        }

        this.invoices.splice(index, 1);
        this.invoices = [...this.invoices];
        this.messageService.add({
          severity: 'success',
          summary: 'Datos Eliminados',
          detail: 'Se ha eliminado correctamente la factura',
          life: gc.NOTIFICATION_DURATION
        });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: gc.NOTIFICATION_DURATION
          });
        }
      }
    });
  }


  showConfirmSaveInvoice() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe completar todos los campos requeridos',
        life: gc.NOTIFICATION_DURATION
      });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la factura?',
      accept: () => {
        this.saveInvoice();
      },
      reject: () => {}
    });
  }

  showConfirmCancelEditInvoice() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeInvoiceDialog();
      },
      reject: () => {}
    });
  }

  showConfirmCancelNewInvoice() {
    if (this.invoiceForm.value?.invoiceItems?.length <= 0) {
      this.closeInvoiceDialog();
      return;
    }

    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeInvoiceDialog();
      },
      reject: () => {
      }
    });
  }

  updateDate() {
    this.currentDate = new Date();
  }

  // Invoice Item

  async showInvoiceItemsDialog(invoice: Invoice, index: number) {

    this.isLoadingInvoiceItems = true;
    this.isLoadingInvoiceItemsIndex = index;

    if (!invoice) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido cargar la invoiceencia', life: gc.NOTIFICATION_DURATION});
      this.isLoadingInvoiceItems = false;
      this.isLoadingInvoiceItemsIndex = 0;
      return;
    }

    try {
      const responseInvoice = await firstValueFrom(this.invoiceService.getInvoiceById(invoice?.id));
      if (responseInvoice) {
        this.selectedInvoice = responseInvoice;
        this.initInvoiceForm();
        this.displayInvoiceItemsDialog = true;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
      }
    }

    this.isLoadingInvoiceItems = false;
    this.isLoadingInvoiceItemsIndex = 0;

  }

  closeInvoiceItemsDialog() {

    this.displayInvoiceItemsDialog = false;

    this.selectedInvoice = new Invoice();

  }

  addInvoiceItem() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe completar todos los campos requeridos',
        life: gc.NOTIFICATION_DURATION
      });
      return;
    }
  
    // Obtener datos de la factura y del producto
    let invoice = this.selectedInvoice;  // Usar el invoice ya seleccionado
    let product = this.invoiceForm.value.product;  // Asegurarse de que el producto se ha seleccionado del formulario
  
    // Crear un nuevo InvoiceItem
    let invoiceItem = new InvoiceItem();
    invoiceItem.id = null;
    invoiceItem.cantidad = this.invoiceForm.value.cantidad;
    invoiceItem.factura = invoice;
    invoiceItem.producto = product;
  
    // Obtener el FormArray de items
    const itemsArray = this.invoiceForm.get('items') as FormArray;
  
    // Agregar el nuevo item al FormArray
    itemsArray.push(this.fb.group({
      producto: [invoiceItem.producto, Validators.required],
      cantidad: [invoiceItem.cantidad, [Validators.required, Validators.min(1)]],
      precio_unitario: [invoiceItem.producto.precio, [Validators.required, Validators.min(0.01)]]
    }));
  
    // Actualizar el formulario
    this.invoiceForm.setControl('items', itemsArray);
  }
  

  deleteInvoiceItem(index: number) {
    this.invoiceForm.value.invoiceItems.splice(index, 1);
    this.invoiceForm.value.invoiceItems = [...this.invoiceForm.value.invoiceItems];
  }

  // Api Calls

  getInvoices(update?: boolean) {
    this.isLoadingNewInvoice;

    this.invoiceService.getAllInvoices().subscribe({
      next: (response) => {
        this.invoices = response;
        if (update) {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos Actualizados',
            detail: 'Se han actualizado los datos de las facturas',
            life: gc.NOTIFICATION_DURATION
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener facturas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener las facturas',
          life: gc.NOTIFICATION_DURATION
        });
        this.isLoadingNewInvoice = false;
      },
      complete: () => {
        this.isLoadingNewInvoice = false;
      }
    });
  }
}
