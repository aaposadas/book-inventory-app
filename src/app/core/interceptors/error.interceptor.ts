import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - authentication errors
        if (error.status === 401) {
          this.handle401Error();
        }
        // Handle 403 Forbidden - authorization errors
        else if (error.status === 403) {
          this.handle403Error();
        }
        // Handle 500 Server Error
        else if (error.status === 500) {
          this.handle500Error(error);
        }
        // Handle network/connection errors
        else if (error.status === 0) {
          this.handleNetworkError();
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(): void {
    // Only logout if user is currently authenticated
    // This prevents logout on failed login attempts
    if (this.authService.isAuthenticated()) {
      console.warn('Authentication error - token expired or invalid');
      this.authService.logout();

      // Show alert if not on login page
      if (!this.router.url.includes('/login')) {
        alert('Your session has expired. Please login again.');
      }
    }
  }

  private handle403Error(): void {
    console.warn('Authorization error - insufficient permissions');
    alert('You do not have permission to access this resource.');
  }

  private handle500Error(error: HttpErrorResponse): void {
    console.error('Server error:', error);
    alert('A server error occurred. Please try again later.');
  }

  private handleNetworkError(): void {
    console.error('Network error - unable to reach server');
    alert('Unable to connect to the server. Please check your internet connection.');
  }
}
