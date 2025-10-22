import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private authService = inject(AuthService);

  // Expose signals directly - no getters needed
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
