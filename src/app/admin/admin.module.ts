import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [DashboardComponent, StatisticsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminRoutingModule],
})
export class AdminModule {}
