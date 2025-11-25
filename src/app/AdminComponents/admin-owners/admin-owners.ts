import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';
import { OwnerService } from '../owner-service';

@Component({
  selector: 'app-admin-owners',
  imports: [],
  templateUrl: './admin-owners.html',
  styleUrl: './admin-owners.css'
})
export class AdminOwners {
  private readonly ownerService = inject(OwnerService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected owners = signal<any[]>([]);

  constructor() {
    this.loadOwners();
  }

  private loadOwners() {
    const adminId = this.authService.getCurrentClientId();

    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.ownerService.getOwners().subscribe({
      next: (res) => {
        console.log('✅ Owners cargados:', res);
        this.owners.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando owners:', err);
        this.owners.set([]);
        this.loading.set(false);
      }
    });
  }

  handleDetails(ownerId: string) {
    this.router.navigateByUrl(`/admin/duenos/${ownerId}`);
  }
}
