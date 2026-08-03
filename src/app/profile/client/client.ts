import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  imports: [],
  templateUrl: './client.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './client.css'
})
export class Client {
  private readonly router = inject(Router);

  goToMyData(){
    this.router.navigateByUrl("perfil/mis-datos");
  }

  goToMyReservations(){
    this.router.navigateByUrl("perfil/mis-reservas");
  }

  goToMyReviews(){
    this.router.navigateByUrl("perfil/mis-reseñas");
  }
}
