// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { User } from 'src/app/interfaces/user';
import { LoginResponse } from 'src/app/interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // Don't automatically load profile on startup if it's failing
    // We'll handle this differently
  }

  login(username: string, password: string): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {

          if (response && response.token) {
            // Save token first
            this.tokenService.saveToken(response.token);
            // Check if user data is in the response
            if (response.user) {
              this.currentUserSubject.next(response.user);
            } else if (response.username && response.role) {
              // Sometimes the user data is at the root level of the response
              const user: User = {
                id: response.id || 1,
                username: response.username,
                email: response.email,
                name: response.username,
                role: response.role as
                  | 'ADMIN'
                  | 'TEACHER'
                  | 'STUDENT'
                  | 'PARENT',
                firstName: response.firstName,
                lastName: response.lastName,
              };
              console.log('Creating user from root level response data:', user);
              this.currentUserSubject.next(user);
            } else {
              console.log(
                'No user data in response, will try to load from profile endpoint'
              );
              // Try to load from profile, but don't fail the login if it doesn't work
              this.loadUserProfile().subscribe({
                next: (user) => {
                  if (user) {
                    console.log('Profile loaded successfully after login');
                  } else {
                    console.log(
                      'Profile loading failed, but login was successful'
                    );
                  }
                },
                error: (error) => {
                  console.error(
                    'Profile loading failed after login, but continuing anyway:',
                    error
                  );
                  // Create a minimal user object if we can't load the profile
                  this.createFallbackUser(username);
                },
              });
            }
          } else {
            console.error('No token in login response');
          }
        }),
        catchError((error) => {
          console.error('Login API error:', error);
          return throwError(() => error);
        })
      );
  }

  private createFallbackUser(username: string): void {
    // Create a fallback user when we can't load from the profile endpoint
    // You might want to decode the JWT token to get this info
    const fallbackUser: User = {
      id: 1,
      username: username,
      name: username,
      role: 'ADMIN', // Default role - you might want to decode this from the JWT
      firstName: '',
      lastName: '',
    };
    console.log('Creating fallback user:', fallbackUser);
    this.currentUserSubject.next(fallbackUser);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    console.log('User logged out, currentUser set to null');
  }

  isLoggedIn(): boolean {
    const hasToken = this.tokenService.hasToken();
    console.log('isLoggedIn check - hasToken:', hasToken);
    return hasToken;
  }

  loadUserProfile(): Observable<User | null> {
    if (!this.tokenService.hasToken()) {
      console.log('No token found, cannot load user profile');
      return of(null);
    }

    console.log('Loading user profile from API...');
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => {
        console.log('User profile loaded from API:', user);
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        console.error('Error loading user profile:', error);
        // Don't logout on profile loading error - the token might still be valid
        // Just return null and let the app continue
        return of(null);
      })
    );
  }

  getUserRole(): Observable<string | null> {
    console.log(
      'getUserRole called, current user value:',
      this.currentUserSubject.value
    );
    return this.currentUser$.pipe(
      map((user) => {
        const role = user ? user.role : null;
        console.log('Getting role for user:', user, 'role:', role);
        return role;
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserValue(): User | null {
    const user = this.currentUserSubject.value;
    console.log('getCurrentUserValue called, returning:', user);
    return user;
  }

  getCurrentRole(): string | null {
    const user = this.getCurrentUserValue();
    const role = user ? user.role : null;
    console.log('getCurrentRole called, user:', user, 'role:', role);
    return role;
  }

  setCurrentUser(user: User): void {
    console.log('Manually setting current user:', user);
    this.currentUserSubject.next(user);
  }

  // Method to decode JWT and extract user info (optional)
  private decodeToken(): User | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token payload:', payload);

      // Extract user info from token payload
      return {
        id: payload.sub || payload.id || 1,
        username: payload.username || payload.sub,
        name: payload.name || payload.username,
        role: payload.role || 'ADMIN',
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
