import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbsenceHistoryComponent } from './absence-history/absence-history.component';
import { StudentLayoutComponent } from './layout/student-layout/student-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AbsenceHistoryComponent,
    StudentLayoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    SharedModule,
  ],
})
export class StudentModule {}
