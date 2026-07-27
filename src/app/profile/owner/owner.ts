import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BrandForm } from '../../canchas/pages/brand-form/brand-form';

@Component({
  selector: 'app-owner',
  imports: [BrandForm],
  templateUrl: './owner.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './owner.css'
})
export class Owner {
  private readonly router = inject(Router)
  readonly creating = signal(false);

  goToMyData(){
    this.router.navigateByUrl("perfil/mis-datos");
  }

  goToMyBrands(){
    this.router.navigateByUrl("perfil/mis-marcas");
  }

  goToMyEstablishments(){
    this.router.navigateByUrl("perfil/mis-sucursales");
  }

  goToMyCanchas(){
    this.router.navigateByUrl("perfil/mis-canchas");
  }

  goToStatistics(){
    this.router.navigateByUrl("perfil/estadisticas");
  }

  toggleFormBrand(){
    this.creating.update(value => !value);
  }
}