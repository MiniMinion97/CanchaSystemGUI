export interface ReservationRequest {
    establishmentId?: number;
    canchaType: string;
    reservationDate?: Date;
    status: string;
    matchDate: Date;
}
