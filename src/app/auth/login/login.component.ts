// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => {
          this.authService.getUserRole().subscribe(role => {
            switch(role) {
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
          });
        },
        error: error => {
          this.error = error?.error?.message || 'Identifiants invalides';
          this.loading = false;
        }
      });
  }
}