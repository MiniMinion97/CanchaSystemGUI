export interface ReviewRequest {
    rating: number;
    message?: string;
    establishmentId: number;
    clientId: string;
}
