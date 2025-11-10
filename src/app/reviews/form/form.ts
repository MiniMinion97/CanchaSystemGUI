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

  // En un caso real, podrías pasar establishmentId por @Input()
  private readonly establishmentId = 1;

  // Obtenemos el ID del cliente del localStorage
  private readonly clientId = localStorage.getItem('userId')!;
  private readonly clientName = 'John Doe'; // Ejemplo, en futuro sacalo del AuthService

  readonly review = input<ReviewResponse | null>(null);
  readonly isEditing = input(false);
  readonly edited = output<ReviewResponse>();
  readonly created = output<ReviewResponse>();

  protected readonly form = this.formbuilder.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    message: [''],
    clientId: [this.clientId],
    establishmentId: [this.establishmentId]
  });

  constructor() {
    // Cuando entra en modo edición, rellenamos el formulario
    effect(() => {
      const reviewValue = this.review();
      if (this.isEditing() && reviewValue) {
        this.form.patchValue({
          rating: reviewValue.rating,
          message: reviewValue.message ?? '',
          clientId: reviewValue.client?.id ?? this.clientId,
          establishmentId: reviewValue.establishment?.id ?? this.establishmentId,
        });
      } else {
        this.form.reset({
          rating: 0,
          message: '',
          clientId: this.clientId,
          establishmentId: this.establishmentId,
        });
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) return;

    const reviewData: ReviewRequest = {
      ...this.form.getRawValue(),
      clientName: this.clientName,
      createdAt: new Date().toISOString().split('T')[0], // formato "YYYY-MM-DD"
      clientId: this.clientId,
    };


    if (this.isEditing() && this.review()) {
      const reviewId = this.review()!.id;
      this.reviewService.updateReview(reviewId, reviewData).subscribe((updatedReview) => {
        this.edited.emit(updatedReview);
      });
    } else {
      this.reviewService.createReview(reviewData).subscribe((newReview) => {
        this.created.emit(newReview);

        this.form.reset({
          rating: 0,
          message: '',
          clientId: this.clientId,
          establishmentId: this.establishmentId,
        });
      });
    }
  }

  // Getters prácticos
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
}
