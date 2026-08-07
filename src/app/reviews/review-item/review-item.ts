import {Component, input, output, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReviewResponse } from '../models/review-response';
import {ImageService} from '../../image/services/image-service';
import {Image} from '../../image/models/image';
import {ClientService} from '../../AdminComponents/client-service';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './review-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./review-item.css'],
})
export class ReviewItem {
  private readonly imageService = inject(ImageService);
  private readonly clientService = inject(ClientService);
  protected profilePicture = signal<Image | null>(null);

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

  ngOnInit() {
    this.loadProfilePicture(this.review().clientId);
  }

  private loadProfilePicture(id: string) {
    this.clientService.getClient(id).subscribe({
      next: data => {
        this.imageService.getImagesByClient(data.username).subscribe({
          next: (data) => {
            this.profilePicture.set(data);
          },
          error: (err) => {
            console.error('❌ Error loading images:', err);
          }
        })
      },
      error: err => {
        console.error(err);
      }
    });
  }

  public getImage(imageId: number | string) {
    return this.imageService.getImageUrl(imageId);
  }
}
