import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EstablishmentService } from '../../services/establishment/establishment-service';

@Component({
  selector: 'app-establishment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './establishment-form.html',
  styleUrl: './establishment-form.css'
})
export class EstablishmentForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly establishmentService = inject(EstablishmentService);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    address: [''],
    canShower: [false],
    openingHour: [new Date()],
    closingHour: [new Date()]
  });


  readonly brandId = input<number>();
  handleSubmit() {
    if (!this.form.valid) return;
    const establishmentData = this.form.getRawValue();
    
    this.establishmentService.createEstablishment({ ...establishmentData, brandId: this.brandId()! }).subscribe({  
      next: (res) => console.log('Establecimiento creado', res),
      error: (err) => console.error('Error al crear establecimiento', err)
    });
  }

}
