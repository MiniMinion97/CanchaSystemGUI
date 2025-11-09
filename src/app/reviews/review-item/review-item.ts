import { Component, input, output, inject } from '@angular/core';
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
  readonly currentClientId = input<string>(); // from auth context
  readonly edit = output<ReviewResponse>();
  readonly delete = output<number>();

  protected readonly stars = [1, 2, 3, 4, 5];

  isOwner(): boolean {
    return this.review()?.clientId === this.currentClientId();
  }
}

