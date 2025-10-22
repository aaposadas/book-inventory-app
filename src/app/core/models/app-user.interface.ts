export interface AppUser {
  email: string;
  name: string;
  token?: string; // JWT after login
}
