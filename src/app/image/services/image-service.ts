import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Image } from '../models/image';
import { ImageProviderType } from '../models/image-provider-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly url = "http://localhost:8080/image";

  getImage(imageId: number) {
    return this.http.get<Image[]>(`${this.url}/${imageId}`);
  }

  getImageUrl(imageId: number | string) {
    return `${this.url}/${imageId}`;
  }
  
  getImagesByEstablishment(establishmentId: number) {
    return this.http.get<Image[]>(`${this.url}/establishment/${establishmentId}`);
  }

  getImagesByClient(clientUsername: string) {
    return this.http.get<Image[]>(`${this.url}/user/${clientUsername}`);
  }

  createImages(uploadData: number, imageType: ImageProviderType, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('type', imageType);

    for (const file of images) {
      formData.append('files', file);
    }
    return this.http.post(`${this.url}/insert/${uploadData}`, formData);
  }


  updateImage(id: string, image: Image) {
    return this.http.put<Image>(`${this.url}/update/${id}`, image);
  }

  deleteImages(ids: string[]) {
    return this.http.post(`${this.url}/delete`, ids);
  }

  deleteImage(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
