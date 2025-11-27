import { Component, inject, input, OnInit, signal } from '@angular/core';
import { EstablishmentService } from '../../canchas/services/establishment/establishment-service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';
import { EMPTY, Observable } from 'rxjs';
import { EstablishmentResponse } from '../../canchas/models/establishment-response';

@Component({
  selector: 'app-admin-establishments',
  imports: [],
  templateUrl: './admin-establishments.html',
  styleUrl: './admin-establishments.css'
})
export class AdminEstablishments implements OnInit {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected establishments = signal<any[]>([]);

  type = input<string>(); /* all, brand, owner */
  targetId = input<string>();

  constructor() {
  }

  ngOnInit(): void {
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

    let obs;
    
    if (this.type() === 'brand') {
      obs = this.establishmentService.getEstablishmentsByBrand(Number(this.targetId()!));
    } else if (this.type() === 'owner') {
      obs = this.establishmentService.getEstablishmentsByOwner(this.targetId()!);
    } else {
      obs = this.establishmentService.getEstablishments();
    }
    obs.subscribe({
      next: (res) => {
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
