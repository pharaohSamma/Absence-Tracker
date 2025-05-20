import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbsenceHistoryComponent } from './absence-history/absence-history.component';

@NgModule({
  declarations: [DashboardComponent, AbsenceHistoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
  ],
})
export class StudentModule {}
