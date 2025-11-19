import { Component, effect, inject, input, signal } from '@angular/core';
import { CanchaService } from '../../../canchas/services/cancha/cancha-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';

@Component({
  selector: 'app-my-canchas',
  standalone: true,
  imports: [],
  templateUrl: './my-canchas.component.html',
  styleUrl: './my-canchas.component.css'
})
export class MyCanchasComponent {

  private readonly canchasService = inject(CanchaService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);


  readonly isInsideEst = input<boolean>(false);
  readonly idEst = input<number | null>(null);

  protected canchas = signal<any[]>([]);

  protected loading = signal<boolean>(true);


  constructor() {
    effect(() => {
      this.loading.set(true); //cada vez que cambian inputs, arranca en "cargando"

      const inside = this.isInsideEst();
      const establishmentId = this.idEst();
      const ownerId = this.authService.getCurrentClientId();

      if (inside && establishmentId) {
        this.canchasService.getCanchasByEstablishment(establishmentId).subscribe({
          next: (res) => {
            this.canchas.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error obteniendo canchas por establecimiento:', err);
            this.canchas.set([]);
            this.loading.set(false);
          }
        });
      } else if (!inside) {
            if (!ownerId) {
            this.canchas.set([]);
            this.loading.set(false);
            return;
          }

          this.canchasService.getCanchasByOwner(ownerId).subscribe({
            next: (res) => {
              this.canchas.set(res);
              this.loading.set(false);
            },
          error: (err) => {
            console.error('Error obteniendo canchas:', err);
            this.canchas.set([]);
            this.loading.set(false);
          }
        });
      }
    });
  }

  handleDetails(id: number) {
    this.router.navigateByUrl(`/perfil/mis-canchas/${id}`);
  }
}
