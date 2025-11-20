import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface ClientResponse {
  id: string;
  name: string;
  lastName: string;
  username: string;
  mail: string;
  cellNumber: string;
  role: string;
}

export interface ClientRequest {
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
export class ClientService {
  private readonly url = "http://localhost:8080/client";
  private readonly http = inject(HttpClient);

  getClients() {
    return this.http.get<ClientResponse[]>(`${this.url}/findallActive`);
  }

  getClient(id: string) {
    return this.http.get<ClientResponse>(`${this.url}/findClient/${id}`);
  }

  createClient(client: ClientRequest) {
    return this.http.post<ClientRequest>(`${this.url}/insertClient`, client);
  }

  updateClient(id: string, client: ClientRequest) {
    return this.http.put<ClientRequest>(`${this.url}/updateAdmin/${id}`, client);
  }

  deleteClient(id: string) {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
