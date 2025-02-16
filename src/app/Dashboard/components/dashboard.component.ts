import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, AsyncPipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly #authService = inject(AuthService);
  readonly user$ = this.#authService.loggedUser$;

  logout() {
    this.#authService.logout();
  }
}
