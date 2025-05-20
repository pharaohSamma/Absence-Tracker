// src/app/core/services/class.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) { }

  getClassDetails(classId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${classId}`);
  }

  getStudentsInClass(classId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${classId}/students`);
  }
}
