import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorAlert } from '../../../shared/components/error-alert/error-alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ErrorAlert],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Get return URL from query params or default to '/'
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading.set(false);

        // More specific error messages
        if (err.status === 401) {
          this.errorMessage.set('Invalid email or password');
        } else if (err.status === 0) {
          this.errorMessage.set('Cannot connect to server. Please try again.');
        } else {
          this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        }
      },
    });
  }
}
