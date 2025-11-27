import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { EstablishmentRequest } from '../../models/establishment-request';

// Validador que verifica si el input time tiene valor real (no el placeholder --:--)
function timeInputRequired(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  // Si el input está vacío o es el valor por defecto
  if (!value || value === '') {
    return { required: true };
  }
  
  return null;
}

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
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', Validators.required],
    canShower: [false, Validators.required],
    openingHour: ['', timeInputRequired],  // String vacío para validar correctamente
    closingHour: ['', timeInputRequired]   // String vacío para validar correctamente
  });
  
  readonly brandId = input<number>();
  readonly estData = input<EstablishmentRequest>();
  readonly isEditing = input(false);
  readonly estEdited = output<EstablishmentRequest>();
  readonly estId = input<number>();

  constructor() {
    effect(() => {
      if (this.isEditing() && this.estData()) {
        const data = this.estData()!;
        // Si vienen como Date desde el backend, convertirlos a string para el formulario
        this.form.patchValue({
          name: data.name,
          address: data.address,
          canShower: data.canShower,
          openingHour: typeof data.openingHour === 'string' ? data.openingHour : this.dateToTimeString(data.openingHour as any),
          closingHour: typeof data.closingHour === 'string' ? data.closingHour : this.dateToTimeString(data.closingHour as any)
        });
      }
    });
  }

  handleSubmit() {
    if (!this.form.valid) return;
    
    const formData = this.form.getRawValue();
    
    // Enviar directamente los strings "HH:MM" - Spring Boot los deserializa a LocalTime
    const establishmentData: EstablishmentRequest = {
      name: formData.name,
      address: formData.address,
      canShower: formData.canShower,
      openingHour: formData.openingHour as any,  // String "HH:MM"
      closingHour: formData.closingHour as any,  // String "HH:MM"
      brandId: this.brandId()!
    };
    
    console.log("🟡 Enviando establecimiento al backend:", establishmentData);

    if (this.isEditing()) {
      this.establishmentService.updateEstablishment(this.estId()!, establishmentData).subscribe({
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
    } else {
      this.establishmentService.createEstablishment(establishmentData).subscribe({  
        next: (res) => console.log('Establecimiento creado', res),
        error: (err) => console.error('Error al crear establecimiento', err)
      });
    }
  }

  // Convierte Date a string "HH:MM" para el input (solo para edición)
  private dateToTimeString(date: Date): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}