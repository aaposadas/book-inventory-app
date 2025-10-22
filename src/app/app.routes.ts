import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard, publicOnlyGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard], // Protect home route
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicOnlyGuard], // Redirect to home if already logged in
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicOnlyGuard], // Redirect to home if already logged in
  },
  {
    path: '**',
    redirectTo: '', // Redirect unknown routes to home
  },
];
