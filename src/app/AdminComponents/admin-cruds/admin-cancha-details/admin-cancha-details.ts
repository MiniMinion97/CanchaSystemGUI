import { Component, inject, signal } from '@angular/core';
import { CanchaService } from '../../../canchas/services/cancha/cancha-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { CanchaResponse } from '../../../canchas/models/cancha-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor() {
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
        console.log('✅ Cancha cargada:', res);
        this.cancha.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando cancha:', err);
        this.cancha.set(undefined);
        this.loading.set(false);
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.error("❌ Formulario inválido");
      return;
    }
    
    console.log("✅ Formulario válido");
    const value = this.form.getRawValue();

    this.canchaService.updateCancha(this.cancha()?.id!, value).subscribe({
        next: (res) => {
          console.log('✅ Edición de cancha exitosa:', res);
        },
        error: (err) => {
          console.error('❌ Error editando cancha:', err);
        }
    });
  }

  handleDelete() {
    this.canchaService.deleteCancha(this.cancha()?.id!).subscribe({
        next: (res) => {
          console.log('✅ Cancha eliminada con éxito:', res);
        },
        error: (err) => {
          console.error('❌ Error eliminando cancha:', err);
        }
    });
  }
}

