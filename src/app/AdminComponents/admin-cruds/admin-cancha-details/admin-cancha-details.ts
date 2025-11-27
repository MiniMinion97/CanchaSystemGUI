import { Component, inject, signal } from '@angular/core';
import { CanchaService } from '../../../canchas/services/cancha/cancha-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { CanchaResponse } from '../../../canchas/models/cancha-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-cancha-details',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-cancha-details.html',
  styleUrl: './admin-cancha-details.css'
})
export class AdminCanchaDetails {
  private readonly canchaService = inject(CanchaService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected cancha = signal<CanchaResponse | undefined>(undefined);

  protected readonly isEditing = signal(false);

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    totalAmount: [0,Validators.required],
    hasRoof: [false],
    establishmentId: [0,Validators.required],
    canchaType: ['',Validators.required],
    working: [false]
  })

  constructor(private location: Location) {
    this.loadCanchas();
  }

  private loadCanchas() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const canchaId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.canchaService.getCancha(Number(canchaId)).subscribe({
      next: (res) => {
        this.cancha.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando cancha:', err);
        this.cancha.set(undefined);
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.error("❌ Formulario inválido");
      alert('El formulario es inválido. Revise nuevamente los datos ingresados.');
      return;
    }
    
    const value = this.form.getRawValue();

    this.canchaService.updateCancha(this.cancha()?.id!, value).subscribe({
        next: (res) => {
          alert('La cancha fue editado con éxito.');
        },
        error: (err) => {
          console.error('❌ Error editando cancha:', err);
        }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar esta cancha?`)) return;

    this.canchaService.deleteCancha(this.cancha()?.id!).subscribe({
        next: (res) => {
          alert('Cancha eliminada con éxito.');
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando cancha:', err);
          alert("Hubo un error al eliminar la cancha.")
          this.goBack();
        }
    });
  }

  goBack() {
    this.location.back();
  }
}

