import { Component, effect, inject, input, signal } from '@angular/core';
import { ReservationService } from '../../../reservation/services/reservation/reservation-service';
import { AuthService } from '../../../auth/services/authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-owner-reservations',
  imports: [],
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


  constructor() {
    effect(() => {
      this.loading.set(true); 

      const inside = this.isInsideEst();
      const establishmentId = this.idEst();
      const ownerId = this.authService.getCurrentClientId();

      if (inside && establishmentId) {
        this.reservationService.getReservationsByEstablishment(establishmentId).subscribe({
          next: (res) => {
            this.reservations.set(res);
            this.loading.set(false);

            console.log(this.reservations);
            
          },
          error: (err) => {
            console.error('Error obteniendo canchas por establecimiento:', err);
            this.reservations.set([]);
            this.loading.set(false);
          }
        });
      } else if (!inside) {
            if (!ownerId) {
            this.reservations.set([]);
            this.loading.set(false);
            return;
          }
      }
    });
  }

}

