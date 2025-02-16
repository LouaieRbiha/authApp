import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const commonGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedUser = inject(AuthService).loggedUser;
  return loggedUser !== null ? router.navigate(['/dashboard']) : true;
};
