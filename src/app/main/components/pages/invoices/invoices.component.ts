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
import { CustomerService } from 'src/app/main/service/customer.service';
import { ProviderService } from 'src/app/main/service/provider.service';
import { Customer } from 'src/app/main/models/customer';
import { Product } from 'src/app/main/models/product';
import { Provider } from 'src/app/main/models/provider';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit, OnDestroy {

  colsInvoice: any[] = [];
  invoices: Invoice[] = [];
  customers: Customer[] = [];
  providers: Provider[] = [];
  products: Product[] = [];
  operations: String[] = ['venta', 'compra']
  sale_conditions: String[] = ['contado', 'credito']
  selectedInvoice: Invoice = new Invoice();
  invoiceForm: FormGroup = new FormGroup({});
  invoiceItemForm: FormGroup = new FormGroup({});
  displayNewInvoiceDialog: boolean = false;
  displayNewInvoiceItemDialog: boolean = false;
  isSearchingIvoices: boolean = false;
  total_exentas: number = 0;
  total_iva_10: number = 0;
  total_iva_5: number = 0;

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
    private customerService: CustomerService,
    private providerService: ProviderService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Facturas');
    
    this.colsInvoice = [
      { field: 'numero', header: 'N°', width: '5%', order: false, center: true },
      { field: 'numeracion', header: 'Numeración', width: '30%', order: true, center: true },
      { field: 'fecha_emision', header: 'Fecha de Emisión', width: '20%', order: true, center: true },
      { field: 'operacion' , header: 'Operación', width: '15%', order: true, center: true },
      { field: 'total', header: 'Total', width: '15%', order: true, center: true },
      { field: 'timbrado', header: 'Timbrado', width: '15%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.colsNewInvoiceItems = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'producto.nombre', header: 'Producto', width: '50%', order: true, center: true },
      { field: 'cantidad', header: 'Cantidad', width: '50%', order: true, center: true },
    ];

    this.colsInvoiceItems = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'producto.nombre', header: 'Producto', width: '35%', order: true, center: true },
      { field: 'cantidad', header: 'Cantidad', width: '15%', order: true, center: true },
      { field: 'iva_exenta', header: 'Exentas', width: '15%', order: true, center: true },
      { field: 'iva_10', header: '10', width: '15%', order: true, center: true },
      { field: 'iva_5', header: '5', width: '15%', order: true, center: true },
    ];

    this.loadDataFromApi();
    
    this.initFilterForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  loadDataFromApi() {

    console.log('loadData');
    this.getCustomers();
    this.getProviders();
    this.getProducts();
  }
  // Forms

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      id: [this.selectedInvoice.id],
      fecha_emision: [format(this.currentDate, 'yyyy/MM/dd'), [Validators.required]],
      cliente: [this.selectedInvoice.cliente],
      proveedor: [this.selectedInvoice.proveedor],
      establecimiento: [this.selectedInvoice.establecimiento, [Validators.required, Validators.maxLength(3)]],
      punto_expedicion: [this.selectedInvoice.punto_expedicion, [Validators.required, Validators.maxLength(3)]],
      fecha_vencimiento: [null],
      timbrado: [this.selectedInvoice.timbrado, [Validators.required, Validators.maxLength(7)]],
      operacion: [this.selectedInvoice.operacion, [Validators.required]],
      condicion_venta: [this.selectedInvoice.condicion_venta, [Validators.required]],
      items: this.fb.array([])
    });
    console.log('invoiceForm', this.invoiceForm);
  }

  initInvoiceItemForm(){
    this.invoiceItemForm = this.fb.group({
      producto: [null],
      cantidad: [null],
    });
    console.log('invoiceItemForm', this.invoiceItemForm);
  }

  initFilterForm(){
    this.filterForm = this.fb.group({
      operacion: [null, Validators.required],
      fecha_emision: [null]
    });
  }
  
  // Invoice

  searchFilterIvoices() {
    console.log('searchFilterIvoices');

    const data = this.filterForm.value;

    let filter = {
      operacion: data.operacion,
      fecha_emision: data.fecha_emision
    }

    console.log('filter', filter);

    this.isSearchingIvoices = true;

    this.invoiceService.searchInvoicesByFilter(filter).subscribe({
      next: (response) => {
        this.invoices = response;
      },
      error: (error: any) => {
        console.error('Error al obtener facturas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener las facturas',
          life: gc.NOTIFICATION_DURATION
        });
        this.isSearchingIvoices = false;
      },
      complete: () => {
        this.isSearchingIvoices = false;
      }
    });
  }

  async showInvoiceDialog(invoice?: Invoice) {
    this.selectedInvoice = invoice ? invoice : new Invoice();
    this.initInvoiceForm();
    this.initInvoiceItemForm();
    this.displayNewInvoiceDialog = true;
  }

  closeInvoiceDialog() {
    this.displayNewInvoiceDialog = false;
  }

  showNewInvoiceItemDialog() {
    this.displayNewInvoiceItemDialog = true;
  }

  closeNewInvoiceItemDialog() {
    this.displayNewInvoiceItemDialog = false;
  } 

  setInvoiceData() {

    const data = this.invoiceForm.value;
    
    let invoice = new Invoice();

    invoice.id = data.id,
    invoice.numero = data.numero,
    invoice.numeracion = data.numeracion,
    invoice.fecha_emision = data.fecha_emision,
    invoice.cliente = data.cliente,
    invoice.proveedor = data.proveedor,
    invoice.operacion = data.operacion,
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

  setInvoiceItemData() {

    const data = this.invoiceItemForm.value;

    let invoiceItem = new InvoiceItem();

    invoiceItem.cantidad = data.cantidad;
    invoiceItem.producto = data.producto;

    return invoiceItem;

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
        this.displayInvoiceItemsDialog = true;
        this.calculateTotals(this.selectedInvoice);
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
  
  calculateTotals(selectedInvoice: Invoice) {

    for (let item of selectedInvoice.items) {
      if (item.producto.iva === '0') {
        this.total_exentas += item.cantidad * item.producto.precio;
      } else if (item.producto.iva === '10') {
        this.total_iva_10 += item.cantidad * item.producto.precio;
      } else if (item.producto.iva === '5') {
        this.total_iva_5 += item.cantidad * item.producto.precio;
      }
    }  

  }

  closeInvoiceItemsDialog() {

    this.displayInvoiceItemsDialog = false;

    this.selectedInvoice = new Invoice();

  }

  addInvoiceItem() {
    if (this.invoiceItemForm.invalid) {
      this.invoiceItemForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe completar todos los campos requeridos',
        life: gc.NOTIFICATION_DURATION
      });
      return;
    }
  
    // Obtener datos de la factura y del producto
    let invoice = new Invoice;
    let producto = this.invoiceItemForm.value.producto;
    // raise error if quantity is less than 1, or is more than the stock
    let cantidad = this.invoiceItemForm.value.cantidad;
    if (this.invoiceForm.value.operacion === 'venta') {
      if (cantidad < 1) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La cantidad debe ser mayor a 0',
          life: gc.NOTIFICATION_DURATION
        });
        return;
      }
      if (cantidad > producto.stock) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La cantidad no puede ser mayor al stock',
          life: gc.NOTIFICATION_DURATION
        });
        return;
      }
    }

    // Crear un nuevo InvoiceItem
    let invoiceItem = new InvoiceItem();
    invoiceItem.id = null;
    invoiceItem.cantidad = cantidad;
    invoiceItem.factura = invoice;
    invoiceItem.producto = producto;
  
    // Obtener el FormArray de items
    const itemsArray = this.invoiceForm.get('items') as FormArray;
  
    // Agregar el nuevo item al FormArray
    itemsArray.push(this.fb.group({
      producto: [invoiceItem.producto, Validators.required],
      cantidad: [invoiceItem.cantidad, [Validators.required, Validators.min(1)]],
    }));
  
    // Actualizar el formulario
    this.invoiceForm.setControl('items', itemsArray);
    // limpiar el formulario de item
    this.invoiceItemForm.reset();
    console.log('invoiceForm', this.invoiceForm)
  }
  

  deleteInvoiceItem(index: number) {
    this.invoiceForm.value.invoiceItems.splice(index, 1);
    this.invoiceForm.value.invoiceItems = [...this.invoiceForm.value.invoiceItems];
  }

  // Api Calls

  getInvoices(update?: boolean) {
    this.isSearchingIvoices = true;

    console.log("getInvoices")

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

  getCustomers(update?: boolean) {
    console.log("getCustomers")
    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        // filter only active customers
        this.customers = response.filter(c => c.activo);
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
          detail: 'Ocurrió un error al obtener clientes',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  getProviders(update?: boolean) {
    console.log("getProviders")
    this.providerService.getAllProviders().subscribe({
      next: (response) => {
        // filter only active providers
        this.providers = response.filter(p => p.activo);
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
          detail: 'Ocurrió un error al obtener proveedores',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }

  getProducts(update?: boolean) {
    console.log("getProducts")
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        // filter products with stock > 0
        this.products = response.filter(p => p.stock > 0);
        if (update) {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos Actualizados',
            detail: 'Se han actualizado los datos de los productos',
            life: gc.NOTIFICATION_DURATION
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al obtener productos',
          life: gc.NOTIFICATION_DURATION
        });
      }
    });
  }
}
