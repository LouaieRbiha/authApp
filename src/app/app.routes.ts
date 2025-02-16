import { Route } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { commonGuard } from './auth/guards/common.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [commonGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./Dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
];
