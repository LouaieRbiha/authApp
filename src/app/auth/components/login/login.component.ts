import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    MatIconModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  loading = false;
  isPasswordVisible = false;
  invalidCredentials = false;

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

  onSubmit() {
    this.invalidCredentials = false;
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) return;

    this.loading = true;

    this.#authService.login(this.loginForm.value).subscribe((res) => {
      this.loading = false;
      this.invalidCredentials = !res.success;
      if (res.success) this.#router.navigate(['/dashboard']);
    });
  }
}
