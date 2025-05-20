// src/app/core/services/absence.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private apiUrl = `${environment.apiUrl}/absences`;

  constructor(private http: HttpClient) {}

  // Teacher methods
  getTeacherClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teacher/classes`);
  }

  getTeacherAbsenceSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teacher/summary`);
  }

  getRecentAbsences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teacher/recent`);
  }

  recordAbsences(absenceData: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/record`, absenceData);
  }

  // Student methods
  getStudentAbsences(period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student?period=${period}`);
  }

  requestJustification(
    absenceId: number,
    reason: string,
    documentId?: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${absenceId}/justify`, {
      reason,
      documentId,
    });
  }

  // Parent methods
  getChildrenAbsences(period: string, childId?: number): Observable<any[]> {
    let url = `${this.apiUrl}/parent?period=${period}`;
    if (childId) {
      url += `&childId=${childId}`;
    }
    return this.http.get<any[]>(url);
  }

  // Admin methods
  getAllAbsences(params: any): Observable<any[]> {
    // Convert params object to query string
    const queryParams = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return this.http.get<any[]>(`${this.apiUrl}/admin?${queryParams}`);
  }

  approveJustification(absenceId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${absenceId}/approve`, {});
  }

  rejectJustification(absenceId: number, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${absenceId}/reject`, {
      reason,
    });
  }
}
