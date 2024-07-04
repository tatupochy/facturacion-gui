import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { AuthenticationService } from 'src/app/main/service/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.model = [
      { label: 'Procesos', icon: 'pi pi-truck',
        items: [
          { label: 'Transferencias', icon: 'pi pi-truck', routerLink: ['/home/pages/transfers'] },
          { label: 'Digitalización', icon: 'pi pi-file', routerLink: ['/home/pages/companies'] },
          { label: 'Control de Calidad', icon: 'pi pi-verified', routerLink: ['/home/pages/companies'] },
          { label: 'Consultas', icon: 'pi pi-search', routerLink: ['/home/pages/companies'] },
          { label: 'Préstamos', icon: 'pi pi-file-export', routerLink: ['/home/pages/companies'] },
        ]
      },
      { label: 'Varios',
        items: [
          { label: 'Productos', icon: 'pi pi-tags', routerLink: ['/home/pages/products'] },
          { label: 'Descriptores', icon: 'pi pi-tags', routerLink: ['/home/pages/descriptors'] },
        ]
      },
      { label: 'Tipos',
        items: [
          { label: 'Entidades', icon: 'pi pi-building', routerLink: ['/home/pages/types/entity-types'] },
          { label: 'Datos', icon: 'pi pi-database', routerLink: ['/home/pages/types/data-types'] },
        ]
      },
      // { label: 'Tipos',
      //   items: [
      //     { label: 'Entidades', icon: 'pi pi-building', routerLink: ['/home/pages/companies'] },
      //   ]
      // },
      // { label: 'Ayuda',
      //   items: [
      //       { label: 'Base Legal', icon: 'pi pi-fw pi-align-center', routerLink: ['/utilities/icons'] },
      //       { label: 'Descripción de Opciones', icon: 'pi pi-fw pi-sitemap', routerLink: ['/utilities/icons'] },
      //   ],
      // },
       { label: 'Seguridad', icon: 'pi pi-fw pi-cog',
         items: [
           { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/home/pages/users'] },
        ],
      },
    ];
  }
}
