import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../services/authservice';


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


  protected readonly form = this.formBuilder.nonNullable.group({
    name: ["",Validators.required],
    lastName:["",Validators.required],
    username:["",Validators.required],
    password:["",[Validators.required,Validators.minLength(2)]],
    mail:["",[Validators.required, Validators.email]],
    cellNumber:["",Validators.required]
  })

  handleSubmit(){ 
        if (this.form.invalid) return;
        console.log("Formulario válido");
        const registerrequest = this.form.getRawValue()

        this.authService.registerOwner(registerrequest).subscribe({
            next: (res) => {
            console.log('Registration successful:', res);}
            ,
            error: (err) => {
            console.error('Registration failed:', err);}
        });


/*
        this.authService.register(registerrequest).subscribe({
            next: (res) => {
            console.log('Registration successful:', res);}
            ,
            error: (err) => {
            console.error('Registration failed:', err);}
        });
*/
  }


  
      }

