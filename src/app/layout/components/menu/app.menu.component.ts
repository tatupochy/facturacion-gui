import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { AuthenticationService } from 'src/app/main/service/authentication.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.model = [
      { label: 'Peronas', icon: 'pi pi-user',
        items: [
          { label: 'Clientes', icon:'pi pi-user', routerLink: ['/home/pages/customers'] },
          { label: 'Proveedores', icon:'pi pi-user', routerLink: ['/home/pages/providers'] },
        ]
      },
      { label: 'Inventario', icon: 'pi pi-tags',
        items:[
          { label: 'Productos', icon: 'pi pi-tags', routerLink: ['/home/pages/products'] },
        ]
      },
      { label: 'Movimientos', icon: 'pi pi-money-bill',
        items:[
          { label: 'Facturas', icon:'pi pi-receipt', routerLink: ['/home/pages/invoices'] },
          { label: 'Ventas', icon:'pi pi-shopping-cart', routerLink: ['/home/pages/sales'] },
          { label: 'Compras', icon:'pi pi-cart-arrow-down', routerLink: ['/home/pages/purchases'] },
        ]
      },
      { label: 'Reportes', icon: 'pi pi-chart-bar',
          items:[
            { label: 'Reportes', icon:'pi pi-chart-bar', routerLink: ['/home/pages/reports'] }
          ]
      }
    ];
  }
}
