import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';
import { EstablishmentResponse } from '../../../canchas/models/establishment-response';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminReservation } from '../../admin-reservation/admin-reservation';
import { AdminReviews } from '../../admin-reviews/admin-reviews';
import { Location } from '@angular/common';
import {AddressRequest} from '../../../canchas/models/address-request';
import {AddressService} from '../../../canchas/services/address/address-service';
import {AddressInput} from '../../../canchas/address-input/address-input';

@Component({
  selector: 'app-admin-establishment-details',
  imports: [ReactiveFormsModule, AdminReservation, AdminReviews, AddressInput],
  templateUrl: './admin-establishment-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-establishment-details.css'
})
export class AdminEstablishmentDetails {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(AddressService);

  protected loading = signal<boolean>(true);
  protected establishment = signal<EstablishmentResponse | undefined>(undefined);

  protected readonly isEditing = signal(false);

  private previousAddress?: AddressRequest;
  protected address?: AddressRequest;

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['',Validators.required],
    canShower: [false],
    openingHour: [new Date(),Validators.required],
    closingHour: [new Date(),Validators.required]
  })

  constructor(private location: Location) {
    this.loadEstablishments();
  }

  private loadEstablishments() {
    const adminId = this.authService.getCurrentClientId();
    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    const establishmentId = this.route.snapshot.paramMap.get('id')!;

    this.loading.set(true);

    this.establishmentService.getEstablishmentById(Number(establishmentId)).subscribe({
      next: (res) => {
        this.establishment.set(res);
        this.loading.set(false);
        this.loadAddress();

        this.form.patchValue({ ...res });
      },
      error: (err) => {
        console.error('❌ Error cargando sucursal:', err);
        this.establishment.set(undefined);
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid || !this.address) {
      console.error("❌ Formulario inválido");
      alert('El formulario es inválido. Revise nuevamente los datos ingresados.');
      return;
    }

    if (this.address === this.previousAddress) {
      this.submit(this.establishment()?.addressId!);
    } else {
      this.addressService.insertAddress(this.address!).subscribe({
        next: address => {
          this.submit(address.id);
        }
      });
    }
  }

  private submit(addrId: number) {
    const value = this.form.getRawValue();

    this.establishmentService.updateEstablishment(this.establishment()?.id!, { ...value, addressId: addrId, brandId: this.establishment()?.brandId! }).subscribe({
      next: () => {
        alert('La sucursal fue editada con éxito.');
      },
      error: (err) => {
        console.error('❌ Error editando sucursal:', err);
      }
    });
  }

  handleDelete() {
    if (!confirm(`¿Seguro que quiere eliminar la sucursal ${this.establishment()?.name}?`)) return;

    this.establishmentService.deleteEstablishment(this.establishment()?.id!).subscribe({
        next: () => {
          alert("Sucursal eliminada con éxito.")
          this.goBack();
        },
        error: (err) => {
          console.error('❌ Error eliminando sucursal:', err);
          alert("Hubo un error al eliminar la sucursal.")
          this.goBack();
        }
    });
  }

  protected onAddressSelected(address: AddressRequest) {
    console.log(address);
    this.address = address;
  }

  private loadAddress() {
    this.addressService.getAddress(this.establishment()?.addressId!).subscribe({
      next: address => {
        this.address = address;
        this.previousAddress = address;
      },
      error: (err) => {
        console.error('❌ Error loading address:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

