import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common'
import { OwnerResponse, OwnerService } from '../../owner-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminEstablishments } from '../../admin-establishments/admin-establishments';

@Component({
  selector: 'app-admin-owner-details',
  imports: [ReactiveFormsModule, AdminEstablishments],
  templateUrl: './admin-owner-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-owner-details.css'
})
export class AdminOwnerDetails {
  private readonly ownerService = inject(OwnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected owner = signal<OwnerResponse | undefined>(undefined);

  protected readonly isEditing = signal(false);

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['',Validators.required],
    lastName: ['',Validators.required],
    username: ['',Validators.required],
    mail: ['',[Validators.required, Validators.email]],
    cellNumber: ['',Validators.required]
  })

  constructor(private location: Location) {
    this.loadOwners();
  }

  private loadOwners() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const ownerId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.ownerService.getOwner(ownerId).subscribe({
      next: (res) => {
        this.owner.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando dueño:', err);
        this.owner.set(undefined);
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.error("❌ Formulario inválido");
      alert('El formulario es inválido. Revise nuevamente los datos ingresados.');
      return;
    }
    
    const value = this.form.getRawValue();

    this.ownerService.updateOwner(this.owner()?.id!, { ...value, active: true, password: '' }).subscribe({
        next: (res) => {
          alert('El dueño fue editado con éxito.');
        },
        error: (err) => {
          console.error('❌ Error editando dueño:', err);
        }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar el dueño ${this.owner()?.name} ${this.owner()?.lastName}?`)) return;

    this.ownerService.deleteOwner(this.owner()?.id!).subscribe({
        next: (res) => {
          alert("Dueño eliminado con éxito.")
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando dueño:', err);
          alert("Hubo un error al eliminar el dueño.")
          this.goBack();
        }
    });
  }

  goBack() {
    this.location.back();
  }
}
