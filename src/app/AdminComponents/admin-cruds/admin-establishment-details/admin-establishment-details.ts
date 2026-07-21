import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { EstablishmentResponse } from '../../../canchas/models/establishment-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminReservation } from '../../admin-reservation/admin-reservation';
import { AdminReviews } from '../../admin-reviews/admin-reviews';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-establishment-details',
  imports: [ReactiveFormsModule, AdminReservation, AdminReviews],
  templateUrl: './admin-establishment-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-establishment-details.css'
})
export class AdminEstablishmentDetails {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected establishment = signal<EstablishmentResponse | undefined>(undefined);

  protected readonly isEditing = signal(false);

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['',Validators.required],
    address: ['',Validators.required],
    canShower: [false],
    openingHour: [new Date(),Validators.required],
    closingHour: [new Date(),Validators.required]
  })

  constructor(private location: Location) {
    this.loadEstablishments();
  }

  private loadEstablishments() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const establishmentId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.establishmentService.getEstablishmentById(Number(establishmentId)).subscribe({
      next: (res) => {
        this.establishment.set(res);
        this.loading.set(false);

        this.form.patchValue({ ...res });
      },
      error: (err) => {
        console.error('❌ Error cargando sucursal:', err);
        this.establishment.set(undefined);
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

    this.establishmentService.updateEstablishment(this.establishment()?.id!, { ...value, brandId: this.establishment()?.brandId! }).subscribe({
        next: (res) => {
          alert('La sucursal fue editada con éxito.');
        },
        error: (err) => {
          console.error('❌ Error editando sucursal:', err);
        }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar la sucursal ${this.establishment()?.name}?`)) return;

    this.establishmentService.deleteEstablishment(this.establishment()?.id!).subscribe({
        next: (res) => {
          alert("Sucursal eliminada con éxito.")
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando sucursal:', err);
          alert("Hubo un error al eliminar la sucursal.")
          this.goBack();
        }
    });
  }

  goBack() {
    this.location.back();
  }
}

