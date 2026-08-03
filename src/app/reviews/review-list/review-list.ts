import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

import { ReviewResponse } from '../models/review-response';
import { ReviewItem } from '../review-item/review-item';


@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [ReviewItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css']
})
export class ReviewList {
  readonly reviews = input.required<ReviewResponse[]>();
  readonly currentUserId = input<string | null>(null);
  readonly isLoggedIn = input<boolean>(false);
  readonly edit = output<ReviewResponse>();
  readonly delete = output<number>();

  readonly reviewsWithPermissions = computed(() =>
  this.reviews().map(review => ({
    review,
    canModify: this.isLoggedIn() && review.clientId === this.currentUserId()  // review.clientId
  }))
);
}
