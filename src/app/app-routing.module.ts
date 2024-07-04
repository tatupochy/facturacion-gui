import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { NotfoundComponent } from './main/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/components/app.layout.component";
import { SecurityService } from './main/service/security.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
        // { path: 'login', loadChildren: () => import('./main/components/pages/login/login-form/login-form.module').then(m => m.LoginFormModule)},
        // { path: 'register', loadChildren: () => import('./main/components/pages/register/register.module').then(m => m.RegisterModule)},
        { path: 'home', component: AppLayoutComponent, 
        canActivate: [() => inject(SecurityService).canActivate(['Administrador', 'Escribano', 'Supervisor'])],
          children: [
            { path: '', loadChildren: () => import('./main/components/dashboard/dashboard.module').then(m => m.DashboardModule)},
            { path: 'utilities', loadChildren: () => import('./main/components/utilities/utilities.module').then(m => m.UtilitiesModule)},
            { path: 'pages', loadChildren: () => import('./main/components/pages/pages.module').then(m => m.PagesModule)}
          ]
        },
        { path: 'auth', loadChildren: () => import('./main/components/auth/auth.module').then(m => m.AuthModule) },
        { path: 'landing', loadChildren: () => import('./main/components/landing/landing.module').then(m => m.LandingModule) },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      { useHash: true, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
