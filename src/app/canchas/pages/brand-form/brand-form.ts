import { Component, effect, inject, input, Input, output } from '@angular/core';
import { BrandService } from '../../services/brand/brand-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandRequest } from '../../models/brand-request';
import { CommonModule } from '@angular/common';
import { Action } from 'rxjs/internal/scheduler/Action';

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
  readonly isEditing = input(false);
  readonly brandEdited = output<BrandRequest>();
  readonly brandId = input<number>();
  protected readonly form = this.formBuilder.nonNullable.group({
      brandName:["",[Validators.required,Validators.minLength(3)]],
      active: [true, Validators.required]
    })


   constructor() {
    effect(() => {
      if (this.isEditing() && this.brandData()) {
        this.form.patchValue(this.brandData()!);
      }
    });
  }


  handleSubmit() {
    if (!this.form.valid) return;

    const brandData = this.form.getRawValue();
    const ownerId = localStorage.getItem('userId')!;
    const brandDataWithOwner = { ...brandData, ownerId };
    if (this.isEditing() && this.brandId()) {
          alert(ownerId);

  this.brandService.updateBrand(this.brandId()!, {
    ...brandData, ownerId
  }).subscribe({
  next: (res) => {
    console.log('Marca actualizada', res);
    this.brandEdited.emit(res);
    
  },
  error: (err) => console.error('Error al actualizar marca', err)
});
}
else{
        this.brandService.createBrand({
          ...brandData, ownerId
        }).subscribe({
        next: (res) => console.log('marca creada', res),
        error: (err) => console.error('error al crear marca', err)
        });
    }    

   
}

}
