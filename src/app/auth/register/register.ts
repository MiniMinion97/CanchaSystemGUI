import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(Service);


  protected readonly form = this.formBuilder.nonNullable.group({
    name: ["",Validators.required],
    lastname:["",Validators.required],
    username:["",Validators.required],
    password:["",Validators.required],
    mail:["",Validators.required, Validators.email],
    cellphone:["",Validators.required]
  })

  handleSubmit(){ 
        if (this.form.invalid) return;

        const registerrequest = this.form.getRawValue()

        this.authService.register(registerrequest).subscribe

  }
}
