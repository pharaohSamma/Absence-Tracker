// src/app/core/services/schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/schedule`;

  constructor(private http: HttpClient) {}

  getSchedule(date: Date): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?date=${date.toISOString().split('T')[0]}`
    );
  }
}
