export interface ReservationResponse {
    id: number;
    establishmentId: number;
    canchaId: number;
    reservationDate: Date;
    matchDate: Date;
    deposit: number;
    active: boolean;
    status: string;
}
