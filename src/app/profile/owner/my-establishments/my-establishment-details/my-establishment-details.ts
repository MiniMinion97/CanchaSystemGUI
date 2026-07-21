import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../canchas/services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CanchaForm } from '../../../../canchas/pages/cancha-form/cancha-form';
import { CanchaService } from '../../../../canchas/services/cancha/cancha-service';
import { EstablishmentForm } from '../../../../canchas/pages/establishment-form/establishment-form';
import { EstablishmentResponse } from '../../../../canchas/models/establishment-response';
import { EstablishmentRequest } from '../../../../canchas/models/establishment-request';
import { MyCanchasComponent } from '../../my-canchas/my-canchas.component';
import { MyOwnerReservations } from '../../my-owner-reservations/my-owner-reservations'; 
import { MyOwnerReviews } from '../../my-owner-reviews/my-owner-reviews';

@Component({
  selector: 'app-my-establishment-details',
  imports: [CanchaForm, EstablishmentForm, MyCanchasComponent, MyOwnerReservations, MyOwnerReviews],
  templateUrl: './my-establishment-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './my-establishment-details.css'
})
export class MyEstablishmentDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly establishmentService = inject(EstablishmentService);
  private readonly canchaService = inject(CanchaService);
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  readonly creating = signal(false);

  protected readonly canchas = toSignal(this.canchaService.getCanchasByEstablishment(Number(this.id!)), { initialValue: [] });
  protected readonly showAll = signal(false);
  protected readonly isEditing = signal(false);
  readonly est = signal<EstablishmentResponse | null>(null);

  protected readonly showReservations = signal(false); 
  protected readonly showReviews = signal(false);
  
  constructor() {
    this.establishmentService.getEstablishmentById(this.id).subscribe({
      next: (res) => this.est.set(res),
      error: (err) => console.error('Error fetching brand:', err)
    });
  }

  toggleCreate(){
    this.creating.update(value => !value);
  }

  handleDetails(id: Number){
    this.router.navigateByUrl(`perfil/mis-canchas/${id}`);
  }

  toggleShow(){
    this.showAll.update(v => !v);
  }

  toggleShowReservations(){
    this.showReservations.update(v => !v);
  }

  toggleShowReviews(){
    this.showReviews.update(v => !v);
  }

  toggleEdit(){
    this.isEditing.update(v => !v);
  }

  handleEdit(updated: EstablishmentRequest) {
    const current = this.est();
    if (current) {
      // Convertir strings a Date si es necesario
      const updatedWithDates: EstablishmentResponse = {
        ...current,
        ...updated,
        openingHour: this.ensureDate(updated.openingHour),
        closingHour: this.ensureDate(updated.closingHour)
      };
      this.est.set(updatedWithDates);
    }
    this.toggleEdit();
  }

  // Helper para asegurar que sea Date
  private ensureDate(value: string | Date): Date {
    if (typeof value === 'string') {
      // Si es string "HH:MM", convertir a Date
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    }
    return value;
  }

  handleDelete(){
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer.');

    if (!confirmed) {
      return;
    }

    this.establishmentService.deleteEstablishment(Number(this.id!)).subscribe({
      next: () => {
        this.router.navigateByUrl('/perfil/mis-sucursales');
        alert('Sucursal eliminada');
      },
      error: (err) => {
        console.error('Error deleting establishment:', err)
        alert('Error al eliminar la sucursal. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }
}