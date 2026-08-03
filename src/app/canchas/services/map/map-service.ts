import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddressRequest } from '../../models/address-request';

@Service()
export class MapService {
  private readonly url = "http://localhost:8080/map";
  private readonly http = inject(HttpClient);

  getAutocomplete(address: string) {
    return this.http.get<AddressRequest[]>(`${this.url}/autocomplete/${encodeURIComponent(address)}`);
  }

  getReverseGeocoding(lat: number, lng: number) {
    return this.http.get<AddressRequest>(`${this.url}/reversegeocoding/${lat}/${lng}`);
  }
}
