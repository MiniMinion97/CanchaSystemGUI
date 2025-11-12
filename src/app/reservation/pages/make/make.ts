import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation/reservation-service';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';

@Component({
  selector: 'app-make',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './make.html',
  styleUrl: './make.css'
})
export class Make {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly establishmentService = inject(EstablishmentService);

  readonly establishmentId = input<number>();
  readonly reserved = output<any>();

  readonly availableHours = signal<string[]>([]);
  readonly loading = signal(false);

  protected readonly today = new Date().toISOString().split('T')[0];

readonly canchaTypes = signal<{ id: number; type: string }[]>([]);

readonly form = this.fb.nonNullable.group({
  canchaId: [null as number | null, Validators.required],
  date: ['', Validators.required],
  hour: ['', Validators.required]
});



  constructor() {
    // Load cancha types when establishmentId changes
    effect(() => {
      const id = this.establishmentId();
      if (id) {
        this.loadCanchaTypes(id);
      }
    });

    // Watch for date changes (convert to string for backend)
    this.form.controls.date.valueChanges.subscribe((dateValue) => {
      if (dateValue && this.establishmentId()) {
        const dateString =
          typeof dateValue === 'string'
            ? dateValue
            : new Date(dateValue).toISOString().split('T')[0];

        this.loadAvailableHours(this.establishmentId()!, dateString);
      }
    });
  }

private loadCanchaTypes(establishmentId: number) {
  this.establishmentService.getCanchaTypes(establishmentId).subscribe((types) => {
    this.canchaTypes.set(types);
  });
}



  // ✅ Fix argument type and Object.values() issue
  private loadAvailableHours(establishmentId: number, date: string) {
    this.loading.set(true);
    this.reservationService.getAvailableHours(establishmentId, date).subscribe({
      next: (response) => {
        // Backend: { "Fútbol 5": ["09:00","10:00"], "Tenis": ["11:00","12:00"] }
        const allHours = Object.keys(response)
          .map((key) => response[key])
          .reduce((acc: any[], curr: any[]) => acc.concat(curr), []);

        this.availableHours.set(allHours);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  handleSubmit() {
  if (this.form.invalid) {
    console.warn('Formulario inválido:', this.form.value);
    return;
  }

  const clientId = localStorage.getItem('userId')!;
  if (!clientId) {
    console.error('No se encontró clientId en localStorage');
    return;
  }

  const formValue = this.form.getRawValue();
  const establishmentId = this.establishmentId()!;
  const selectedDate = formValue.date;
  const selectedHour = formValue.hour;

  // ✅ Validar antes de continuar
  if (!selectedDate || !selectedHour) {
    console.error('Falta fecha u hora');
    return;
  }

  // 🕐 Combinar fecha y hora correctamente
  const matchDate = new Date(`${selectedDate}`);

  if (isNaN(matchDate.getTime())) {
    console.error('matchDate inválido:', matchDate);
    return;
  }

  // ✅ Si tu formulario tiene canchaId
const selectedCanchaId = formValue.canchaId;


  if (!selectedCanchaId) {
    console.error('No se encontró la cancha seleccionada');
    return;
  }

  const reservationRequest = {
    establishmentId: establishmentId,
    canchaId: selectedCanchaId,
    reservationDate: new Date(),
    reservationStatus: "PENDING",
    matchDate: matchDate,
  };

  console.log('Reserva enviada:', reservationRequest);

  this.reservationService.createReservation(reservationRequest).subscribe({
    next: (response) => {
      console.log('Reserva creada:', response);
      this.reserved.emit(response);
      this.form.reset();
    },
    error: (err) => {
      console.error('Error al crear reserva:', err);
    },
  });
}



}
