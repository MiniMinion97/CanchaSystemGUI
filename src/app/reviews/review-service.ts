import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReviewResponse } from './models/review-response';
import { ReviewRequest } from './models/review-request';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {  
  private readonly http = inject(HttpClient);
  private readonly url = "http://localhost:8080/review";
  
  getReviewsByEstablishment(establishmentId: number) {
    return this.http.get<ReviewResponse[]>(`${this.url}/byEstablishment/${establishmentId}`);
  }

  getReviewsByClient(clientId: number) {
    return this.http.get<ReviewResponse[]>(`${this.url}/findReviewsByClient/${clientId}`);
  }

  createReview(review: ReviewRequest) {
    return this.http.post<ReviewResponse>(`${this.url}/insert`, review);
  }

  updateReview(id: number, review: ReviewRequest) {
    return this.http.put<ReviewResponse>(`${this.url}/update`, review);
  }

  deleteReview(id: number) {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  clientAlreadyReviewed(establishmentId: number, clientId: number) {
    return this.http.get<boolean>(`${this.url}/clientReviewExists/${establishmentId}/${clientId}`);
  }


}
