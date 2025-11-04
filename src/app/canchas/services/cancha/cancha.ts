import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanchaResponse } from '../../models/cancha-response';
import { CanchaRequest } from '../../models/cancha-request';

@Injectable({
  providedIn: 'root'
})
export class Cancha {
    private readonly http = inject(HttpClient);
    private readonly url = "http://localhost:8080/cancha";

    getCanchas(){
        return this.http.get<CanchaResponse[]>(`${this.url}/findAllActive`);
    }

    getCancha(id: number){

    }

    createCancha(cancha: Cancha){

    }

    updateCancha(id: number, cancha:Cancha){

    }

    deleteCancha(id: number){

    }
}
