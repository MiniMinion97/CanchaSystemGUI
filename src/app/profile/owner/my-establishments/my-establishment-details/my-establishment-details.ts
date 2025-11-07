import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../canchas/services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CanchaForm } from '../../../../canchas/pages/cancha-form/cancha-form';
import { CanchaService } from '../../../../canchas/services/cancha/cancha-service';

@Component({
  selector: 'app-my-establishment-details',
  imports: [CanchaForm],
  templateUrl: './my-establishment-details.html',
  styleUrl: './my-establishment-details.css'
})
export class MyEstablishmentDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly establishmentService = inject(EstablishmentService);
  private readonly canchaService = inject(CanchaService);
  private readonly id = this.route.snapshot.paramMap.get('id');

  readonly est = toSignal(this.establishmentService.getEstablishment(Number(this.id!)), { initialValue: null });
  readonly creating = signal(false);

  protected readonly canchas = toSignal(this.canchaService.getCanchasByEstablishment(Number(this.id!)), { initialValue: [] });
  
  toggleCreate(){
    this.creating.update(value => !value);
  }

  handleDetails(){
    this.router.navigateByUrl(`perfil/mis-canchas/${this.id}`);
  }

}
