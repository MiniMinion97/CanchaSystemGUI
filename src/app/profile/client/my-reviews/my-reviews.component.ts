import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Form } from '../../../reviews/form/form';
import { StarRatingComponent } from '../../../layout/star-rating/star-rating';
import { ReviewList } from '../../../reviews/review-list/review-list';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { ReviewResponse } from '../../../reviews/models/review-response';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, Form, ReviewList],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css'
})
export class MyReviewsComponent {
  // Services
  private readonly reviewService = inject(ReviewService);
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  private readonly refreshTrigger$ = new Subject<void>();
  
  // State signals
  protected readonly clientId = computed(() => this.authService.getCurrentClientId());
  protected readonly reviews = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.reviewService.getReviewsByClient(this.clientId()!)),
      catchError(error => {
        console.log('No reviews found or error:', error);
        // Return empty array if no reviews or error
        return [];
      })
    ),
    { initialValue: [] }
  );
  
  protected readonly isLoading = signal(false);
  protected readonly editingReview = signal<ReviewResponse | null>(null);
  
  constructor() {
    // Initial load
    this.refreshReviews();
    
  this.refreshTrigger$.next();
  effect(() => {
    const reviews = this.reviews();
    if (reviews && reviews.length > 0) {
      this.reviewCount.set(reviews.length);
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      this.averageRating.set((sum / reviews.length).toFixed(1));
    }
  });

  }

  // Computed values
  protected readonly reviewCount = signal<number>(0);
  protected readonly averageRating = signal<string>('0.0');
  
  // Actions
  protected startEdit(review: ReviewResponse): void {
    this.editingReview.set(review);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  protected deleteReview(reviewId: number): void {
  if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
    return;
  }
  
  // Encontrar la review para obtener su rating
  const reviewToDelete = this.reviews()?.find(r => r.id === reviewId);
  if (!reviewToDelete) return;
  
  this.isLoading.set(true);
  
  this.reviewService.deleteReview(reviewId).subscribe({
    next: () => {
      
      // Actualizar el count
      const newCount = this.reviewCount() - 1;
      this.reviewCount.set(newCount);
      
      // Actualizar el average
      if (newCount === 0) {
        this.averageRating.set('0.0');
      } else {
        const currentAvg = parseFloat(this.averageRating());
        const totalSum = currentAvg * (newCount + 1);
        const newSum = totalSum - reviewToDelete.rating;
        const newAvg = (newSum / newCount).toFixed(1);
        this.averageRating.set(newAvg);
      }
      
      this.isLoading.set(false);

       this.reviews().splice(this.reviews().findIndex(r => r.id === reviewId), 1);
    },
    error: (error) => {
      console.error('❌ Error al eliminar la reseña:', error);
      alert('Error al eliminar la reseña. Por favor, intenta de nuevo.');
      this.isLoading.set(false);
    }
  });
}
  
  protected onReviewEdited(review: ReviewResponse): void {
    this.editingReview.set(null);
    // Optionally refresh the list or update locally
    this.refreshReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  protected onReviewCreated(review: ReviewResponse): void {
    // Refresh the reviews list
    // You might need to implement a refresh method
    this.refreshReviews();
  }
  
  protected goToEstablishment(establishmentId: number): void {
    this.router.navigateByUrl(`/explore/details/${establishmentId}`);
  }

  private refreshReviews(): void {
    this.refreshTrigger$.next();
  }
}