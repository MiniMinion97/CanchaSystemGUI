import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReservationService } from '../../../reservation/services/reservation/reservation-service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/authservice';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './my-reservations.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent {
  protected readonly auth = inject(AuthService);
  private readonly reservationService = inject(ReservationService);
  private readonly establishmentService = inject(EstablishmentService);
  private readonly router = inject(Router);
  protected clientId = this.auth.getCurrentClientId()!;

  protected loading = signal<boolean>(true);
  protected reservations = signal<any[]>([]);
  protected allnames = signal<any>([]);
  protected selectedFilter = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loading.set(true);

      this.reservationService.getReservationsByClient(this.clientId).subscribe({
        next: (reservations) => {
          this.reservations.set(reservations);

          if (reservations.length === 0) {
            this.loading.set(false);
            return;
          }

          const ids = reservations.map(r => r.establishmentId);

          this.establishmentService.getEstablishmentsNames(ids).subscribe({
            next: (names) => {
              this.allnames.set(names);
              this.loading.set(false);
            }
          });
        }
      });
    });
  }

  protected setStatusFilter(status: string | null) {
    this.selectedFilter.set(status || null);
  }

  protected getFilteredReservations() {
    const filter = this.selectedFilter();
    if (!filter) return this.reservations();
    return this.reservations().filter(r => r.status === filter);
  }

  handleDetails(reservation: any) {
    this.router.navigate([`perfil/mis-reservas/${reservation.id}`], {
      state: {
        establishmentName: this.allnames().get(reservation.establishmentId)
      }
    });
  }

  goToExplore() {
    this.router.navigateByUrl('explorar');
  }

  protected getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada',
      'CANCELED': 'Cancelada',
    };
    return statusMap[status] || status;
  }

  getEstablishmentsName() {
    let ids = []
    for (let i = 0; i < this.reservations().length; i++) {
      ids.push(this.reservations()[i].establishmentId)
    }

    return this.establishmentService.getEstablishmentsNames(ids);
  }
}
