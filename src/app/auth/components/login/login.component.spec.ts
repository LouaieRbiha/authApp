import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { Spectator, byTestId, createComponentFactory } from '@ngneat/spectator';
import { AuthService } from '../../services/auth.service';
import { MockService } from 'ng-mocks';
import { User } from '../../models/user.interface';
import { delay, of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;
  const authServiceMock: AuthService = MockService(AuthService);
  const mockRouter = { navigate: jest.fn() };

  const createComponent = createComponentFactory({
    component: LoginComponent,
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      { provide: Router, useValue: mockRouter },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should fill out the form with username and password', () => {
    spectator.component.fillForm();

    expect(spectator.component.loginForm.value).not.toEqual({
      username: '',
      password: '',
    });
  });

  it('should show error message when a required field is not entered', () => {
    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );
    const usernameElement: HTMLInputElement | null = spectator.query(
      byTestId('username_input')
    );

    loginForm.triggerEventHandler('submit', {});

    spectator.detectChanges();

    expect(usernameElement?.classList).toContain('ng-invalid');
  });

  it('should be able to change input type based on password visible value', () => {
    const passwordElement: HTMLInputElement | null = spectator.query(
      byTestId('password_input')
    );

    spectator.component.isPasswordVisible.set(true);
    spectator.detectChanges();
    expect(passwordElement?.type).toBe('text');

    spectator.component.isPasswordVisible.set(false);
    spectator.detectChanges();
    expect(passwordElement?.type).toBe('password');
  });

  it('should display a spinner on submit when form is valid', fakeAsync(() => {
    jest
      .spyOn(authServiceMock, 'login')
      .mockImplementation(() =>
        of({ success: true, message: '' }).pipe(delay(1000))
      );
    const user: Omit<User, 'role'> = { username: 'aaaa', password: 'bbbb' };

    const usernameElement: HTMLInputElement | null = spectator.query(
      byTestId('username_input')
    );

    const passwordElement: HTMLInputElement | null = spectator.query(
      byTestId('password_input')
    );

    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );

    if (usernameElement && passwordElement) {
      spectator.typeInElement(user.username, usernameElement);
      spectator.typeInElement(user.password, passwordElement);
    }

    loginForm.triggerEventHandler('submit', {});

    tick(500);
    spectator.detectChanges();
    expect(spectator.query('mat-progress-spinner')).toBeTruthy();

    tick(500);
    spectator.detectChanges();
    expect(spectator.query('mat-progress-spinner')).toBeFalsy();
  }));

  it('should call authentication service if the form is valid', () => {
    jest.spyOn(authServiceMock, 'login');

    const user: Omit<User, 'role'> = { username: 'aaaa', password: 'bbbb' };

    const usernameElement: HTMLInputElement | null = spectator.query(
      byTestId('username_input')
    );

    const passwordElement: HTMLInputElement | null = spectator.query(
      byTestId('password_input')
    );

    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );

    if (usernameElement && passwordElement) {
      spectator.typeInElement(user.username, usernameElement);
      spectator.typeInElement(user.password, passwordElement);
    }

    loginForm.triggerEventHandler('submit', {});

    spectator.detectChanges();

    expect(spectator.component.loginForm.invalid).toBe(false);
    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: user.username,
      password: user.password,
    });
  });
  it('should not call authentication service on submit if form is invalid', () => {
    jest.spyOn(authServiceMock, 'login');

    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );

    loginForm.triggerEventHandler('submit', {});

    spectator.detectChanges();

    expect(spectator.component.loginForm.invalid).toBe(true);
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login successfully and navigate to dashboard with correct credentials', fakeAsync(() => {
    jest
      .spyOn(authServiceMock, 'login')
      .mockImplementation(() =>
        of({ success: true, message: '' }).pipe(delay(1000))
      );

    const user: Omit<User, 'role'> = { username: 'aaaa', password: 'bbbb' };

    const usernameElement: HTMLInputElement | null = spectator.query(
      byTestId('username_input')
    );

    const passwordElement: HTMLInputElement | null = spectator.query(
      byTestId('password_input')
    );

    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );

    if (usernameElement && passwordElement) {
      spectator.typeInElement(user.username, usernameElement);
      spectator.typeInElement(user.password, passwordElement);
    }

    loginForm.triggerEventHandler('submit', {});

    tick(1000);
    spectator.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show error message on login failure', fakeAsync(() => {
    jest
      .spyOn(authServiceMock, 'login')
      .mockImplementation(() =>
        of({ success: false, message: '' }).pipe(delay(1000))
      );

    const user: Omit<User, 'role'> = { username: 'aaaa', password: 'bbbb' };

    const usernameElement: HTMLInputElement | null = spectator.query(
      byTestId('username_input')
    );

    const passwordElement: HTMLInputElement | null = spectator.query(
      byTestId('password_input')
    );

    const loginForm = spectator.fixture.debugElement.query(
      By.css('[data-testid="login_form"]')
    );

    if (usernameElement && passwordElement) {
      spectator.typeInElement(user.username, usernameElement);
      spectator.typeInElement(user.password, passwordElement);
    }

    loginForm.triggerEventHandler('submit', {});

    tick(1000);
    spectator.detectChanges();

    expect(spectator.component.invalidCredentials()).toBe(true);
    expect(spectator.query(byTestId('invalid_credentials_error'))).toBeTruthy();
  }));
});
