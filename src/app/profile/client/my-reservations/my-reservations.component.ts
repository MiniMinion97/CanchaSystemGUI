import { Component, effect, inject, signal } from '@angular/core';
import { ReservationService } from '../../../reservation/services/reservation/reservation-service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent {
  private readonly reservationService = inject(ReservationService);
  protected clientId = localStorage.getItem('userId')!;

  protected loading = signal<boolean>(true);

  protected reservations = signal<any[]>([]);

  constructor() {
    effect(() => {
      this.loading.set(true); //cada vez que cambian inputs, arranca en "cargando"
      this.reservationService.getReservationsByClient(this.clientId).subscribe({
          next: (res) => {
            this.reservations.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error obteniendo marcas:', err);
            this.reservations.set([]);
            this.loading.set(false);
          }
        });
      });
    }

    handleDetals(id: Number){

    }
  

  
}
