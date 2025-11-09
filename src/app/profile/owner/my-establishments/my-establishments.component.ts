import { Component, effect, inject, input, signal } from '@angular/core';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-establishments',
  standalone: true,
  imports: [],
  templateUrl: './my-establishments.component.html',
  styleUrl: './my-establishments.component.css'
})
export class MyEstablishmentsComponent {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly router = inject(Router);


  readonly isInsideBrand = input<boolean>(false);
  readonly idBrand = input<number | null>(null);

  protected establishments = signal<any[]>([]);

  protected loading = signal<boolean>(true);

   constructor() {
    effect(() => {
      this.loading.set(true); // cada vez que cambian inputs, arranca en "cargando"

      const inside = this.isInsideBrand();
      const brandId = this.idBrand();

      if (inside && brandId) {
        this.establishmentService.getEstablishmentsByBrand(brandId).subscribe({
          next: (res) => {
            this.establishments.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error obteniendo establecimientos por brand:', err);
            this.establishments.set([]);
            this.loading.set(false);
          }
        });
      } else if (!inside) {
        this.establishmentService.getEstablishments().subscribe({
          next: (res) => {
            this.establishments.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error obteniendo establecimientos:', err);
            this.establishments.set([]);
            this.loading.set(false);
          }
        });
      }
    });
  }
  handleDetails(id: number) {
    this.router.navigateByUrl(`/perfil/mis-sucursales/${id}`);
  }
}
