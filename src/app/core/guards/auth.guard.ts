// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (user) {
          const role = user.role;
          if (role) {
            // Check if user has access to this route
            const expectedRoles = route.data?.['roles'] as Array<string>;
            if (expectedRoles && !expectedRoles.includes(role)) {
              this.redirectBasedOnRole(role);
              return false;
            }
            return true;
          }
        }

        // Not logged in or no role, redirect to login
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
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
        this.router.navigate(['/']);
    }
  }
}
