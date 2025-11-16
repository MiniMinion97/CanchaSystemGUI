import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { Form } from '../../../reviews/form/form';
import { ReviewList } from '../../../reviews/review-list/review-list';
import { ReviewResponse } from '../../../reviews/models/review-response';
import { Make } from '../../../reservation/pages/make/make';
import { StarRatingComponent } from "../../../layout/star-rating/star-rating";

@Component({
  selector: 'app-details',
  imports: [Form, ReviewList, Make, StarRatingComponent],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly reviewService = inject(ReviewService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loggedIn = this.authService.loggedIn;
  protected readonly role = this.authService.role;

  protected readonly establishmentId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly establishment = signal<any | null>(null);
  protected readonly reviews = signal<ReviewResponse[]>([]);
  protected readonly editingReview = signal<ReviewResponse | null>(null);

  // ✅ NUEVO: Signals para verificar si el usuario ya tiene review
  protected readonly hasReviewed = signal<boolean>(false);
  protected readonly checkingReview = signal<boolean>(false);

  constructor() {
    // Cargar datos al iniciar el componente
    this.loadEstablishment();
    this.loadReviews();

    // ✅ Verificar si el cliente ya tiene review cuando cambia el estado de login
    effect(() => {
      if (this.loggedIn() && this.role() === 'ROLE_CLIENT') {
        this.checkIfClientReviewed();
      } else {
        this.hasReviewed.set(false);
        this.checkingReview.set(false);
      }
    });
  }

  private loadEstablishment() {
    this.establishmentService.getEstablishmentById(this.establishmentId).subscribe({
      next: (data) => {
        console.log('✅ Establecimiento cargado:', data);
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
        console.log('✅ Reviews cargadas:', data.length);
        console.log(data);
        
        this.reviews.set(data);
      },
      error: (err) => {
        console.error('❌ Error loading reviews:', err);
      }
    });
  }

  // ✅ NUEVO: Verificar si el cliente ya tiene una review en este establecimiento
  private checkIfClientReviewed() {
    const clientId = this.authService.getCurrentClientId();
    
    if (!clientId) {
      console.warn('⚠️ No hay clientId disponible');
      this.hasReviewed.set(false);
      this.checkingReview.set(false);
      return;
    }

    console.log('🔍 Verificando si el cliente ya tiene review...');
    this.checkingReview.set(true);
    
    // ✅ Pasar clientId como string (UUID), no como Number
    this.reviewService.clientAlreadyReviewed(this.establishmentId, clientId)
      .subscribe({
        next: (exists) => {
          console.log('✅ ¿Ya tiene review?', exists);
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

  /** Called when a user clicks edit on a review */
  protected startEdit(review: ReviewResponse) {
    console.log('✏️ Editando review:', review.id);
    this.editingReview.set(review);
  }

  /** Called when a review form emits `edited` */
  protected onReviewEdited(updated: ReviewResponse) {
    console.log('✅ Review actualizada:', updated.id);
    
    const updatedList = this.reviews().map((r) =>
      r.id === updated.id ? updated : r
    );
    this.reviews.set(updatedList);
    this.editingReview.set(null);
    
    // No cambia hasReviewed porque solo editó
  }

  /** Called when a review form emits `created` */
  protected onReviewCreated(newReview: ReviewResponse) {
    console.log('✅ Review creada:', newReview.id);
    
    this.reviews.set([newReview, ...this.reviews()]);
    this.editingReview.set(null);
    
    // ✅ Actualizar estado: ahora sí tiene review
    this.hasReviewed.set(true);
  }

  /** Called when a review is deleted */
  protected deleteReview(reviewId: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;

    console.log('🗑️ Eliminando review:', reviewId);

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        console.log('✅ Review eliminada');
        
        const filtered = this.reviews().filter((r) => r.id !== reviewId);
        this.reviews.set(filtered);
        
        // ✅ Actualizar estado: ya no tiene review
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
    console.log('✅ Reserva creada:', reservation);
    // Aquí podrías agregar lógica adicional, como mostrar un mensaje de éxito
  }
}