import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentRoutingModule } from './parent-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParentLayoutComponent } from './layout/parent-layout/parent-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, ParentLayoutComponent],
  imports: [CommonModule, ParentRoutingModule, SharedModule],
})
export class ParentModule {}
