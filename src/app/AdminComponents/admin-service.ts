import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OwnerResponse } from './owner-service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly url = "http://localhost:8080/admin";
  private readonly http = inject(HttpClient);

  promoteClient(clientId: string) {
    return this.http.get<OwnerResponse>(`${this.url}/promote/${clientId}`);
  }
}
