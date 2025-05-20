// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check for role authorization if specified
    if (route.data['roles']) {
      return this.authService.getUserRole().pipe(
        take(1),
        map((role) => {
          const authorized = route.data['roles'].includes(role);
          if (!authorized) {
            // Redirect based on actual role
            this.redirectBasedOnRole(role);
          }
          return authorized;
        })
      );
    }

    return true;
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher/dashboard']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'PARENT':
        this.router.navigate(['/parent/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
