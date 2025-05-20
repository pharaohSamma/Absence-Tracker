// src/app/student/absence-history/absence-history.component.ts
import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../core/services/absence.service';
import { Absence } from 'src/app/interfaces/absence';

@Component({
  selector: 'app-absence-history',
  templateUrl: './absence-history.component.html',
  styleUrls: ['./absence-history.component.css'],
})
export class AbsenceHistoryComponent implements OnInit {
  absences: Absence[] = [];
  loading = true;
  selectedPeriod = 'all';
  periods = [
    { value: 'all', label: "Toute l'année" },
    { value: 'semester1', label: '1er semestre' },
    { value: 'semester2', label: '2ème semestre' },
    { value: 'lastMonth', label: 'Dernier mois' },
  ];

  constructor(private absenceService: AbsenceService) {}

  ngOnInit(): void {
    this.loadAbsences();
  }

  loadAbsences(): void {
    this.loading = true;
    this.absenceService.getStudentAbsences(this.selectedPeriod).subscribe({
      next: (data) => {
        this.absences = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading absences', error);
        this.loading = false;
      },
    });
  }

  onPeriodChange(): void {
    this.loadAbsences();
  }

  getAbsencesStats(): any {
    const total = this.absences.length;
    const justified = this.absences.filter((a) => a.justified).length;
    const unjustified = total - justified;

    return {
      total,
      justified,
      unjustified,
      justifiedPercentage:
        total > 0 ? Math.round((justified / total) * 100) : 0,
      unjustifiedPercentage:
        total > 0 ? Math.round((unjustified / total) * 100) : 0,
    };
  }
}
