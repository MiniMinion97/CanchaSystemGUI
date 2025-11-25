import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface OwnerResponse {
  id: string;
  name: string;
  lastName: string;
  username: string;
  mail: string;
  cellNumber: string;
  role: string;
}

export interface OwnerRequest {
  name: string;
  lastName: string;
  username: string;
  password: string;
  mail: string;
  cellNumber: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private readonly url = "http://localhost:8080/owner";
  private readonly http = inject(HttpClient);

  getOwners() {
    return this.http.get<OwnerResponse[]>(`${this.url}/findallActive`);
  }

  getOwner(id: string) {
    return this.http.get<OwnerResponse>(`${this.url}/findOwner/${id}`);
  }

  createOwner(owner: OwnerRequest) {
    return this.http.post<OwnerRequest>(`${this.url}/insert`, owner);
  }

  updateOwner(id: string, owner: OwnerRequest) {
    return this.http.put<OwnerResponse>(`${this.url}/updateAdmin/${id}`, owner);
  }

  deleteOwner(id: string) {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
