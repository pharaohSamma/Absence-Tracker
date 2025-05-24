// src/app/teacher/teacher.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherLayoutComponent } from './layout/teacher-layout/teacher-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, TeacherLayoutComponent],
  imports: [CommonModule, TeacherRoutingModule, RouterModule, SharedModule],
})
export class TeacherModule {}
