export interface ReservationResponse {
  id: number;
  clientId: string;
  establishmentId: number;
  canchaId: number;
  canchaType: string;
  reservationDate: string;
  matchDate: string;
  status: string;
}
