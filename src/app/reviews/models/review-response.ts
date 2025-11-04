export interface ReviewResponse {
    id: number;
    rating: number;
    message?: string;
    establishmentId: number;
    clientId: string;
}
