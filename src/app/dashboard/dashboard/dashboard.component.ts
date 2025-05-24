// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Redirection vers votre espace...</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect to role-specific dashboard
    const user = this.authService.getCurrentUserValue();
    
    if (user?.role) {
      switch (user.role) {
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
          this.router.navigate(['/admin/dashboard']);
      }
    } else {
      // If no user, redirect to login
      this.router.navigate(['/auth/login']);
    }
  }
}