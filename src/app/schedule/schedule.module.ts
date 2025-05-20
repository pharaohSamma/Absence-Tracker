import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';

@NgModule({
  declarations: [ViewScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleRoutingModule,
  ],
})
export class ScheduleModule {}
