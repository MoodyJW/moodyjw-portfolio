import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home').then(m => m.HomeComponent)
      },
      {
        path: 'case-studies',
        loadComponent: () => import('./features/case-studies').then(m => m.CaseStudiesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
