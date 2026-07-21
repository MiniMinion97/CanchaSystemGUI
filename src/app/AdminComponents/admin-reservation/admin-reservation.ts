import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReservationService } from '../../reservation/services/reservation/reservation-service';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-reservation',
  imports: [],
  templateUrl: './admin-reservation.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-reservation.css'
})
export class AdminReservation implements OnInit {
private readonly reservationService = inject(ReservationService);
  private readonly router = inject(RouterOutlet);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected reservations = signal<any[]>([]);

  type = input<string>(); 
  protected id = this.router.activatedRoute.snapshot.paramMap.get('id');

  constructor() {
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations() {
    const adminId = this.authService.getCurrentClientId();

    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    let obs;
    
    if (this.type() === 'client') {
      obs = this.reservationService.getReservationsByClient(this.id!);
    } else if (this.type() === 'establishment') {
      obs = this.reservationService.getReservationsByEstablishment(Number(this.id));
    } else {
      obs = this.reservationService.getReservations();
    }
    obs.subscribe({
      next: (res) => {
        this.reservations.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando reservas:', err);
        this.reservations.set([]);
        this.loading.set(false);
      }
    });
    
  }
}
