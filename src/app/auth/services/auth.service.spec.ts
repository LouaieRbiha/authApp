import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { fakeDb } from '../utils/fakeDb';
import { first } from 'rxjs';

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory(AuthService);
  const mockRouter = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    spectator = createService({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      const { username, password, role } = fakeDb[0];

      spectator.service.login({ username, password }).subscribe((res) => {
        expect(spectator.service.loggedUser).toBeNull();
        expect(res).toEqual({
          success: true,
          message: `${username} is logged in successfully`,
        });

        expect(spectator.service.loggedUser).toEqual({ username, role });
      });
    });

    it('should not login with invalid credentials', () => {
      const invalidUser = {
        username: 'wrongUsername',
        password: 'wrongPassword',
      };

      spectator.service
        .login({
          username: invalidUser.username,
          password: invalidUser.password,
        })
        .pipe(first())
        .subscribe((res) => {
          expect(spectator.service.loggedUser).toBeNull();
          expect(res).toEqual({
            success: false,
            message: `Invalid credentials`,
          });

          expect(spectator.service.loggedUser).toEqual(null);
        });
    });
  });

  describe('logout', () => {
    it('should clear loggedUser and navigate to /auth/login', () => {
      spectator.service.logout();

      expect(spectator.service.loggedUser).toBe(null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
