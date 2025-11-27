import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationService } from '../../../reservation/services/reservation/reservation-service';
import { AuthService } from '../../../auth/services/authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-owner-reservations',
  imports: [CommonModule, DatePipe],
  templateUrl: './my-owner-reservations.html',
  styleUrl: './my-owner-reservations.css'
})
export class MyOwnerReservations {
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isInsideEst = input<boolean>(false);
  readonly idEst = input<number | null>(null);

  protected reservations = signal<any[]>([]);
  protected loading = signal<boolean>(true);

  private refreshTrigger = signal<number>(0);

  protected sortedReservations = computed(() => {
    const reservations = this.reservations();
    
    // Verificar que reservations sea un array
    if (!Array.isArray(reservations)) {
      return [];
    }
    
    const sorted = [...reservations].sort((a, b) => {
      const dateA = new Date(a.matchDate).getTime();
      const dateB = new Date(b.matchDate).getTime();
      return dateA - dateB;  
    });
    return sorted;
  });

  constructor() {
    effect(() => {
      this.refreshTrigger();
      
      this.loading.set(true);

      const inside = this.isInsideEst();
      const establishmentId = this.idEst();
      const ownerId = this.authService.getCurrentClientId();

      if (inside && establishmentId) {
        this.reservationService.getReservationsByEstablishment(establishmentId).subscribe({
          next: (res) => {
            this.reservations.set(Array.isArray(res) ? res : []);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('❌ Error obteniendo reservas por establecimiento:', err);
            this.reservations.set([]);
            this.loading.set(false);
          }
        });
      } else if (!inside && ownerId) {
        this.reservationService.getReservations().subscribe({
          next: (res) => {
            this.reservations.set(Array.isArray(res) ? res : []);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('❌ Error obteniendo reservas del propietario:', err);
            this.reservations.set([]);
            this.loading.set(false);
          }
        });
      } else {
        console.warn('⚠️ Sin condiciones válidas para cargar reservas');
        this.reservations.set([]);
        this.loading.set(false);
      }
    });
  }

  cancelReservation(reservationId: number) {
    const confirmed = confirm(`¿Estás seguro de que deseas cancelar la reserva con ID ${reservationId}?`);

    if (!confirmed) {
      return;
    }

    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        this.refreshTrigger.update(trigger => trigger + 1);
      },
      error: (err) => {
        console.error('❌ Error cancelando la reserva:', err);
        alert('Hubo un error al cancelar la reserva. Intenta nuevamente.');
      }
    });
  }
}