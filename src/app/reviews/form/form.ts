import { Component, inject, input, output, effect } from '@angular/core';
import { ReviewService } from '../review-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewResponse } from '../models/review-response';
import { ReviewRequest } from '../models/review-request';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form {
  private readonly reviewService = inject(ReviewService);

  private readonly establishmentId = 1; // Example establishment ID
  private readonly clientId = 1; // Example client ID

  //protected readonly reviewId = 1; // Example review ID

  readonly review = input<ReviewResponse | null>(null);
  readonly isEditing = input(false);
  readonly edited = output<ReviewResponse>();
  readonly created = output<ReviewResponse>();

  private readonly formbuilder = inject(FormBuilder);

  constructor() {
    // When in editing mode, populate form
    effect(() => {
      const reviewValue = this.review();
      if (this.isEditing() && reviewValue) {
        this.form.patchValue({
          rating: reviewValue.rating,
          message: reviewValue.message ?? '',
          clientId: reviewValue.clientId,
          establishmentId: reviewValue.establishmentId,
        });
      } else {
        this.form.reset({
          rating: 0,
          message: '',
          clientId: this.clientId.toString(),
          establishmentId: this.establishmentId,
        });
      }
    });
  }

  protected readonly form = this.formbuilder.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    message: [''],
    clientId: [this.clientId.toString()],
    establishmentId: [this.establishmentId]
  });

  
  handleSubmit() {
    if (this.form.invalid) return;

    const reviewData: ReviewRequest = this.form.getRawValue();

    if (this.isEditing() && this.review()) {
      // Update existing review
      
      const reviewId = this.review()!.id;
      this.reviewService.updateReview(reviewId, reviewData).subscribe((updatedReview) => {
        this.edited.emit(updatedReview);
      });

    } else {
      // Create new review
      this.reviewService.createReview(reviewData).subscribe((newReview) => {
        this.created.emit(newReview);
        this.form.reset({
          rating: 0,
          message: '',
          clientId: this.clientId.toString(),
          establishmentId: this.establishmentId,
        });
      });
    }
  }

  get rating(){
    return this.form.controls.rating;
  }

  get message(){
    return this.form.controls.message;
  }

  get dirty(){
    return this.form.dirty;
  }

  get touched(){  
    return this.form.touched;
  }

    
}
