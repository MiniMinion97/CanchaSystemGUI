import { Component, inject, input, signal } from '@angular/core';
import { ReservationService } from '../../../../reservation/services/reservation/reservation-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationResponse } from '../../../../reservation/models/reservation-response';
import { ReservationRequest } from '../../../../reservation/models/reservation-request';
import { Make } from '../../../../reservation/pages/make/make';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../auth/services/authservice';

@Component({
  selector: 'app-my-reservation-details',
  imports: [Make, DatePipe],
  templateUrl: './my-reservation-details.html',
  styleUrl: './my-reservation-details.css'
})
export class MyReservationDetails {
  protected readonly auth = inject(AuthService);
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

   private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  
  protected readonly isEditing = signal(false);
  readonly reservation = signal<ReservationResponse | null>(null);
  
readonly reservationRequestData = signal<any>(null);

  
  protected loading = signal<boolean>(true);


private mapResponseToRequest(res: ReservationResponse): any {
  const matchDate = res.matchDate ? new Date(res.matchDate) : null;

  const yyyy = matchDate ? matchDate.getFullYear() : '';
  const mm = matchDate ? String(matchDate.getMonth() + 1).padStart(2, '0') : '';
  const dd = matchDate ? String(matchDate.getDate()).padStart(2, '0') : '';

  return {
    canchaId: res.cancha.id,
    date: matchDate ? `${yyyy}-${mm}-${dd}` : '',
    hour: matchDate ? matchDate.toTimeString().slice(0, 5) : '',
    establishmentId: res.cancha.establishment.id // <-- IMPORTANTE: para que Make cargue las canchas
  };
}




  constructor() {      
    this.loading.set(true); 

  this.reservationService.getReservation(this.id).subscribe({
  next: (res) => {
console.log("🔎 canchaId:", res.cancha?.id);
console.log("🔎 establishmentId:", res.cancha?.establishment?.id);


  this.reservation.set(res);
  this.reservationRequestData.set(this.mapResponseToRequest(res));
  this.loading.set(false);
  },
  error: (err) => {
    console.error('Error fetching reservation:', err);
    this.loading.set(false);
  }
});

}


  toggleEdit(){
    this.isEditing.update(v => !v);
  }

 handleEdit(updated: ReservationResponse) {
  this.reservation.set(updated);

const match = new Date(updated.matchDate);

const yyyy = match.getFullYear();
const mm = String(match.getMonth() + 1).padStart(2, "0");
const dd = String(match.getDate()).padStart(2, "0");
const hh = String(match.getHours()).padStart(2, "0");
const min = String(match.getMinutes()).padStart(2, "0");

this.reservationRequestData.set({
  canchaId: updated.cancha.id,
  date: `${yyyy}-${mm}-${dd}`,   // ⬅ lo que Make.ts necesita
  hour: `${hh}:${min}`           // ⬅ lo que Make.ts necesita
});


  this.toggleEdit();
}



  handleDelete(){
    this.reservationService.deleteReservation(this.id).subscribe({
      next: (res) => {
        console.log('Reservation canceled', res);
        this.router.navigateByUrl('/perfil/mis-reservas');
      },
      error: (err) => console.error('Error deleting reservation', err)
    });
  }
}



