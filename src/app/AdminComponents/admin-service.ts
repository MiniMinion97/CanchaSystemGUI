import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OwnerResponse } from './owner-service';
import { StatsResponse } from '../canchas/models/stats-response';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly url = "http://localhost:8080/admin";
  private readonly http = inject(HttpClient);

  promoteClient(clientId: string) {
    return this.http.get<OwnerResponse>(`${this.url}/promote/${clientId}`);
  }

  getStats(from?: string, until?: string) {
    let params = new HttpParams();
    if (from && until) {
      params = params.set('from', from).set('until', until);
    }
    return this.http.get<StatsResponse>(`${this.url}/stats`, { params });
  }
}