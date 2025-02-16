import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { fakeDb } from '../utils/fakeDb';
import { Response } from 'src/app/shared/models/response.interface';

type authPayload = Partial<Omit<User, 'role'>>;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(payload: authPayload): Observable<Response<User | null>> {
    const user = fakeDb.find(
      (user) =>
        user.username === payload.username && user.password === payload.password
    );

    if (user) {
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
}
