import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { SigninComponent } from './signin/signin.component';

import { AuthGuard } from './guards/auth.guard';


export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'qr',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'signin',
        component: SigninComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
