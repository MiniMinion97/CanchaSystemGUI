import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation/reservation-service';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';
import { ReservationRequest } from '../../models/reservation-request';
import { ReservationResponse } from '../../models/reservation-response';

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

  readonly reservationDate = input<Date>();
  readonly establishmentId = input<number>();
  readonly reserved = output<any>();

  readonly availableHours = signal<string[]>([]);
  readonly loading = signal(false);

  protected readonly today = new Date().toISOString().split('T')[0];

  // ✅ ARREGLADO: Signal correcto para tipos de cancha
  readonly canchaTypes = signal<string[]>([]);

  readonly reservationData = input<ReservationResponse>();
  readonly isEditing = input(false);
  readonly reservationEdited = output<ReservationResponse>();
  readonly reservationId = input<number>();

  // ✅ ARREGLADO: Form con tipo de cancha en vez de canchaId
  readonly form = this.fb.nonNullable.group({
    canchaType: ['', Validators.required],  // Cambiado de canchaId a canchaType
    date: ['', Validators.required],
    hour: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      console.log("🟩 isEditing:", this.isEditing());
      console.log("🟩 reservationData:", this.reservationData());
      console.log("🟩 reservationId:", this.reservationId());
      console.log("🟩 establishmentId input:", this.establishmentId());

      const data = this.reservationData();

      if (this.isEditing() && data) {
        const matchDate = data.matchDate;
        const [dateOnly, timeOnly] = matchDate.split("T");

        this.form.patchValue({
          canchaType: data.canchaType,  // Tipo de cancha
          date: dateOnly,
          hour: timeOnly.substring(0, 5)
        });

        // Cargar horarios disponibles al editar
        const estId = this.establishmentId() ?? data.establishmentId;
        if (estId && dateOnly && data.canchaType) {
          this.loadAvailableHours(estId, dateOnly, data.canchaType);
        }
      }

      // Cargar tipos de cancha
      const estIdFromInput = this.establishmentId();
      const estIdFromData = data?.establishmentId;
      const estIdToUse = estIdFromInput ?? estIdFromData;

      if (estIdToUse) {
        this.loadCanchaTypes(estIdToUse);
      }
    });
  }

  // ✅ ARREGLADO: Cargar tipos de cancha correctamente
  private loadCanchaTypes(establishmentId: number) {
    console.log('📋 Cargando tipos de cancha para establishment:', establishmentId);
    
    this.establishmentService.getCanchaTypes(establishmentId).subscribe({
      next: (types) => {
        console.log('✅ Tipos de cancha recibidos:', types);
        this.canchaTypes.set(types);
      },
      error: (err) => {
        console.error('❌ Error al cargar tipos de cancha:', err);
      }
    });
  }

  // ✅ Cargar horarios disponibles
  private loadAvailableHours(establishmentId: number, date: string, canchaType: string) {
  this.loading.set(true);
  this.reservationService.getAvailableHours(establishmentId, date, canchaType)
    .subscribe({
      next: (response) => {
        console.log("Horas del tipo seleccionado:", response);
        this.availableHours.set(response); // ahora es solo un array de horas
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.loading.set(false);
      }
    });
  }

  // ✅ Método para cargar horarios cuando cambia la fecha
  onDateChange(event: Event) {
  const date = (event.target as HTMLInputElement).value;
  const establishmentId = this.establishmentId();
  const canchaType = this.form.get('canchaType')?.value;

  if (date && establishmentId && canchaType) {
    this.loadAvailableHours(establishmentId, date, canchaType);
  }
}

onCanchaTypeChange() {
  const date = this.form.get('date')?.value;
  const canchaType = this.form.get('canchaType')?.value;
  const establishmentId = this.establishmentId();

  if (date && canchaType && establishmentId) {
    this.loadAvailableHours(establishmentId, date, canchaType);
  }
}

  // ✅ ARREGLADO: handleSubmit mejorado
  handleSubmit() {
    if (this.form.invalid) {
      console.warn('⚠️ Formulario inválido:', this.form.value);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.warn(`❌ Campo inválido: ${key}`, control.errors);
        }
      });
      return;
    }

    const formValue = this.form.getRawValue();
    const establishmentId = this.establishmentId();
    
    if (!establishmentId) {
      console.error('❌ No hay establishmentId');
      return;
    }

    const selectedDate = formValue.date;
    const selectedHour = formValue.hour;
    const selectedCanchaType = formValue.canchaType;

    if (!selectedDate || !selectedHour || !selectedCanchaType) {
      console.error('❌ Faltan datos requeridos:', { selectedDate, selectedHour, selectedCanchaType });
      return;
    }

    // Crear la fecha del partido
    const matchDate = new Date(`${selectedDate}T${selectedHour}`);
    if (isNaN(matchDate.getTime())) {
      console.error('❌ Fecha inválida:', matchDate);
      return;
    }

    console.log('📤 Enviando reserva:', {
      establishmentId,
      canchaType: selectedCanchaType,
      matchDate: matchDate.toISOString(),
      isEditing: this.isEditing()
    });

    // 🟦 SI ES EDICIÓN
    if (this.isEditing()) {
      const reservationId = this.reservationId();
      
      if (!reservationId) {
        console.error('❌ No hay reservationId para editar');
        return;
      }

      const updateRequest: ReservationRequest = {
        establishmentId,
        canchaType: selectedCanchaType,  // Enviar tipo en vez de ID
        reservationStatus: "PENDING",
        reservationDate: new Date(this.reservationData()!.reservationDate),
        matchDate
      };

      console.log('🔄 Actualizando reserva:', updateRequest);

      this.reservationService.updateReservation(reservationId, updateRequest)
        .subscribe({
          next: (res) => {
            console.log('✅ Reserva actualizada:', res);
            this.reservationEdited.emit(res);
          },
          error: (err) => {
            console.error('❌ Error al actualizar reserva:', err);
            alert('Error al actualizar la reserva. Por favor, intenta nuevamente.');
          }
        });

      return;
    }

    // 🟩 SI ES CREACIÓN
    const createRequest: ReservationRequest = {
      establishmentId,
      canchaType: selectedCanchaType,  // Enviar tipo en vez de ID
      reservationDate: new Date(),
      reservationStatus: "PENDING",
      matchDate
    };

    console.log('➕ Creando reserva:', createRequest);

    this.reservationService.createReservation(createRequest)
      .subscribe({
        next: (res) => {
          console.log('✅ Reserva creada:', res);
          this.reserved.emit(res);
          this.form.reset();
        },
        error: (err) => {
          console.error('❌ Error al crear reserva:', err);
          alert('Error al crear la reserva. Por favor, intenta nuevamente.');
        }
      });
  }
}