// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userService: UserService
  ) {
    // Check if user is logged in on startup
    const token = this.tokenService.getToken();
    if (token) {
      this.loadUserProfile().subscribe();
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.tokenService.saveToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  loadUserProfile(): Observable<any> {
    return this.userService.getCurrentUser().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  getUserRole(): Observable<string> {
    return this.currentUser$.pipe(
      map(user => user ? user.role : null)
    );
  }
}