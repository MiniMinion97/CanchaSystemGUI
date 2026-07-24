
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authservice';

type RecoveryStep = 'username' | 'code' | 'newPassword' | 'success';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recovery.html',
  styleUrl: './recovery.css'
})
export class Recovery {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly step = signal<RecoveryStep>('username');
  protected readonly isLoading = signal(false);
  protected readonly hasError = signal(false);
  protected errorMessage = '';

  private validatedUsername = '';
  private validatedCode = '';

  protected usernameForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]]
  });

  protected codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  protected passwordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatchValidator });

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  protected submitUsername(): void {
    if (this.usernameForm.invalid) {
      this.usernameForm.markAllAsTouched();
      return;
    }

    this.clearError();
    this.isLoading.set(true);

    const username = this.usernameForm.value.username;

    this.authService.requestPasswordReset(username).subscribe({
      next: () => {
        this.validatedUsername = username;
        this.isLoading.set(false);
        this.step.set('code');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showError(err.error?.message || 'El usuario no existe o hubo un error. Intenta nuevamente.');
      }
    });
  }

  protected submitCode(): void {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.clearError();
    this.isLoading.set(true);

    const code = this.codeForm.value.code;

    this.authService.verifyResetCode(this.validatedUsername, code).subscribe({
      next: () => {
        this.validatedCode = code;
        this.isLoading.set(false);
        this.step.set('newPassword');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showError(err.error?.message || 'El código ingresado es incorrecto.');
      }
    });
  }

  protected submitNewPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.clearError();
    this.isLoading.set(true);

    const newPassword = this.passwordForm.value.newPassword;

    this.authService.resetPassword(this.validatedUsername, this.validatedCode, newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set('success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showError(err.error?.message || 'No se pudo actualizar la contraseña. Intenta nuevamente.');
      }
    });
  }

  protected cancel(): void {
    this.router.navigateByUrl('/explorar');
  }

  protected goToLogin(): void {
    this.router.navigateByUrl('/explorar');
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.hasError.set(true);
  }

  private clearError(): void {
    this.hasError.set(false);
    this.errorMessage = '';
  }
}