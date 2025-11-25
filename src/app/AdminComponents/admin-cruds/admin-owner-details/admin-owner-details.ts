import { Component, inject, input, signal } from '@angular/core';
import { OwnerResponse, OwnerService } from '../../owner-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-owner-details',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-owner-details.html',
  styleUrl: './admin-owner-details.css'
})
export class AdminOwnerDetails {
  readonly role = input<string>();

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

  constructor() {
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
        console.log('✅ Ownere cargado:', res);
        this.owner.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando ownere:', err);
        this.owner.set(undefined);
        this.loading.set(false);
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.error("❌ Formulario inválido");
      return;
    }
    
    console.log("✅ Formulario válido");
    const value = this.form.getRawValue();

    this.ownerService.updateOwner(this.owner()?.id!, { ...value, active: true, password: '' }).subscribe({
        next: (res) => {
          console.log('✅ Edición de ownere exitosa:', res);
        },
        error: (err) => {
          console.error('❌ Error editando ownere:', err);
        }
    });
  }

  handleDelete() {
    this.ownerService.deleteOwner(this.owner()?.id!).subscribe({
        next: (res) => {
          console.log('✅ Ownere eliminado con éxito:', res);
        },
        error: (err) => {
          console.error('❌ Error eliminando ownere:', err);
        }
    });
  }
}
