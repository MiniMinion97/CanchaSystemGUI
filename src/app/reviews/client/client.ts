import { Component, inject } from '@angular/core';
import { ReviewService } from '../review-service';
import { AuthService } from '../../auth/services/authservice';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client',
  imports: [],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {
  private readonly authservice = inject(AuthService);
  private readonly reviewservice = inject(ReviewService);

  protected readonly clientId = 1; // auth service get id

  protected readonly reviews = toSignal(this.reviewservice.getReviewsByClient(this.clientId)); 
  

}
