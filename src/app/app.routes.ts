import type { Routes } from '@angular/router';

import { ROUTES } from '@shared/constants';

export const routes: Routes = [
  {
    path: ROUTES.ROOT,
    loadComponent: () => import('./core/layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: ROUTES.ROOT,
        redirectTo: ROUTES.HOME,
        pathMatch: 'full',
      },
      {
        path: ROUTES.HOME,
        loadComponent: () => import('./features/home').then((m) => m.HomeComponent),
      },
      {
        path: ROUTES.CASE_STUDIES,
        loadComponent: () => import('./features/case-studies').then((m) => m.CaseStudiesComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ROUTES.HOME,
  },
];
