import { Role, User } from '../models/user.interface';

export const fakeDb: User[] = [
  { username: 'admin', password: 'admin', role: Role.ADMIN },
  { username: 'user', password: 'user', role: Role.USER },
];
