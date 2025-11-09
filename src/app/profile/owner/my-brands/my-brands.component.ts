import { Component, effect, inject, signal } from '@angular/core';
import { BrandService } from '../../../canchas/services/brand/brand-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-brands',
  standalone: true,
  imports: [],
  templateUrl: './my-brands.component.html',
  styleUrl: './my-brands.component.css'
})
export class MyBrandsComponent {
    private readonly brandService = inject(BrandService);
    private readonly router = inject(Router);



  protected loading = signal<boolean>(true);

  protected brands = signal<any[]>([]);

  constructor() {
    effect(() => {
      this.loading.set(true); //cada vez que cambian inputs, arranca en "cargando"
      this.brandService.getBrands().subscribe({
          next: (res) => {
            this.brands.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error obteniendo marcas:', err);
            this.brands.set([]);
            this.loading.set(false);
          }
        });
      });
    }
  

  

  handleDetails(brandId: number) {
    this.router.navigateByUrl(`/perfil/mis-marcas/${brandId}`);
  }

}
