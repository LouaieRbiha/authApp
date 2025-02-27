import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
import { first } from 'rxjs';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  loading = signal(false);
  isPasswordVisible = signal(false);
  invalidCredentials = signal(false);

  loginForm = new FormGroup<LoginForm>({
    username: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  fillForm() {
    this.loginForm.setValue({ username: 'user', password: 'user' });
  }

  onSubmit() {
    this.invalidCredentials.set(false);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
      return;
    }

    this.loading.set(true);

    this.#authService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe((res) => {
        this.loading.set(false);
        this.invalidCredentials.set(!res.success);
        if (res.success) this.#router.navigate(['/dashboard']);
      });
  }
}
