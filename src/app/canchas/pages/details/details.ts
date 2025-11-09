import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { toSignal } from '@angular/core/rxjs-interop';
import { Form } from '../../../reviews/form/form';
import { ReviewList } from '../../../reviews/review-list/review-list';
import { ReviewResponse } from '../../../reviews/models/review-response';
import { Make } from '../../../reservation/pages/make/make';

@Component({
  selector: 'app-details',
  imports: [Form, ReviewList, Make],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {

  private readonly establishmentService = inject(EstablishmentService);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loggedIn = this.authService.loggedIn;
  protected readonly role = this.authService.role;
  protected readonly clientId = this.authService.clientId;

  protected readonly establishmentId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly establishmentSource = toSignal(this.establishmentService.getEstablishmentById(Number(this.establishmentId)));
  protected readonly establishment = linkedSignal(() => this.establishmentSource());

  protected readonly reviews = signal<ReviewResponse[]>([]);
  protected readonly editingReview = signal<ReviewResponse | null>(null);

  constructor() {
    this.loadReviews();
  }

  /** Load all reviews for this establishment */
  private loadReviews() {
  this.reviewService
    .getReviewsByEstablishment(Number(this.establishmentId))
    .subscribe({
      next: (res) => this.reviews.set(res),
      error: (err) => {
        if (err.status === 404) {
          console.warn('No reviews found for this establishment.');
          this.reviews.set([]); // just set empty list
        } else {
          console.error('Error loading reviews:', err);
        }
      }
    });
}


  /** Called when a user clicks edit on a review */
  protected startEdit(review: ReviewResponse) {
    this.editingReview.set(review);
  }

  /** Called when a review form emits `edited` */
  protected onReviewEdited(updated: ReviewResponse) {
    // Update local review list
    const updatedList = this.reviews().map((r) => (r.id === updated.id ? updated : r));
    this.reviews.set(updatedList);
    this.editingReview.set(null);
  }

  /** Called when a review form emits `created` */
  protected onReviewCreated(newReview: ReviewResponse) {
    // Add new review to top of list
    this.reviews.set([newReview, ...this.reviews()]);
  }

  /** Called when a review is deleted */
  protected deleteReview(reviewId: number) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.reviewService.deleteReview(reviewId).subscribe(() => {
      const filtered = this.reviews().filter((r) => r.id !== reviewId);
      this.reviews.set(filtered);
    });
  }

  protected onReservationCreated(reservation: any) {
  console.log('Reservation created:', reservation);
  // You could call ReservationService.createReservation(reservation) here
}
}
