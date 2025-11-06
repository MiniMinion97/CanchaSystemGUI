import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BrandForm } from '../../canchas/pages/brand-form/brand-form';

@Component({
  selector: 'app-owner',
  imports: [BrandForm],
  templateUrl: './owner.html',
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

  toggleFormBrand(){
    this.creating.update(value => !value);
  }
}
