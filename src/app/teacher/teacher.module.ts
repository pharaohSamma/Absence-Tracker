import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordAbsencesComponent } from './record-absences/record-absences.component';

@NgModule({
  declarations: [DashboardComponent, RecordAbsencesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeacherRoutingModule,
  ],
})
export class TeacherModule {}
