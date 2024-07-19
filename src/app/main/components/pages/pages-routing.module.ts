import { inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityService } from 'src/app/main/service/security.service';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'providers', loadChildren: () => import('./providers/providers.module').then(m => m.ProvidersModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.IvoicesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'purchases', loadChildren: () => import('./purchases/purchases.module').then(m => m.PurchasesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})

export class PagesRoutingModule {}
