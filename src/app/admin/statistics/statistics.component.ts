// src/app/admin/statistics/statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../core/services/statistics.service';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  loading = true;
  selectedPeriod = 'semester';
  selectedClass = 'all';

  // Statistics data
  overallStats = {
    totalAbsences: 0,
    justifiedAbsences: 0,
    unjustifiedAbsences: 0,
    totalStudents: 0,
    avgAbsencesPerStudent: 0,
  };

  chartData = {
    absencesByClass: [],
    absencesBySubject: [],
    absencesByMonth: [],
    justificationRatio: [],
  };

  // Filter options
  periods = [
    { value: 'semester', label: 'Semestre actuel' },
    { value: 'year', label: 'Année scolaire' },
    { value: 'month', label: 'Mois dernier' },
  ];

  classes = [
    { value: 'all', label: 'Toutes les classes' },
    // Will be populated from API
  ];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadStatistics();
  }

  loadClasses(): void {
    this.statisticsService.getClasses().subscribe((classes :  any[]) => {
      this.classes = [
        { value: 'all', label: 'Toutes les classes' },
        ...classes.map((c: any) => ({ value: c.id.toString(), label: c.name })),
      ];
    });
  }

  loadStatistics(): void {
    this.loading = true;

    this.statisticsService
      .getStatistics(this.selectedPeriod, this.selectedClass)
      .subscribe({
        next: (data) => {
          this.overallStats = data.overallStats;
          this.chartData = data.chartData;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading statistics', error);
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadStatistics();
  }
}
