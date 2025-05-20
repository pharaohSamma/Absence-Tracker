// src/app/teacher/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../core/services/absence.service';
import { ClassInfo } from 'src/app/interfaces/class-info';
import { AbsenceInfo } from 'src/app/interfaces/absence-info';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  classes: ClassInfo[] = [];
  absenceSummary = {
    total: 0,
    justified: 0,
    unjustified: 0
  };
  recentAbsences: AbsenceInfo[] = [];
  loading = true;

  constructor(private absenceService: AbsenceService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Get teacher's classes
    this.absenceService.getTeacherClasses().subscribe(
      (data: ClassInfo[]) => {
        this.classes = data;
        this.loading = false;
      }
    );

    // Get absence summary
    this.absenceService.getTeacherAbsenceSummary().subscribe(
      data => {
        this.absenceSummary = data;
      }
    );

    // Get recent absences
    this.absenceService.getRecentAbsences().subscribe(
      (data: AbsenceInfo[]) => {
        this.recentAbsences = data;
      }
    );
  }
}