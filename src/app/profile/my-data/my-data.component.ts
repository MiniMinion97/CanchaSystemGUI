import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/authservice';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-data.component.html',
  styleUrl: './my-data.component.css'
})
export class MyDataComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly success = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    mail: ['', [Validators.required, Validators.email]],
    cellNumber: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.auth.getCurrentClientId();
    if (!id) return;

    this.loading.set(true);

    const role = this.auth.getRole();
    const baseUrl =
      role === 'ROLE_OWNER'
        ? `http://localhost:8080/owner/findOwner/${id}`
        : `http://localhost:8080/client/findClient/${id}`;

    console.log(`📡 Obteniendo datos desde: ${baseUrl}`);

    this.http.get<any>(baseUrl).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          lastName: user.lastName,
          username: user.username,
          mail: user.mail,
          cellNumber: user.cellNumber
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando datos del usuario', err);
        this.loading.set(false);
      }
    });
  }

  saveChanges() {
    if (this.form.invalid) return;

    const id = this.auth.getCurrentClientId();
    const role = this.auth.getRole();
    if (!id || !role) return;

    this.loading.set(true);
    this.success.set(false);

    const requestBody = {
      ...this.form.getRawValue(),
      password: 'placeholder',
      active: true
    };

    console.log('📤 RequestBody enviado al backend:', JSON.stringify(requestBody, null, 2));

    // ✅ Elige el endpoint según el rol
    const endpoint =
      role === 'ROLE_OWNER'
        ? `http://localhost:8080/owner/update/${id}`
        : `http://localhost:8080/client/update/${id}`;

    console.log(`🚀 Enviando PUT a: ${endpoint}`);

    this.http.put(endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        console.log('✅ Datos actualizados correctamente', response);
        this.success.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al actualizar', err);
        this.loading.set(false);
      }
    });
  }
}
