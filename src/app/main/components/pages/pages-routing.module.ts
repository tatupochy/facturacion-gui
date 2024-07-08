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
    { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'transfers', loadChildren: () => import('./transfers/transfers.module').then(m => m.TransfersModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'descriptors', loadChildren: () => import('./descriptors/descriptors.module').then(m => m.DescriptorsModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'types', loadChildren: () => import('./types/types.module').then(m => m.TypesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})

export class PagesRoutingModule {}
