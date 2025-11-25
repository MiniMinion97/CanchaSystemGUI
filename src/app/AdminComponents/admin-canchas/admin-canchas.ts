import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CanchaService } from '../../canchas/services/cancha/cancha-service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-canchas',
  imports: [],
  templateUrl: './admin-canchas.html',
  styleUrl: './admin-canchas.css'
})
export class AdminCanchas implements OnInit {
  private readonly canchaService = inject(CanchaService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected canchas = signal<any[]>([]);

  establishmentId = input<number>();

  constructor() {
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  private loadBrands() {
    const adminId = this.authService.getCurrentClientId();

    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.canchaService.getCanchasByEstablishment(Number(this.establishmentId())).subscribe({
      next: (res) => {
        console.log('✅ Canchas cargadas:', res);
        this.canchas.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando canchas:', err);
        this.canchas.set([]);
        this.loading.set(false);
      }
    });
    
  }

  handleDeleteDetails(canchaId: number) {
    this.canchaService.deleteCancha(canchaId).subscribe({
        next: (res) => {
          console.log('✅ Cancha eliminada con éxito:', res);
        },
        error: (err) => {
          console.error('❌ Error eliminando cancha:', err);
        }
    });
  }
}
