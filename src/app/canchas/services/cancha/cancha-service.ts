import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanchaResponse } from '../../models/cancha-response';
import { CanchaRequest } from '../../models/cancha-request';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {
    private readonly http = inject(HttpClient);
    private readonly url = "http://localhost:8080/cancha";

    getActiveCanchas(){
        return this.http.get<CanchaResponse[]>(`${this.url}/findallactive`);
    }

    getCanchas(){
        return this.http.get<CanchaResponse[]>(`${this.url}/findall`);
    }

    getCancha(id: number){
        return this.http.get<CanchaResponse>(`${this.url}/findCanchaById/${id}`);
    }

    getCanchasByEstablishment(establishmentId: number){
        return this.http.get<CanchaResponse[]>(`${this.url}/getCanchasByEstablishmentId/${establishmentId}`);
    }

    createCancha(cancha: CanchaRequest){
        console.log('POST /cancha ->', cancha);
        return this.http.post<CanchaResponse>(`${this.url}/insert`, cancha);
    }

    updateCancha(id: number, cancha:CanchaRequest){
      return this.http.put<CanchaResponse>(`${this.url}/update/${id}`, cancha);
    }

    deleteCancha(id: number){
        return this.http.delete<void>(`${this.url}/dropCanchaById/${id}`);
    }
}
