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
    private authService: AuthService
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

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false;

        // Wait a moment for user data to be set, then navigate
        setTimeout(() => {
          const currentUser = this.authService.getCurrentUserValue();

          if (currentUser && currentUser.role) {
            this.navigateBasedOnRole(currentUser.role);
          } else if (response.user && response.user.role) {
            this.navigateBasedOnRole(response.user.role);
          } else if (response.role) {
            this.navigateBasedOnRole(response.role);
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
        }, 200);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = error?.error?.message || 'Identifiants invalides';
        this.loading = false;
      },
    });
  }

  private navigateBasedOnRole(role: string): void {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']).then((success) => {});
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher/dashboard']).then((success) => {});
        break;
      case 'STUDENT':
        this.router.navigate(['/student/dashboard']).then((success) => {});
        break;
      case 'PARENT':
        this.router.navigate(['/parent/dashboard']).then((success) => {});
        break;
      default:
        this.router.navigate(['/admin/dashboard']);
    }
  }
}
