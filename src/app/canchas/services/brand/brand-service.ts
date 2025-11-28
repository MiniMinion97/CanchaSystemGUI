import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrandRequest } from '../../models/brand-request';
import { BrandResponse } from '../../models/brand-response';

@Injectable({
  providedIn: 'root'
})

export class BrandService {
  private readonly url = "http://localhost:8080/canchaBrand";
  private readonly http = inject(HttpClient);

  getBrands() {
    return this.http.get<BrandResponse[]>(`${this.url}/findall`);
  }

  getBrand(id: number) {

    return this.http.get<BrandResponse>(`${this.url}/findCanchaBrand/${id}`);
  }

  getBrandsByOwner(ownerId: string) {
    return this.http.get<BrandResponse[]>(`${this.url}/getBrandsByOwnerId/${ownerId}`);
  }

  createBrand(brand: BrandRequest) {
    return this.http.post<BrandRequest>(`${this.url}/insert`, brand);
  }

  updateBrand(id: number, brand: BrandRequest) {
  return this.http.put<BrandResponse>(`${this.url}/update/${id}`, brand);
  }


  deleteBrand(id: number) {
    return this.http.delete<void>(`${this.url}/deleteCanchaBrand/${id}`);
  }
}
