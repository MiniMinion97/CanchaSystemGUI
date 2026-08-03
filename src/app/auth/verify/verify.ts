import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { VerificationService } from '../services/verification-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './verify.css',
})
export class Verify {
  private readonly verificationService = inject(VerificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly token = this.route.snapshot.paramMap.get('token');
  private readonly router = inject(Router);
  protected message = signal<string>("Verificando cuenta...");

  ngOnInit() {
    this.verificationService.verifyToken(this.token!).subscribe({
      next: () => {
        this.message.set("Verificación completada. Inicie sesión para ingresar")
        setTimeout(() => {
          this.router.navigate(['/explorar']);
        }, 5000);
      },
      error: () => {
        this.message.set("La verificación ha expirado. Intente registrarse nuevamente.")
      }
    })
  }
}
