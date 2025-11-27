import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../../canchas/services/brand/brand-service';
import { BrandResponse } from '../../../canchas/models/brand-response';
import { OwnerService } from '../../owner-service';
import { AdminEstablishments } from '../../admin-establishments/admin-establishments';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-brand-details',
  imports: [ReactiveFormsModule, AdminEstablishments],
  templateUrl: './admin-brand-details.html',
  styleUrl: './admin-brand-details.css'
})
export class AdminBrandDetails implements OnInit {
  readonly role = input<string>();

  private readonly brandService = inject(BrandService);
  private readonly ownerService = inject(OwnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected brand = signal<BrandResponse | undefined>(undefined);

  protected readonly isEditing = signal(false);

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    brandName: ['',Validators.required]
  })

  get id() {
    return String(this.brand()?.id);
  }

  constructor(private location: Location) {
  }

  ngOnInit(): void {
    this.loadBrand();
  }

  private loadBrand() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const brandId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.brandService.getBrand(Number(brandId)).subscribe({
      next: (res) => {
        this.brand.set(res);
        this.loading.set(false);

        this.form.patchValue({ brandName: res.brandName });
      },
      error: (err) => {
        console.error('❌ Error cargando marca:', err);
        this.brand.set(undefined);
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

    this.brandService.updateBrand(this.brand()?.id!, { ...value, active: true, ownerId: this.brand()?.ownerId! }).subscribe({
        next: (res) => {
          alert('La marca fue editada con éxito.');
        },
        error: (err) => {
          console.error('❌ Error editando marca:', err);
        }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar la marca ${this.brand()?.brandName}?`)) return;

    this.brandService.deleteBrand(this.brand()?.id!).subscribe({
        next: (res) => {
          alert('Marca eliminada con éxito.');
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando marca:', err);
          alert("Hubo un error al eliminar la marca.")
          this.goBack();
        }
    });
  }

  goBack() {
    this.location.back();
  }
}
