import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationResponse } from '../../models/reservation-response';
import { ReservationRequest } from '../../models/reservation-request';

@Injectable({
  providedIn: 'root'
})
export class Reservation {
  private readonly url = "http://localhost:8080/reservation";
  private readonly http = inject(HttpClient);

  getReservations() {
    return this.http.get<ReservationResponse[]>(`${this.url}/findall`);
  }

  getReservation(id: number) {
    return this.http.get<ReservationResponse>(`${this.url}/${id}`);
  }

  getReservationsByClient(clientId: number) {
    return this.http.get<ReservationResponse[]>(`${this.url}/findReservationsByClient`);
  }

  getReservationsByEstablishment(establishmentId: number) {
    return this.http.get<ReservationResponse[]>(`${this.url}/getReservationsByCanchaId/${establishmentId}`);
  }

  createReservation(reservation: ReservationRequest) {
    return this.http.post<ReservationRequest>(`${this.url}/insert`, reservation);
  }

  updateReservation(reservation: ReservationResponse) {
    return this.http.put<ReservationResponse>(`${this.url}/update`, reservation);
  }

  getAvailableHours(establishmentId: number, date: Date) {
    return this.http.get<any>(`${this.url}/getAvailableHours/${establishmentId}/${date}`);
  }







}
