import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReviewResponse } from '../models/review-response';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './review-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./review-item.css'],
})
export class ReviewItem {
  readonly review = input.required<ReviewResponse>();
  readonly clientId = input<string | null>(null);
  readonly isLoggedIn = input<boolean>(false);

  readonly edit = output<ReviewResponse>();
  readonly delete = output<number>();

  protected readonly stars = [1, 2, 3, 4, 5];

  /** Devuelve true si el review pertenece al usuario logueado */
  isOwner(): boolean {
  const review = this.review();
  const reviewClientId = review.clientId;  // directo, no review.client.id
  const currentClientId = this.clientId();

  return reviewClientId === currentClientId && !!currentClientId;
}
}