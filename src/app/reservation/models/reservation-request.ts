export interface ReservationRequest {
    establishmentId?: number;
    canchaId: number;
    reservationDate?: Date;
    reservationStatus: string;
    matchDate: Date;
    //deposit: number;
}
