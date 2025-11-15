import { Injectable,inject, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationResponse } from '../../models/reservation-response';
import { ReservationRequest } from '../../models/reservation-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly url = "http://localhost:8080/reservation";
  private readonly http = inject(HttpClient);

  getReservations() {
    return this.http.get<ReservationResponse[]>(`${this.url}/findall`);
  }

  getReservation(id: number) {
    return this.http.get<ReservationResponse>(`${this.url}/${id}`);
  }

  getReservationsByClient(id: string) {
    return this.http.get<ReservationResponse[]>(`${this.url}/findReservationsByClientId/${id}`);
  }

  getReservationsByEstablishment(establishmentId: number) {
    return this.http.get<ReservationResponse[]>(`${this.url}/getReservationsByCanchaId/${establishmentId}`);
  }

  getAvailableHours(establishmentId: number, date: string) {
        return this.http.get<any>(`${this.url}/getAvailableHours/${establishmentId}/${date}`);
  }

  createReservation(reservation: ReservationRequest) {
    return this.http.post<ReservationRequest>(`${this.url}/insert`, reservation);
  }

  updateReservation(id: Number,reservation: ReservationRequest) {
    return this.http.put<ReservationResponse>(`${this.url}/update/${id}`, reservation);
  }

  deleteReservation(id: Number){
      return this.http.delete<void>(`${this.url}/cancelReservation/${id}`);
  }







}
