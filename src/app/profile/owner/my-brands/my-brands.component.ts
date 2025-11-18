import { Component, effect, inject, signal } from '@angular/core';
import { BrandService } from '../../../canchas/services/brand/brand-service';
import { AuthService } from '../../../auth/services/authservice';  // ✅ Importar
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-brands',
  standalone: true,
  imports: [],
  templateUrl: './my-brands.component.html',
  styleUrl: './my-brands.component.css'
})
export class MyBrandsComponent {
  private readonly brandService = inject(BrandService);
  private readonly authService = inject(AuthService);  // ✅ Inyectar
  private readonly router = inject(Router);

  protected loading = signal<boolean>(true);
  protected brands = signal<any[]>([]);

  constructor() {
    this.loadBrands();
  }

  private loadBrands() {
    // ✅ Obtener el ID del owner logueado
    const ownerId = this.authService.getCurrentClientId();  // o getCurrentOwnerId() si tenés uno específico
    
    if (!ownerId) {
      console.error('❌ No hay owner logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    
    // ✅ Llamar al servicio con el ownerId
    this.brandService.getBrandsByOwner(ownerId).subscribe({
      next: (res) => {
        console.log('✅ Brands del owner:', res);
        this.brands.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error obteniendo marcas:', err);
        this.brands.set([]);
        this.loading.set(false);
      }
    });
  }

  handleDetails(brandId: number) {
    this.router.navigateByUrl(`/perfil/mis-marcas/${brandId}`);
  }
}