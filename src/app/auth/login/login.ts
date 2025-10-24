import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../service';
import { LoginRequest } from '../service';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(Service);

  //readonly loginrequest = input<LoginRequest>();

  protected readonly form = this.formBuilder.nonNullable.group({
    username:["",Validators.required],
    password:["",Validators.required]
  })



  handleSubmit(){
    if (this.form.invalid) return;


    const loginrequest = this.form.getRawValue();
    this.authService.login(loginrequest).subscribe
  }

}
