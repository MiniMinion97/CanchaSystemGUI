import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  role = signal<string>(localStorage.getItem('role') || '');
  username = signal<string>(localStorage.getItem('username') || '');
  clientId = signal<string | null>(localStorage.getItem('userId'));

  private tokenExpiredAlertShown = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenValidity();
    
    // Verificar cada minuto
    setInterval(() => {
      this.checkTokenValidity(true);
    }, 60000);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe( 
        tap(res => {

          this.tokenExpiredAlertShown = false;
          
          this.clearAuthData();
          
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.id);
          
          this.loggedIn.set(true);
          this.role.set(res.role);
          this.username.set(res.username);
          this.clientId.set(res.id);
          
          
          // Verificar inmediatamente la validez del nuevo token
          this.checkTokenValidity();
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    this.tokenExpiredAlertShown = false;
    return this.http.post(`${this.apiUrl}/client/insertClient`, data); 
  }

  registerOwner(data: RegisterRequest): Observable<any> {
    this.tokenExpiredAlertShown = false;
    return this.http.post(`${this.apiUrl}/owner/insert`, data); 
  }

  logout(): void {
    this.clearAuthData();
    this.loggedIn.set(false);
    this.role.set('');
    this.username.set('');
    this.clientId.set(null);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  private checkTokenValidity(showAlert: boolean = false): void {
    
    const token = this.getToken();
    
    if (!token) {
      this.handleExpiredToken(showAlert);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // ✅ CORREGIDO: multiplicar por 1000, no 1000000
      const now = Date.now();
     
      if (exp < now) {
        this.handleExpiredToken(showAlert);
      } 
    } catch (error) {
      this.handleExpiredToken(showAlert);
    }
  }

  private handleExpiredToken(showAlert: boolean): void {
    
    if (showAlert && !this.tokenExpiredAlertShown) {
      alert('⚠️ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.tokenExpiredAlertShown = true;
    }

    this.logout();
    this.router.navigateByUrl('/explorar');
  }

  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // ✅ CORREGIDO
      const now = Date.now();
      const fiveMinutes = 1 * 60 * 1000;
      
      const expiringSoon = (exp - now) < fiveMinutes;
      
      return expiringSoon;
    } catch (error) {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getCurrentClientId(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }
}