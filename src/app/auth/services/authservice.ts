import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
  id: string;
} 

export interface RegisterRequest {
  name: string;
  lastName: string;
  username: string;
  password: string;
  mail: string;
  cellNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; 
  
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));
  role = signal<string>(localStorage.getItem('role')!);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe( 
        tap(res => {
          // Save token 
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.id); 
          this.loggedIn.set(true);
          this.role.set(res.role); // te falto esto Ian para actualizar el role signal
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/client/insertClient`, data)
    .pipe(
      tap(() => this.loggedIn.set(true))
    ); 
  }

  registerOwner(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/owner/insert`, data)
    .pipe(
      tap(() => this.loggedIn.set(true))
    ); 
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.set(false);
  }

  

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
