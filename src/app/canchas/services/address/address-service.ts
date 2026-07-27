import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddressRequest} from '../../models/address-request';
import {AddressResponse} from '../../models/address-response';

@Service()
export class AddressService {
  private readonly url = "http://localhost:8080/address";
  private readonly http = inject(HttpClient);

  getAddress(id: number) {
    return this.http.get<AddressResponse>(`${this.url}/find/${id}`);
  }

  insertAddress(addressRequest: AddressRequest) {
    return this.http.post<AddressRequest>(`${this.url}/insert`, addressRequest);
  }

  deleteAddress(id: number) {
    return this.http.delete<AddressRequest>(`${this.url}/delete/${id}`);
  }
}
