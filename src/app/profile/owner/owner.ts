import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner',
  imports: [],
  templateUrl: './owner.html',
  styleUrl: './owner.css'
})
export class Owner {
  private readonly router = inject(Router)

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
}
