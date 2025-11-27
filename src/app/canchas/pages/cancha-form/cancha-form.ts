import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchaService } from '../../services/cancha/cancha-service';
import { CanchaRequest } from '../../models/cancha-request';

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
    totalAmount: [0,[Validators.required,Validators.min(1)]],
    hasRoof: [false,Validators.required],
    canchaType: ['',Validators.required],
    working: [false,Validators.required]
  });

  readonly establishmentId = input<number>();
  readonly canchaData = input<CanchaRequest>();
  readonly isEditing = input(false);
  readonly canchaEdited = output<CanchaRequest>();
  readonly canchaId = input<number>();



  
  constructor() {
    effect(() => {
        if (this.isEditing() && this.canchaData()) {
          this.form.patchValue(this.canchaData()!);
        }
      });
  }

  handleSubmit() {
    if (!this.form.valid) return;
    const canchaData = this.form.getRawValue();

    if(this.isEditing()){
  this.canchaService.updateCancha(this.canchaId()!, { ...canchaData, establishmentId: this.establishmentId()! }).subscribe({
        next: (res) => {
          alert('Cancha actualizado con éxito');
          this.canchaEdited.emit(res);
        },
        error: (err) => {
          alert('Error al actualizar la cancha');
          console.error('Error al actualizar cancha', err)
        }
      });
      return;
    }else{
       this.canchaService.createCancha({ ...canchaData, establishmentId: this.establishmentId()! }).subscribe({  
      next: (res) => alert('Cancha creada con éxito'),
      error: (err) => {
        alert('Error al crear la cancha');
        console.error('Error al crear cancha', err)
      }
    });
    }
     
  }
}
