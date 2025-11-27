import { Component, inject, input, output, effect } from '@angular/core';
import { ReviewService } from '../review-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewResponse } from '../models/review-response';
import { ReviewRequest } from '../models/review-request';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form {
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly formbuilder = inject(FormBuilder);

  // ✅ Recibir establishmentId como input
  readonly establishmentId = input.required<number>();

  readonly review = input<ReviewResponse | null>(null);
  readonly isEditing = input(false);
  readonly edited = output<ReviewResponse>();
  readonly created = output<ReviewResponse>();

  protected readonly form = this.formbuilder.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    message: ['', [Validators.maxLength(500)]]
  });

  constructor() {
    // Cuando entra en modo edición, rellenamos el formulario
    effect(() => {
      const reviewValue = this.review();
      if (this.isEditing() && reviewValue) {
        this.form.patchValue({
          rating: reviewValue.rating,
          message: reviewValue.message ?? ''
        });
      } else {
        this.form.reset({
          rating: 0,
          message: ''
        });
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.warn('⚠️ Formulario inválido');
      return;
    }

    // ✅ Obtener datos actuales del usuario (no del constructor)
    const clientId = this.authService.getCurrentClientId();
    const clientName = this.authService.getUsername();

    // ✅ Validar que el usuario esté logueado
    if (!clientId || !clientName) {
      console.error('❌ Usuario no autenticado');
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    const formValue = this.form.getRawValue();
    
    const reviewData: ReviewRequest = {
    rating: formValue.rating,
    message: formValue.message || "",  // null si está vacío
    clientId: clientId,
    clientName: clientName,
    establishmentId: this.establishmentId(),
    createdAt: new Date().toISOString().split('T')[0]  // "YYYY-MM-DD"
    };

    console.log('📤 Enviando review:', reviewData);

    // ✅ Modo edición
    if (this.isEditing() && this.review()) {
      const reviewId = this.review()!.id;
      
      this.reviewService.updateReview(reviewId, reviewData).subscribe({
        next: (updatedReview) => {
          alert('Reseña actualizada correctamente');
          this.edited.emit(updatedReview);
          this.form.markAsPristine();
        },
        error: (err) => {
          console.error('❌ Error al actualizar review:', err);
          alert('Error al actualizar la reseña. Por favor, intenta nuevamente.');
        }
      });
    } 
    // ✅ Modo creación
    else {
      this.reviewService.createReview(reviewData).subscribe({
        next: (newReview) => {
          console.log('✅ Review creada:', newReview);
          this.created.emit(newReview);
          
          // Reset del formulario
          this.form.reset({
            rating: 0,
            message: ''
          });
        },
        error: (err) => {
          console.error('❌ Error al crear review:', err);
          alert('Error al crear la reseña. Por favor, intenta nuevamente.');
        }
      });
    }
  }

  get rating() {
    return this.form.controls.rating;
  }

  get message() {
    return this.form.controls.message;
  }

  get dirty() {
    return this.form.dirty;
  }

  get touched() {
    return this.form.touched;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}