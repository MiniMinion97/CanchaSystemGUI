export interface ReservationRequest {
    establishmentId: number;
    canchaId: number;
    reservationDate: Date;
    matchDate: Date;
    deposit: number;
}
