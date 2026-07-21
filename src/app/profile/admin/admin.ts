import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin.css'
})
export class Admin {
  private readonly router = inject(Router);
  readonly creating = signal(false);

  goToOwners(){
    this.router.navigateByUrl("admin/duenos");
  }

  goToClients(){
    this.router.navigateByUrl("admin/clientes");
  }

  goToBrands(){
    this.router.navigateByUrl("admin/marcas");
  }

  goToEstablishments(){
    this.router.navigateByUrl("admin/sucursales");
  }

}
