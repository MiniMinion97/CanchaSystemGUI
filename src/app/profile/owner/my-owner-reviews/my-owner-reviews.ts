import { Component, effect, inject, input, signal } from '@angular/core';
import { ReviewService } from '../../../reviews/review-service';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { AuthService } from '../../../auth/services/authservice';

@Component({
  selector: 'app-my-owner-reviews',
  imports: [],
  templateUrl: './my-owner-reviews.html',
  styleUrl: './my-owner-reviews.css'
})
export class MyOwnerReviews {
private readonly reviewService = inject(ReviewService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isInsideEst = input<boolean>(false);
  readonly idEst = input<number | null>(null);

  protected reviews = signal<any[]>([]);

  protected loading = signal<boolean>(true);


  constructor() {
    effect(() => {
      this.loading.set(true); 

      const inside = this.isInsideEst();
      const establishmentId = this.idEst();
      const ownerId = this.authService.getCurrentClientId();

      if (inside && establishmentId) {
        this.reviewService.getReviewsByEstablishment(establishmentId).subscribe({
          next: (res) => {
            this.reviews.set(res);
            this.loading.set(false);

            console.log(this.reviews);
            
          },
          error: (err) => {
            console.error('Error obteniendo canchas por establecimiento:', err);
            this.reviews.set([]);
            this.loading.set(false);
          }
        });
      } else if (!inside) {
            if (!ownerId) {
            this.reviews.set([]);
            this.loading.set(false);
            return;
          }
      }
    });
  }
}
