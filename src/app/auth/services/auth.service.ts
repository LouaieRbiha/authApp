import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { fakeDb } from '../utils/fakeDb';
import { Response } from 'src/app/shared/models/response.interface';
import { Router } from '@angular/router';

type authPayload = Partial<Omit<User, 'role'>>;
type loggedUser = Omit<User, 'password'>;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #router = inject(Router);
  readonly #loggedUser = new BehaviorSubject<loggedUser | null>(null);

  loggedUser$ = this.#loggedUser.asObservable();

  public get loggedUser(): loggedUser | null {
    return this.#loggedUser.value;
  }

  public set loggedUser(value: loggedUser | null) {
    this.#loggedUser.next(value);
  }

  login(payload: authPayload): Observable<Response<User | null>> {
    this.loggedUser = null;

    const user = fakeDb.find(
      (user) =>
        user.username === payload.username && user.password === payload.password
    );

    if (user) {
      this.loggedUser = user;
      return of({
        success: true,
        message: `${user.username} is logged in successfully`,
      }).pipe(delay(1000));
    }

    return of({
      success: false,
      message: `Invalid credentials`,
    }).pipe(delay(1000));
  }

  logout() {
    this.loggedUser = null;
    this.#router.navigate(['/auth/login']);
  }
}
