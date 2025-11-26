import { Component, inject, signal } from '@angular/core';
import { BrandService } from '../../canchas/services/brand/brand-service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-brands',
  imports: [],
  templateUrl: './admin-brands.html',
  styleUrl: './admin-brands.css'
})
export class AdminBrands {
  private readonly brandService = inject(BrandService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected brands = signal<any[]>([]);

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

    this.brandService.getBrands().subscribe({
      next: (res) => {
        console.log('✅ Marcas cargadas:', res);
        this.brands.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando marcas:', err);
        this.brands.set([]);
        this.loading.set(false);
      }
    });
  }

  handleDetails(brandId: number) {
    this.router.navigateByUrl(`/admin/marcas/${brandId}`);
  }
}
