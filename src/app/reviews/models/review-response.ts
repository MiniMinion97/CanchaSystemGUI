// src/app/reviews/models/review-response.ts
export interface ReviewResponse {
  id: number;
  rating: number;
  message?: string;
  createdAt: string;
  clientName: string;
  active: boolean;
  clientId: string;
  establishmentId: number;
}
