import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Form } from '../../../reviews/form/form';
import { StarRatingComponent } from '../../../layout/star-rating/star-rating';
import { ReviewList } from '../../../reviews/review-list/review-list';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { ReviewResponse } from '../../../reviews/models/review-response';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, Form, StarRatingComponent, ReviewList],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css'
})
export class MyReviewsComponent {
  // Services
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  protected readonly router = inject(Router);
  
  // State signals
  protected readonly clientId = computed(() => this.authService.getCurrentClientId());
  protected readonly reviews = toSignal(
    this.reviewService.getReviewsByClient(this.clientId()!),
    { initialValue: [] }
  );
  protected readonly isLoading = signal(false);
  protected readonly editingReview = signal<ReviewResponse | null>(null);
  
  // Computed values
  protected readonly reviewCount = computed(() => this.reviews()?.length ?? 0);
  protected readonly averageRating = computed(() => {
    const reviewsList = this.reviews();
    if (!reviewsList || reviewsList.length === 0) return 0;
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  });
  
  // Actions
  protected startEdit(review: ReviewResponse): void {
    this.editingReview.set(review);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  protected async deleteReview(reviewId: number): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      return;
    }
    
    try {
      this.isLoading.set(true);
      await this.reviewService.deleteReview(reviewId);
      // Refresh reviews after deletion
      // You might need to implement a refresh method in your service
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      alert('Error al eliminar la reseña. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  protected onReviewEdited(review: ReviewResponse): void {
    this.editingReview.set(null);
    // Optionally refresh the list or update locally
  }
  
  protected onReviewCreated(review: ReviewResponse): void {
    // Refresh the reviews list
    // You might need to implement a refresh method
  }
  
  protected goToEstablishment(establishmentId: number): void {
    this.router.navigate(['/establishment', establishmentId]);
  }
}