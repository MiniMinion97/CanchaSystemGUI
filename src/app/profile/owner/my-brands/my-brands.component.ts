import { Component, inject } from '@angular/core';
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

  protected readonly brands = toSignal(this.brandService.getBrands(),
    { initialValue: [] });


  handleDetails(brandId: number) {
    this.router.navigateByUrl(`/perfil/mis-marcas/${brandId}`);
  }

}
