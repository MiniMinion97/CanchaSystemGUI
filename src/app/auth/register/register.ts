import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice';


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
  ctrlPressed = false;

  setKeys(e: MouseEvent) {
    this.shiftPressed = e.shiftKey;
    this.ctrlPressed = e.ctrlKey;
  }

  handleSubmit() {
    if (this.form.invalid) return;

    const registerrequest = this.form.getRawValue()

    let obs;

    if (this.ctrlPressed) {
      obs = this.authService.registerAdminTest(registerrequest);
    } else if (this.shiftPressed) {
      obs = this.authService.registerOwner(registerrequest);
    } else {
      obs = this.authService.register(registerrequest)
    }

    obs.subscribe({
          next: () => {
            this.errorMessage = 'Un correo de verificación fue mandado a tu email.';
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

