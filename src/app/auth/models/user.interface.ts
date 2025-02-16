export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface User {
  username: string;
  password: string;
  role: Role;
}
