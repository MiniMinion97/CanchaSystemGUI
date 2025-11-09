import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../../canchas/services/brand/brand-service';
import { EstablishmentForm } from '../../../../canchas/pages/establishment-form/establishment-form';
import { EstablishmentService } from '../../../../canchas/services/establishment/establishment-service';
import { BrandForm } from '../../../../canchas/pages/brand-form/brand-form';
import { BrandRequest } from '../../../../canchas/models/brand-request';
import { BrandResponse } from '../../../../canchas/models/brand-response'; // ✅ importante
import { toSignal } from '@angular/core/rxjs-interop';
import { MyEstablishmentsComponent } from '../../my-establishments/my-establishments.component';

@Component({
  selector: 'app-my-brand-details',
  imports: [EstablishmentForm, BrandForm,MyEstablishmentsComponent],
  templateUrl: './my-brand-details.html',
  styleUrl: './my-brand-details.css'
})
export class MyBrandDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly brandService = inject(BrandService);
  private readonly establishmentService = inject(EstablishmentService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id')!);

  // ✅ Ahora usamos BrandResponse
  readonly brand = signal<BrandResponse | null>(null);
  readonly establishments = toSignal(this.establishmentService.getEstablishmentsByBrand(this.id), { initialValue: [] });
  readonly creating = signal(false);
  protected isEditing = signal(false);
  protected showAll = signal(false);

  constructor() {
    this.brandService.getBrand(this.id).subscribe({
      next: (res) => this.brand.set(res),
      error: (err) => console.error('Error fetching brand:', err)
    });
  }

  toggleCreate() {
    this.creating.update(v => !v);
  }

  handleDetails(id: number) {
    this.router.navigateByUrl(`/perfil/mis-sucursales/${id}`);
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  toggleShow(){
    this.showAll.update(v => !v);
  }

  // 🔁 El formulario devuelve un BrandRequest, pero actualizamos el brand existente
  handleEdit(updated: BrandRequest) {
    const current = this.brand();
    if (current) {
      this.brand.set({ ...current, ...updated });
    }
    this.toggleEdit();
  }

  handleDelete() {
    this.brandService.deleteBrand(this.id).subscribe({
      next: () => {this.router.navigateByUrl('/perfil/mis-marcas'); alert('Marca eliminada perfecto pa');},
      error: (err) => console.error('Error deleting brand:', err)
    });
  }
}
