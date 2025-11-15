export interface ReservationResponse {
  id: number;
  client: any;
  cancha: {
    id: number;
    establishment: { id: number };
    canchaType: string;
  };
  reservationDate: string;
  matchDate: string;
  status: string;
}
