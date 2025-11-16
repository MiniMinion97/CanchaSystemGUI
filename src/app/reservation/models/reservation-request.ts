export interface ReservationRequest {
    establishmentId?: number;
    canchaType: string;
    reservationDate?: Date;
    reservationStatus: string;
    matchDate: Date;
}
