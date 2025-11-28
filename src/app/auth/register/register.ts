import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../services/authservice';
import { Login } from '../login/login';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  errorMessage: string = '';

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ["",Validators.required],
    lastName:["",Validators.required],
    username:["",Validators.required],
    password:["",[Validators.required,Validators.minLength(2)]],
    mail:["",[Validators.required, Validators.email]],
    cellNumber:["",Validators.required]
  })

  shiftPressed = false;

  setShift(e: MouseEvent) {
    this.shiftPressed = e.shiftKey;
  }
  
  handleSubmit() {
    if (this.form.invalid) return;

    const registerrequest = this.form.getRawValue()

    let obs;

    if (this.shiftPressed) {
      obs = this.authService.registerOwner(registerrequest);
    } else {
      obs = this.authService.register(registerrequest)
    }

    obs.subscribe({
          next: (res) => {
            this.errorMessage = '';
            this.authService.login({ username: registerrequest.username, password: registerrequest.password }).subscribe({
              next: () => {
                
                const role = this.authService.getRole();
                
                if (role === 'OWNER') {
                  this.router.navigate(['/owner-dashboard']);
                } else if (role === 'CLIENT') {
                  this.router.navigate(['/explorar']);
                } else {
                  this.router.navigate(['/explorar']);
                }
              },
              error: (err) => {
                console.error('❌ Login fallido:', err);
              }
            });
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.errorMessage = err.error?.error;
          }
      });
  }

  hasError() {
    return this.errorMessage !== '';
  }
}

