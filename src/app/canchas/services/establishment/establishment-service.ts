import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { EstablishmentResponse } from '../../models/establishment-response';
import { EstablishmentRequest } from '../../models/establishment-request';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
    private readonly http = inject(HttpClient);
    private readonly url = "http://localhost:8080/establishment";

    getEstablishments(){
        return this.http.get<EstablishmentResponse[]>(`${this.url}/findAllActive`);
    }


    createEstablishment(establishment: EstablishmentRequest) {
        return this.http.post<EstablishmentResponse>(`${this.url}/insert`, establishment);
    }

}
