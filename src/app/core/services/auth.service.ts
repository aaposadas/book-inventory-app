import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: UserInfo;
}

export interface RegisterResponse {
  user: UserInfo;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public currentUser = signal<AuthUser | null>(null);
  public isAuthenticated = computed(() => !!this.currentUser());
  // Store intended URL before login
  public redirectUrl: string | null = null; // ADD THIS

  // Token refresh timer
  private tokenRefreshInterval?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      try {
        const user = JSON.parse(userJson) as AuthUser;
        this.setCurrentUser(user);

        // Start token refresh timer
        this.startTokenRefreshTimer();
      } catch (error) {
        console.error('Failed to parse stored user', error);
        this.clearAuth();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}/auth/login`,
        credentials,
        { withCredentials: true } // Send/receive cookies
      )
      .pipe(
        tap((response) => {
          const user: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            name: `${response.user.firstName} ${response.user.lastName}`,
          };
          this.setAuth(user);
          // Redirect to intended page or home
          const redirect = this.redirectUrl || '/';
          this.redirectUrl = null;
          this.router.navigate([redirect]);
        }),
        catchError((error) => {
          console.error('Login failed', error);
          throw error;
        })
      );
  }

  register(credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `${environment.apiUrl}/auth/register`,
        credentials,
        { withCredentials: true } // Send/receive cookies
      )
      .pipe(
        tap((response) => {
          const user: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            name: `${response.user.firstName} ${response.user.lastName}`,
          };
          this.setAuth(user);
        }),
        catchError((error) => {
          console.error('Registration failed', error);
          throw error;
        })
      );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          // Cookie is automatically updated by backend
          // Update user info in case it changed
          const user: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            name: `${response.user.firstName} ${response.user.lastName}`,
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }),
        catchError((error) => {
          console.error('Token refresh failed', error);
          // Don't automatically logout here - let the interceptor handle 401s
          throw error;
        })
      );
  }

  private startTokenRefreshTimer(): void {
    // Clear any existing timer
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }

    // Refresh token every 30 minutes (token expiry is 60 minutes)
    // Backend will only issue new token if current one is close to expiring
    this.tokenRefreshInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        this.refreshToken().subscribe({
          next: () => {
            console.log('Token refreshed successfully');
          },
          error: (error) => {
            console.error('Failed to refresh token', error);
            // If refresh fails with 401, the interceptor will handle logout
          },
        });
      }
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  logout(): void {
    // Call backend logout endpoint to clear cookie
    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
        // Clear auth anyway even if API call fails
        this.clearAuth();
        this.router.navigate(['/login']);
      },
    });
  }

  /**
   * Set authentication data
   */
  private setAuth(user: AuthUser): void {
    // Only store user info - token is in httpOnly cookie
    localStorage.setItem('user', JSON.stringify(user));
    this.setCurrentUser(user);

    // Start refresh timer
    this.startTokenRefreshTimer();
  }

  private setCurrentUser(user: AuthUser): void {
    this.currentUser.set(user);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);

    // Clear refresh timer
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = undefined;
    }
  }
}
