import { inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityService } from 'src/app/main/service/security.service';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'entity-types', loadChildren: () => import('./entity-types/entity-types.module').then(m => m.EntityTypesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: 'data-types', loadChildren: () => import('./data-types/data-types.module').then(m => m.DataTypesModule),
      canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Supervisor'])]
    },
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})

export class PagesRoutingModule {}
