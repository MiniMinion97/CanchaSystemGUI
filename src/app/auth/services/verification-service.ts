import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private readonly apiUrl = 'http://localhost:8080';
  private readonly http = inject(HttpClient);

  verifyToken(token: string) {
    return this.http.get<any>(`${this.apiUrl}/verify/${token}`);
  }
}
