// src/app/teacher/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Tableau de bord Enseignant</h1>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Bonjour {{ getUserName() }}!</h2>
        <p class="text-gray-600">Bienvenue dans votre espace enseignant.</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    console.log('Teacher dashboard loaded');
  }

  getUserName(): string {
    const user = this.authService.getCurrentUserValue();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || 'Enseignant';
  }
}