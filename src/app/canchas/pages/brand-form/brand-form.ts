import { Component, inject, input, Input } from '@angular/core';
import { BrandService } from '../../services/brand/brand-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandRequest } from '../../models/brand-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css'
})
export class BrandForm {
  private readonly brandService = inject(BrandService);
  private readonly formBuilder = inject(FormBuilder);
  readonly brandData = input<BrandRequest>();
  protected readonly form = this.formBuilder.nonNullable.group({
      brandName:["",Validators.required],
    })


    handleSubmit() {
  if (!this.form.valid) return;

  const brandData = this.form.getRawValue();
  const ownerId = localStorage.getItem('userId')!;

  this.brandService.createBrand({ ...brandData, ownerId }).subscribe({
    next: (res) => console.log('marca creada', res),
    error: (err) => console.error('error al crear marca', err)
  });
}

}
