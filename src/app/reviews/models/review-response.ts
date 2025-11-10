// src/app/reviews/models/review-response.ts
export interface ReviewResponse {
  id: number;
  rating: number;
  message: string;
  createdAt: string;
  clientName: string;
  active: boolean;

  client?: {
    id: string;
    name: string;
    lastName: string;
    username: string;
    role: {
      id: number;
      name: string;
    };
    roleName: string;
  };

  establishment?: {
    id: number;
    name: string;
  };
}
