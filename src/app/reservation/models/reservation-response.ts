export interface ReservationResponse {
    id: number;
    //establishmentId: number;
    clientId: string;
    canchaId: number;
    reservationDate: string;
    matchDate: string;
    //deposit?: number;
    //active?: boolean;
    status: string;
}
