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
        path: ROUTES.PROJECTS,
        loadComponent: () => import('./features/projects/projects-list').then((m) => m.ProjectsListComponent),
      },
      {
        path: ROUTES.PROJECT_DETAIL,
        loadComponent: () => import('./features/projects/project-detail').then((m) => m.ProjectDetailComponent),
      },
      {
        path: ROUTES.CASE_STUDIES,
        loadComponent: () => import('./features/case-studies').then((m) => m.CaseStudiesComponent),
      },
      {
        path: ROUTES.CASE_STUDY_DETAIL,
        loadComponent: () => import('./features/case-studies/case-study-detail').then((m) => m.CaseStudyDetailComponent),
      },
      {
        path: ROUTES.ABOUT,
        loadComponent: () => import('./features/about').then((m) => m.AboutComponent),
      },
      {
        path: ROUTES.CONTACT,
        loadComponent: () => import('./features/contact').then((m) => m.ContactComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ROUTES.HOME,
  },
];
