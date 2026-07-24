import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { EstablishmentMetric } from '../models/establishment-metric';
import { PeakHour } from '../models/peak-hour';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly url = "http://localhost:8080/establishment/statistics";

  getRatingRanking(ownerId: string) {
    return this.http.get<EstablishmentMetric[]>(`${this.url}/ratingRanking/${ownerId}`);
  }

  getReservationRanking(ownerId: string) {
    return this.http.get<EstablishmentMetric[]>(`${this.url}/reservationRanking/${ownerId}`);
  }

  getPeakHours(ownerId: string) {
    return this.http.get<PeakHour[]>(`${this.url}/peakHours/${ownerId}`);
  }

  getCancellationRate(ownerId: string) {
    return this.http.get<EstablishmentMetric[]>(`${this.url}/cancellationRate/${ownerId}`);
  }

  getRevenue(ownerId: string) {
    return this.http.get<EstablishmentMetric[]>(`${this.url}/revenue/${ownerId}`);
  }
}