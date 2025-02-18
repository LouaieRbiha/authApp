import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { MockService } from 'ng-mocks';
import { Role } from '../models/user.interface';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const authServiceMock: AuthService = MockService(AuthService);
  const mockRouter = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow the route', () => {
    authServiceMock.loggedUser = { username: 'aaaa', role: Role.USER };
    expect(
      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBe(true);
  });

  it('should redirect to /auth/login', () => {
    authServiceMock.loggedUser = null;
    executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
