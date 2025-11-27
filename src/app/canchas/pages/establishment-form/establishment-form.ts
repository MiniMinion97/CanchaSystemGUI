import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { EstablishmentRequest } from '../../models/establishment-request';

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
  readonly estData = input<EstablishmentRequest>();
  readonly isEditing = input(false);
  readonly estEdited = output<EstablishmentRequest>();
  readonly estId = input<number>();



     constructor() {
    effect(() => {
      if (this.isEditing() && this.estData()) {
        this.form.patchValue(this.estData()!);
      }
    });
  }

  handleSubmit() {
    if (!this.form.valid) return;
    const establishmentData = this.form.getRawValue();
    
    console.log("🟡 Enviando establecimiento al backend:", establishmentData);

    if (this.isEditing()) {
      this.establishmentService.updateEstablishment(this.estId()!, { ...establishmentData, brandId: this.brandId()! }).subscribe({
        next: (res) => {
          console.log('Establecimiento actualizado', res);
          alert('Establecimiento actualizado con éxito');
          this.estEdited.emit(res);
        },
        error: (err) => {
          console.error('Error al actualizar establecimiento', err)
          alert('Error al actualizar el establecimiento');
        }
      });
      return;
    }else{
          this.establishmentService.createEstablishment({ ...establishmentData, brandId: this.brandId()! }).subscribe({  
      next: (res) => alert('Establecimiento creado con éxito'),
      error: (err) => {
        console.error('Error al crear establecimiento', err)
        alert('Error al crear el establecimiento');
      }
    });
    }

  }

}
