import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { Form } from '../../../reviews/form/form';
import { ReviewList } from '../../../reviews/review-list/review-list';
import { ReviewResponse } from '../../../reviews/models/review-response';
import { Make } from '../../../reservation/pages/make/make';
import { StarRatingComponent } from "../../../layout/star-rating/star-rating";
import { Image } from '../../../image/models/image';
import { ImageService } from '../../../image/services/image-service';

@Component({
  selector: 'app-details',
  imports: [Form, ReviewList, Make, StarRatingComponent],
  templateUrl: './details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './details.css'
})
export class Details {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly reviewService = inject(ReviewService);
  private readonly imageService = inject(ImageService)
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loggedIn = this.authService.loggedIn;
  protected readonly role = this.authService.role;

  protected readonly establishmentId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly establishment = signal<any | null>(null);
  protected readonly images = signal<Image[]>([]);
  protected readonly reviews = signal<ReviewResponse[]>([]);
  protected readonly editingReview = signal<ReviewResponse | null>(null);

  protected readonly hasReviewed = signal<boolean>(false);
  protected readonly checkingReview = signal<boolean>(false);

  constructor() {
    // Cargar datos al iniciar el componente
    this.loadEstablishment();
    this.loadReviews();
    this.loadImages();

    effect(() => {
      if (this.loggedIn() && this.role() === 'ROLE_CLIENT') {
        this.checkIfClientReviewed();
      } else {
        this.hasReviewed.set(false);
        this.checkingReview.set(false);
      }
    });

    effect(() => {
    const currentReviews = this.reviews();
    const userId = this.authService.getCurrentClientId();
    // Verificar si el usuario tiene una review en la lista
    const userReview = currentReviews.find(r => r.clientId === userId);
  });
  }

  private loadEstablishment() {
    this.establishmentService.getEstablishmentById(this.establishmentId).subscribe({
      next: (data) => {
        this.establishment.set(data);
      },
      error: (err) => {
        console.error('❌ Error loading establishment:', err);
      }
    });
  }

  private loadReviews() {
    this.reviewService.getReviewsByEstablishment(this.establishmentId).subscribe({
      next: (data) => {
        
        this.reviews.set(data);
      },
      error: (err) => {
        console.error('❌ Error loading reviews:', err);
      }
    });
  }

  private loadImages() {
    this.imageService.getImagesByEstablishment(this.establishmentId).subscribe({
      next: (data) => {
        this.images.set(data);
      },
      error: (err) => {
        console.error('❌ Error loading images:', err);
      }
    });
  }

  public getImage(imageId: number | string) {
    return this.imageService.getImageUrl(imageId);
  }

  imageIndex: number = 0;
  public previousImage() {
    const length = this.images().length;
    this.imageIndex = (this.imageIndex - 1 + length) % length;
  }
  public nextImage() {
    const length = this.images().length;
    this.imageIndex = (this.imageIndex + 1) % length;
  }

  private checkIfClientReviewed() {
    const clientId = this.authService.getCurrentClientId();
    
    if (!clientId) {
      console.warn('⚠️ No hay clientId disponible');
      this.hasReviewed.set(false);
      this.checkingReview.set(false);
      return;
    }

    this.checkingReview.set(true);
    
    // pasar clientId como string (UUID), no como Number
    this.reviewService.clientAlreadyReviewed(this.establishmentId, clientId)
      .subscribe({
        next: (exists) => {
          this.hasReviewed.set(exists);
          this.checkingReview.set(false);
        },
        error: (err) => {
          console.error('❌ Error al verificar review:', err);
          this.hasReviewed.set(false);
          this.checkingReview.set(false);
        }
      });
  }

  protected startEdit(review: ReviewResponse) {
    this.editingReview.set(review);
  }

  /** Called when a review form emits `edited` */
  protected onReviewEdited(updated: ReviewResponse) {
    
    const updatedList = this.reviews().map((r) =>
      r.id === updated.id ? updated : r
    );
    this.reviews.set(updatedList);
    this.editingReview.set(null);
    
  }


  protected onReviewCreated(newReview: ReviewResponse) {
    
    this.reviews.set([newReview, ...this.reviews()]);
    this.editingReview.set(null);
    
    // actualizar estado: ahora sí tiene review
    this.hasReviewed.set(true);
  }

  /** Called when a review is deleted */
  protected deleteReview(reviewId: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;


    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        
        const filtered = this.reviews().filter((r) => r.id !== reviewId);
        this.reviews.set(filtered);
        
        // actualizar estado: ya no tiene review
        this.hasReviewed.set(false);
        this.editingReview.set(null);
      },
      error: (err) => {
        console.error('❌ Error al eliminar review:', err);
        alert('Error al eliminar la reseña. Por favor, intenta nuevamente.');
      }
    });
  }

  protected onReservationCreated(reservation: any) {
    alert("reserva creada con éxito!")
  }

  protected get currentUserId() {
    return this.authService.getCurrentClientId();
  }

  protected get isUserLoggedIn() {
    return this.loggedIn();
  }
}

