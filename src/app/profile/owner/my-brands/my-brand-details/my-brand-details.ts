import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../../canchas/services/brand/brand-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { EstablishmentForm } from '../../../../canchas/pages/establishment-form/establishment-form';
import { EstablishmentService } from '../../../../canchas/services/establishment/establishment-service';

@Component({
  selector: 'app-my-brand-details',
  imports: [EstablishmentForm],
  templateUrl: './my-brand-details.html',
  styleUrl: './my-brand-details.css'
})
export class MyBrandDetails {
   private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly brandService = inject(BrandService);
  private readonly establishmentService = inject(EstablishmentService);

  private readonly id = this.route.snapshot.paramMap.get('id');

  readonly brand = toSignal(this.brandService.getBrand(Number(this.id!)), { initialValue: null });
  readonly esblishments = toSignal(this.establishmentService.getEstablishmentsByBrand(Number(this.id!)), { initialValue: [] });
  readonly creating = signal(false);

  toggleCreate(){
    this.creating.update(value => !value);
  }

  handleDetails(id: number){
    this.router.navigateByUrl(`/perfil/mis-sucursales/${12}`);
  }
}
