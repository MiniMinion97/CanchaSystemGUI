export interface ReviewRequest {
    rating: number;
    message?: string;
    establishmentId: number;
    clientName?: string;
    createdAt?: string;
    clientId: string;
}
