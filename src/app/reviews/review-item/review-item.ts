import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReviewResponse } from '../models/review-response';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './review-item.html',
  styleUrls: ['./review-item.css'],
})
export class ReviewItem {
  readonly review = input<ReviewResponse>();
  readonly edit = output<ReviewResponse>();
  readonly delete = output<number>();

  protected clientId = localStorage.getItem('userId')!;
  protected readonly stars = [1, 2, 3, 4, 5];

  /** Devuelve true si el review pertenece al usuario logueado */
  isOwner(): boolean {
    const review = this.review();

    // Aseguramos que no rompa si algo es null/undefined
    const reviewClientId = review?.client?.id ?? null;
    const currentClientId = this.clientId ?? null;

    return reviewClientId === currentClientId;
  }
}
