import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { EstablishmentResponse } from '../../models/establishment-response';
import { EstablishmentRequest } from '../../models/establishment-request';
import { map, Observable } from 'rxjs';
import { CanchaResponse } from '../../models/cancha-response';

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

    getEstablishmentsByOwner(ownerId: string){
        return this.http.get<EstablishmentResponse[]>(`${this.url}/getEstablishmentsByOwnerId/${ownerId}`);
    }

    getCanchaTypes(establishmentId: number): Observable<string[]> {
        return this.http.get<CanchaResponse[]>(
            `http://localhost:8080/cancha/getCanchasByEstablishmentId/${establishmentId}`
        ).pipe(
            map(canchas => {
            // Extraer tipos únicos de canchas
            const uniqueTypes = [...new Set(canchas.map(c => c.canchaType))];
            return uniqueTypes;
            })
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
