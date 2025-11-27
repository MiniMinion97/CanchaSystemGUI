import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanchaService } from '../../../../canchas/services/cancha/cancha-service';
import { CanchaResponse } from '../../../../canchas/models/cancha-response';
import { CanchaForm } from '../../../../canchas/pages/cancha-form/cancha-form';
import { CanchaRequest } from '../../../../canchas/models/cancha-request';

@Component({
  selector: 'app-my-cancha-details',
  imports: [CanchaForm],
  templateUrl: './my-cancha-details.html',
  styleUrl: './my-cancha-details.css'
})
export class MyCanchaDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly canchaService = inject(CanchaService);
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  
  protected readonly isEditing = signal(false);
  readonly cancha = signal<CanchaResponse | null>(null);
  
  
  constructor() {
    this.canchaService.getCancha(this.id).subscribe({
      next: (res) => this.cancha.set(res),
      error: (err) => console.error('Error fetching brand:', err)
    });
  }


  toggleEdit(){
    this.isEditing.update(v => !v);
  }

  handleEdit(updated: CanchaRequest) {
      const current = this.cancha();
      if (current) {
        this.cancha.set({ ...current, ...updated });
      }
      this.toggleEdit();
    }

  handleDelete(){
  const confirmed = confirm('¿Estás seguro de que deseas eliminar esta cancha? Esta acción no se puede deshacer.');

  if (!confirmed) {
    return;
  }

  this.canchaService.deleteCancha(this.id).subscribe({
    next: (res) => {
      console.log('✅ Cancha eliminada', res);
      this.router.navigateByUrl('/perfil/mis-canchas');
    },
    error: (err) => {
      alert('❌ Error eliminando cancha');  
      console.error('❌ Error eliminando cancha', err)
    }
  });
}
}
