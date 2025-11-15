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

  constructor(
    private http: HttpClient
  ) {
    // Verificar si el token es válido al iniciar
    this.checkTokenValidity();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe( 
        tap(res => {
          console.log('✅ Login exitoso, guardando datos...');
          
          // IMPORTANTE: Limpiar cualquier token anterior primero
          this.clearAuthData();
          
          // Guardar nuevos datos
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.id);
          
          // Actualizar signals
          this.loggedIn.set(true);
          this.role.set(res.role);
          this.username.set(res.username);
          this.clientId.set(res.id);
          
          console.log('✅ Token guardado:', res.token.substring(0, 20) + '...');
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/client/insertClient`, data); 
  }

  registerOwner(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/owner/insert`, data); 
  }

  logout(): void {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar datos
    this.clearAuthData();
    
    // Actualizar signals
    this.loggedIn.set(false);
    this.role.set('');
    this.username.set('');
    this.clientId.set(null);
    
    console.log('✅ Sesión cerrada correctamente');
  }

  // Método privado para limpiar todos los datos de autenticación
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  // Verificar si el token está expirado
  private checkTokenValidity(): void {
    const token = this.getToken();
    
    if (!token) {
      this.loggedIn.set(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      
      if (exp < now) {
        console.warn('⚠️ Token expirado al iniciar la app');
        this.clearAuthData();
        this.loggedIn.set(false);
        this.role.set('');
        this.username.set('');
        this.clientId.set(null);
      }
    } catch (error) {
      console.error('❌ Error al verificar token:', error);
      this.clearAuthData();
      this.loggedIn.set(false);
    }
  }

  // Verificar si el token expira pronto (útil para renovar)
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      return (exp - now) < fiveMinutes;
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