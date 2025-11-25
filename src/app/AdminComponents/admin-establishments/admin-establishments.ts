import { Component, inject, signal } from '@angular/core';
import { EstablishmentService } from '../../canchas/services/establishment/establishment-service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-establishments',
  imports: [],
  templateUrl: './admin-establishments.html',
  styleUrl: './admin-establishments.css'
})
export class AdminEstablishments {
private readonly establishmentService = inject(EstablishmentService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected establishments = signal<any[]>([]);

  constructor() {
    this.loadBrands();
  }

  private loadBrands() {
    const adminId = this.authService.getCurrentClientId();

    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.establishmentService.getEstablishments().subscribe({
      next: (res) => {
        console.log('✅ Sucursales cargadas:', res);
        this.establishments.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando sucursales:', err);
        this.establishments.set([]);
        this.loading.set(false);
      }
    });
  }

  handleDetails(establishmentId: number) {
    this.router.navigateByUrl(`/admin/sucursales/${establishmentId}`);
  }
}
