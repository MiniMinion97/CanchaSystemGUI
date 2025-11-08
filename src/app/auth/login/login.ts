import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  readonly loginrequest = input<LoginRequest>();

  protected readonly form = this.formBuilder.nonNullable.group({
    username:["",Validators.required],
    password:["",Validators.required]
  })



  handleSubmit(){
    
    if (!this.form.valid) return;
    
    const loginrequest = this.form.getRawValue();
    this.authService.login(loginrequest).subscribe({
        next: (res) => {
        console.log('Login successful:', res);}
        ,
        error: (err) => {
        console.error('Login failed:', err);}
    });
  }

}
