import { Component, inject, signal } from '@angular/core';
import { ClientService } from '../client-service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-clients',
  imports: [],
  templateUrl: './admin-clients.html',
  styleUrl: './admin-clients.css'
})
export class AdminClients {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected clients = signal<any[]>([]);

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

    this.loading.set(true);

    this.clientService.getClients().subscribe({
      next: (res) => {
        console.log('✅ Clientes cargados:', res);
        this.clients.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando clientes:', err);
        this.clients.set([]);
        this.loading.set(false);
      }
    });
  }

  handleDetails(clientId: string) {
    this.router.navigateByUrl(`/admin/clientes/${clientId}`);
  }
}

