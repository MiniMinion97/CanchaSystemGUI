import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/authservice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginrequest = input<LoginRequest>();

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ["", Validators.required],
    password: ["", [Validators.required,Validators.minLength(2)]]
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  handleSubmit() {
    if (!this.form.valid) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const loginrequest = this.form.getRawValue();
    
    this.authService.login(loginrequest).subscribe({
      next: (res) => {
        console.log('✅ Login exitoso');
        
        // El AuthService ya guarda todo automáticamente
        // Solo redirigir según el rol
        const role = this.authService.getRole();
        
        
        if (role === 'OWNER') {
          this.router.navigate(['/owner-dashboard']);
        } else if (role === 'CLIENT') {
          this.router.navigate(['/explorar']);
        } else {
          this.router.navigate(['/explorar']);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Login fallido:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }

  hasError() {
    return this.errorMessage !== '';
  }

  // NUEVO: Método para logout
  logout() {
    // Limpiar todo el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // O limpiar todo de una vez
    // localStorage.clear();
    
    // Redirigir al login
    this.router.navigate(['/explorar']);
  }
}