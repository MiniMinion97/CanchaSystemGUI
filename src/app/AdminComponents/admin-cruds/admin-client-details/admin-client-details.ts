import { Component, inject, input, signal } from '@angular/core';
import { ClientResponse, ClientService } from '../../client-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-client-details',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-client-details.html',
  styleUrl: './admin-client-details.css'
})
export class AdminClientDetails {
  readonly role = input<string>();

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

  constructor() {
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
        console.log('✅ Cliente cargado:', res);
        this.client.set(res);
        this.loading.set(false);

        this.form.patchValue(res);
      },
      error: (err) => {
        console.error('❌ Error cargando cliente:', err);
        this.client.set(undefined);
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

    this.clientService.updateClient(this.client()?.id!, { ...value, active: true, password: '' }).subscribe({
        next: (res) => {
          console.log('✅ Edición de cliente exitosa:', res);
        },
        error: (err) => {
          console.error('❌ Error editando cliente:', err);
        }
    });
  }

  handleDelete() {
    this.clientService.deleteClient(this.client()?.id!).subscribe({
        next: (res) => {
          console.log('✅ Cliente eliminado con éxito:', res);
        },
        error: (err) => {
          console.error('❌ Error eliminando cliente:', err);
        }
    });
  }
}
