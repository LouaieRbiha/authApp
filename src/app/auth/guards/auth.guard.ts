import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loggedUser = inject(AuthService).loggedUser;
  return loggedUser ? true : router.navigate(['/auth/login']);
};
