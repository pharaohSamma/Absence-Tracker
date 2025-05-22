// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;
    console.log('Attempting login with username:', username);

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Wait a moment for any async user loading to complete
        setTimeout(() => {
          this.loading = false;

          // Check multiple sources for user role
          const currentUser = this.authService.getCurrentUserValue();
          console.log('Current user after login:', currentUser);

          if (currentUser && currentUser.role) {
            console.log('Using role from current user:', currentUser.role);
            this.navigateBasedOnRole(currentUser.role);
          } else if (response.user && response.user.role) {
            console.log('Using role from response.user:', response.user.role);
            this.navigateBasedOnRole(response.user.role);
          } else if (response.role) {
            console.log('Using role from response root:', response.role);
            this.navigateBasedOnRole(response.role);
          } else {
            console.log('No role found, defaulting to admin dashboard');
            // Default to admin if we can't determine the role
            this.router.navigate(['/admin/dashboard']);
          }
        }, 200); // Slightly longer delay
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = error?.error?.message || 'Identifiants invalides';
        this.loading = false;
      },
    });
  }

  private navigateBasedOnRole(role: string): void {
    console.log('Navigating based on role:', role);

    switch (role.toUpperCase()) {
      case 'ADMIN':
        console.log('Redirecting to admin dashboard');
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'TEACHER':
        console.log('Redirecting to teacher dashboard');
        this.router.navigate(['/teacher/dashboard']);
        break;
      case 'STUDENT':
        console.log('Redirecting to student dashboard');
        this.router.navigate(['/student/dashboard']);
        break;
      case 'PARENT':
        console.log('Redirecting to parent dashboard');
        this.router.navigate(['/parent/dashboard']);
        break;
      default:
        console.log('Unknown role, defaulting to admin dashboard:', role);
        this.router.navigate(['/admin/dashboard']);
    }
  }
}
