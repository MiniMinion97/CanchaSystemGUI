import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  imports: [],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {
  private readonly router = inject(Router);

  goToMyData(){
    this.router.navigateByUrl("");
  }

  goToMyReservations(){
    this.router.navigateByUrl("");
  }

  goToMyReviews(){
    this.router.navigateByUrl("");
  }
}
