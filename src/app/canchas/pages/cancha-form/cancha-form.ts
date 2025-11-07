import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CanchaService } from '../../services/cancha/cancha-service';

@Component({
  selector: 'app-cancha-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cancha-form.html',
  styleUrl: './cancha-form.css'
})
export class CanchaForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly canchaService = inject(CanchaService);
  protected readonly form = this.formBuilder.nonNullable.group({
    totalAmount: [0],
    hasRoof: [false],
    canchaType: [''],
    working: [false]
  });

  readonly establishmentId = input<number>();
  handleSubmit() {
    if (!this.form.valid) return;
    const canchaData = this.form.getRawValue();
      this.canchaService.createCancha({ ...canchaData, establishmentId: this.establishmentId()! }).subscribe({  
      next: (res) => console.log('Establecimiento creado', res),
      error: (err) => console.error('Error al crear establecimiento', err)
    });
  }
}
