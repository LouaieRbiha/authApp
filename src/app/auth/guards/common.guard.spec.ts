import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { commonGuard } from './common.guard';
import { AuthService } from '../services/auth.service';
import { MockService } from 'ng-mocks';
import { Role } from '../models/user.interface';

describe('commonGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => commonGuard(...guardParameters));

  const authServiceMock: AuthService = MockService(AuthService);
  const mockRouter = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        commonGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow to go to auth/login route', () => {
    authServiceMock.loggedUser = null;
    expect(
      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBe(true);
  });

  it('should redirect to /dashboard', () => {
    authServiceMock.loggedUser = { username: 'aaaa', role: Role.USER };
    executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
