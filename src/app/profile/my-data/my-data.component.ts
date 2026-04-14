import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/authservice';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Image } from '../../image/models/image';
import { ImageService } from '../../image/services/image-service';

@Component({
  selector: 'app-my-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-data.component.html',
  styleUrl: './my-data.component.css'
})
export class MyDataComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly imageService = inject(ImageService);

  readonly loading = signal(false);
  readonly success = signal(false);

  protected profilePicture = signal<Image | null>(null);
  protected newProfilePicture: File | null = null;
  protected newProfilePicturePreview: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    mail: ['', [Validators.required, Validators.email]],
    cellNumber: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.auth.getCurrentClientId();
    if (!id) return;

    this.loading.set(true);

    const role = this.auth.getRole();
    const baseUrl =
      role === 'ROLE_OWNER'
        ? `http://localhost:8080/owner/findOwner/${id}`
        : `http://localhost:8080/client/findClient/${id}`;

    this.http.get<any>(baseUrl).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          lastName: user.lastName,
          username: user.username,
          mail: user.mail,
          cellNumber: user.cellNumber
        });
        this.loadProfilePicture(user.username);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando datos del usuario', err);
        this.loading.set(false);
      }
    });
  }

  public getImage(imageId: number | string) {
    return this.imageService.getImageUrl(imageId);
  }

  private loadProfilePicture(id: string) {
    this.imageService.getImagesByClient(id).subscribe({
      next: (data) => {
        this.profilePicture.set(data);
      },
      error: (err) => {
        console.error('❌ Error loading images:', err);
      }
    });
  }

  saveChanges() {
    if (this.form.invalid) return;

    const id = this.auth.getCurrentClientId();
    const role = this.auth.getRole();
    if (!id || !role) return;

    this.loading.set(true);
    this.success.set(false);

    const requestBody = {
      ...this.form.getRawValue(),
      password: 'placeholder',
      active: true
    };


    // ✅ Elige el endpoint según el rol
    const endpoint =
      role === 'ROLE_OWNER'
        ? `http://localhost:8080/owner/update/${id}`
        : `http://localhost:8080/client/update/${id}`;


    this.http.put(endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        if (this.newProfilePicture) {
          this.imageService.updateProfilePicture(this.form.getRawValue().username!, this.newProfilePicture).subscribe({
            next: () => {
            },
            error: (err) => {
              console.error('❌ Error al actualizar foto de perfil', err);
            }
          });
        }
        this.success.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al actualizar', err);
        this.loading.set(false);
      }
    });
  }

  chooseProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newProfilePicture = input.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => this.newProfilePicturePreview = event.target.result;
      reader.readAsDataURL(this.newProfilePicture);
    }
  }
}
