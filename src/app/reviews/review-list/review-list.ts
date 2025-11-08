import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewResponse } from '../models/review-response';
import { ReviewItem } from '../review-item/review-item';


@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, ReviewItem],
  templateUrl: './review-list.html',
})
export class ReviewList {
  readonly reviews = input<ReviewResponse[]>([]);
  readonly currentClientId = input<string>();
  readonly edit = output<ReviewResponse>();
  readonly delete = output<number>();
}
