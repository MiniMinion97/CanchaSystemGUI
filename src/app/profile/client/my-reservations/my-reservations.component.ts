import { Component, effect, inject, signal } from '@angular/core';
import { ReservationService } from '../../../reservation/services/reservation/reservation-service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/services/authservice';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent {
  protected readonly auth = inject(AuthService);
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  protected clientId = this.auth.getCurrentClientId()!;
  

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

    handleDetails(id: Number){
      this.router.navigateByUrl(`perfil/mis-reservas/${id}`)
    }

    goToExplore(){
      this.router.navigateByUrl('explore');
    }
  

  
}
