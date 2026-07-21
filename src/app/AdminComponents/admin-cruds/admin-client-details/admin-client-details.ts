import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { ClientResponse, ClientService } from '../../client-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminReservation } from "../../admin-reservation/admin-reservation";
import { AdminReviews } from "../../admin-reviews/admin-reviews";
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-client-details',
  imports: [ReactiveFormsModule, AdminReservation, AdminReviews],
  templateUrl: './admin-client-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-client-details.css'
})
export class AdminClientDetails {
  private readonly clientService = inject(ClientService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected client = signal<ClientResponse | undefined>(undefined);

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
    this.loadClients();
  }

  private loadClients() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const clientId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.clientService.getClient(clientId).subscribe({
      next: (res) => {
        this.client.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando cliente:', err);
        this.client.set(undefined);
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

    this.clientService.updateClient(this.client()?.id!, { ...value, active: true, password: '' }).subscribe({
        next: (res) => {
          alert('El cliente fue editado con éxito.');
        },
        error: (err) => {
          console.error('❌ Error editando cliente:', err);
        }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar el cliente ${this.client()?.name} ${this.client()?.lastName}?`)) return;

    this.clientService.deleteClient(this.client()?.id!).subscribe({
        next: (res) => {
          alert('Cliente eliminado con éxito.');
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando cliente:', err);
          alert("Hubo un error al eliminar el cliente.")
          this.goBack();
        }
    });
  }

  goBack() {
    this.location.back();
  }
}
