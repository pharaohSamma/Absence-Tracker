// src/app/schedule/view-schedule/view-schedule.component.ts
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { ScheduleEvent } from 'src/app/interfaces/schedule-event';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css'],
})
export class ViewScheduleComponent implements OnInit {
  schedule: any[] = [];
  currentWeek = new Date();
  loading = true;
  userRole: string = '';
  private destroy$ = new Subject<void>();
  daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .getUserRole()
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => {
        this.userRole = role || ''; // Handle null by providing default empty string
        this.loadSchedule();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  hasRole(role: string): boolean {
    return this.userRole === role;
  }
  isRoleLoaded(): boolean {
    return this.userRole !== '';
  }
  loadSchedule(): void {
    if (!this.userRole) {
      return; // Don't load if no role is set
    }
  }
  loadScheduleData(): void {
    this.loading = true;

    // Get schedule based on user role
    this.scheduleService.getSchedule(this.currentWeek).subscribe({
      next: (data) => {
        this.schedule = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading schedule', error);
        this.loading = false;
      },
    });
  }
  previousWeek(): void {
    const date = new Date(this.currentWeek);
    date.setDate(date.getDate() - 7);
    this.currentWeek = date;
    this.loadScheduleData();
  }

  nextWeek(): void {
    const date = new Date(this.currentWeek);
    date.setDate(date.getDate() + 7);
    this.currentWeek = date;
    this.loadScheduleData();
  }

  getEventsForTimeAndDay(time: string, day: string): ScheduleEvent[] {
    return this.schedule.filter(
      (event) =>
        event.day === day && event.startTime <= time && event.endTime > time
    );
  }
  resetToCurrentWeek(): void {
    this.currentWeek = new Date();
    this.loadScheduleData();
  }
}
