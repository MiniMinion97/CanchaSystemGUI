import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../canchas/services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CanchaForm } from '../../../../canchas/pages/cancha-form/cancha-form';
import { CanchaService } from '../../../../canchas/services/cancha/cancha-service';
import { EstablishmentForm } from '../../../../canchas/pages/establishment-form/establishment-form';
import { EstablishmentResponse } from '../../../../canchas/models/establishment-response';
import { EstablishmentRequest } from '../../../../canchas/models/establishment-request';

@Component({
  selector: 'app-my-establishment-details',
  imports: [CanchaForm,EstablishmentForm],
  templateUrl: './my-establishment-details.html',
  styleUrl: './my-establishment-details.css'
})
export class MyEstablishmentDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly establishmentService = inject(EstablishmentService);
  private readonly canchaService = inject(CanchaService);
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  readonly creating = signal(false);

  protected readonly canchas = toSignal(this.canchaService.getCanchasByEstablishment(Number(this.id!)), { initialValue: [] });
  protected readonly showAll = signal(false);
  protected readonly isEditing = signal(false);
  readonly est = signal<EstablishmentResponse | null>(null);
  
  
  constructor() {
    this.establishmentService.getEstablishmentById(this.id).subscribe({
      next: (res) => this.est.set(res),
      error: (err) => console.error('Error fetching brand:', err)
    });
  }

  toggleCreate(){
    this.creating.update(value => !value);
  }

  handleDetails(id: Number){
    this.router.navigateByUrl(`perfil/mis-canchas/${id}`);
  }

  toggleShow(){
    this.showAll.update(v => !v);
  }


  toggleEdit(){
    this.isEditing.update(v => !v);
  }

    handleEdit(updated: EstablishmentRequest) {
      const current = this.est();
      if (current) {
        this.est.set({ ...current, ...updated });
      }
      this.toggleEdit();
    }

  handleDelete(){
    this.establishmentService.deleteEstablishment(Number(this.id!)).subscribe({
      next: () => {this.router.navigateByUrl('/perfil/mis-sucursales'); alert('Sucursal eliminada perfecto pa');},
      error: (err) => console.error('Error deleting establishment:', err)
    });
  }
}

