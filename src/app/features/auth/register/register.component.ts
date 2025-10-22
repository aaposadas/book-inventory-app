import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // adjust path if needed
import { ErrorAlert } from '../../../shared/components/error-alert/error-alert';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorAlert],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService
      .register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Registration failed';
        },
      });
  }
}
