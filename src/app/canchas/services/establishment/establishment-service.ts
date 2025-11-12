import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { EstablishmentResponse } from '../../models/establishment-response';
import { EstablishmentRequest } from '../../models/establishment-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
    private readonly http = inject(HttpClient);
    private readonly url = "http://localhost:8080/establishment";

    getEstablishments(){
        return this.http.get<EstablishmentResponse[]>(`${this.url}/findall`);
    }

    getEstablishmentById(establishmentId: number){
        return this.http.get<EstablishmentResponse>(`${this.url}/find/${establishmentId}`);
    }

    getEstablishmentsByBrand(id: number){
        return this.http.get<EstablishmentResponse[]>(`${this.url}/getEstablishmentsByBrandId/${id}`);
    }

 getCanchaTypes(establishmentId: number): Observable<{ id: number; type: string }[]> {
  return this.http.get<{ id: number; type: string }[]>(
    `${this.url}/${establishmentId}/canchas/types`
  );
}

    createEstablishment(establishment: EstablishmentRequest) {
        return this.http.post<EstablishmentResponse>(`${this.url}/insert`, establishment);
    }

    updateEstablishment(id: number, establishment: EstablishmentRequest){
        return this.http.put<EstablishmentResponse>(`${this.url}/update/${id}`, establishment);
    }

    deleteEstablishment(id: number){
        return this.http.delete<void>(`${this.url}/delete/${id}`);
    }


}
