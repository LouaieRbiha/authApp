import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Role } from '../auth/models/user.interface';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    canMatch: [() => inject(AuthService).loggedUser?.role === Role.USER],
  },
  {
    path: '',
    component: AdminDashboardComponent,
    canMatch: [() => inject(AuthService).loggedUser?.role === Role.ADMIN],
  },
];
