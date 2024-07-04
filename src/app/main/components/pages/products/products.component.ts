import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Product } from 'src/app/main/models/product';

import { ProductService } from 'src/app/main/service/product.service';
import { State } from 'src/app/main/models/state';
import { InputSwitch } from 'primeng/inputswitch';
import { StateService } from 'src/app/main/service/state.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  colsProduct: any[] = [];
  products: Product[] = [];
  selectedProduct: Product = new Product();
  productForm: FormGroup = new FormGroup({});


  states: State[] = []

  isLoadingTable: boolean = false;
  displayProductDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private productService: ProductService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Entidades');
    
    this.colsProduct = [
     
      { field: 'nombre', header: 'Nombre', width: '40%', order: true, center: false },
      { field: 'descripcion', header: 'Descripcion', width: '20%', order: true, center: true },
      { field: 'precio', header: 'Precio', width: '20%', order: true, center: true },
      { field: 'iva', header: 'IVA', width: '10%', order: true, center: true },
      { field: 'activo', header: 'Estado', width: '10%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.loadDataFromApi();

  }

  loadDataFromApi() {

    this.getProducts();

   
    
  }

  // Forms

  initProductForm() {
    this.productForm = this.fb.group({
      id: [this.selectedProduct.id],
      nombre: [this.selectedProduct.nombre, [Validators.required, Validators.maxLength(255)]],
      descripcion: [this.selectedProduct.descripcion, [Validators.required, Validators.maxLength(255)]],
      precio: [this.selectedProduct.precio, [Validators.required, Validators.maxLength(10)]],
      iva: [this.selectedProduct.iva, [Validators.required, Validators.maxLength(10)]],
      activo: [this.selectedProduct.activo],
    });
  }

  // Product

  showProductDialog(product?: Product) {

    this.selectedProduct = product || new Product();

    this.initProductForm();

    this.displayProductDialog = true;

  }

  closeProductDialog() {

    this.displayProductDialog = false;

    this.selectedProduct = new Product();

  }

  setProductData() {

    const data = this.productForm.value;

    let product = new Product();

    product.id = data.id;
    product.nombre = data.nombre;
    product.descripcion = data.descripcion;
    product.precio = data.precio;
    product.iva = data.iva;
    product.activo = data.activo;

    return product;

  }

  saveProduct() {

    const product = this.setProductData();

    this.productService.saveProduct(product).subscribe({
      next: (response) => {
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido guardar el producto', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.products.findIndex((products) => products.id === response.id);
        if (index !== -1) {
          this.products[index] = response;
        } else {
          this.products.push(response);
        }
        this.products = [...this.products];
        this.closeProductDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha guardado correctamente el producto', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteProduct(product: Product, index: number) {
    this.productService.deleteProduct(product).subscribe({
      next: (response) => {
        if (response !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el producto', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.products.splice(index, 1);
        this.products = [...this.products];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el producto', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  updateProductState(product: Product, element: InputSwitch) {

    this.productService.saveProduct(product).subscribe({
      next: (response) => {
        if (response.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar el estado del producto', life: gc.NOTIFICATION_DURATION});
          element.writeValue(!element.modelValue);
          return;
        }
        
        Object.assign(product, response);
        
        this.messageService.add({severity: 'success', summary: 'Estado Actualizado', detail: 'Se ha actualizado correctamente el estado del producto', life: gc.NOTIFICATION_DURATION});
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

  showConfirmSaveProduct() {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la entidad?',
      accept: () => {
        this.saveProduct()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteProduct(products: Product, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la entidad?',
      accept: () => {
        this.deleteProduct(products, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelEditProduct() {
    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeProductDialog();
      },
      reject: () => {
      }
    });
  }

  // Api Calls

  getProducts(update?: boolean) {
    this.isLoadingTable = true;

      this.productService.getAllProducts().subscribe({
        next: (response) => {
          if (update) {
            this.messageService.add({severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado los datos de los productos', life: gc.NOTIFICATION_DURATION});
          }
          this.products = response;
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

}
