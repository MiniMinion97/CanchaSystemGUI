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

readonly canchaTypes = signal<{ id: number; type: string }[]>([]);


  readonly reservationData = input<ReservationResponse>();
  readonly isEditing = input(false);
  readonly reservationEdited = output<ReservationResponse>();
  readonly reservationId = input<number>();


readonly form = this.fb.nonNullable.group({
  canchaId: [0, Validators.required],
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

  if (this.isEditing() && this.reservationData()) {
  const data = this.reservationData()!;

  const matchDate = data.matchDate;
  const [dateOnly, timeOnly] = matchDate.split("T");

  this.form.patchValue({
    canchaId: data.cancha?.id,
    date: dateOnly,
    hour: timeOnly.substring(0, 5)
  });

   // 🟦 CARGAR HORARIOS DISPONIBLES AL INICIAR EDICIÓN
  const estId = this.establishmentId() ?? data.cancha?.establishment?.id;
  if (estId) {
    this.loadAvailableHours(estId, dateOnly);
  }
}


  // Cargar tipos de cancha: preferir el input establishmentId(); si no existe, intentar extraer de reservationData
  const estIdFromInput = this.establishmentId();
  const estIdFromData = data ? ( (data as any).establishmentId ?? null ) : null;
  const estIdToUse = estIdFromInput ?? estIdFromData;

  if (estIdToUse) {
    this.loadCanchaTypes(estIdToUse);
  }
});

console.log("reservationData recibido:", this.reservationData());
console.log("establishmentId recibido:", this.establishmentId());
console.log("canchaTypes:", this.canchaTypes());

}


private loadCanchaTypes(establishmentId: number) {
  this.establishmentService.getCanchaTypes(establishmentId).subscribe((types) => {
    // Convertir string[] a { id, type }[]
    const typesWithId = types.map((type, index) => ({
      id: index,
      type: type
    }));
    this.canchaTypes.set(typesWithId);
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
        // Si estoy editando, volver a setear el valor del patch
if (this.isEditing()) {
  const hour = this.reservationData()?.matchDate.split("T")[1]?.substring(0, 5);
  if (hour) this.form.patchValue({ hour });
}
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

  const formValue = this.form.getRawValue();
  const establishmentId = this.establishmentId()!;
  const reservationId = this.reservationId();
  const selectedDate = formValue.date;
  const selectedHour = formValue.hour;
  const selectedCanchaId = formValue.canchaId;
  const reservationDate = this.reservationDate();

  if (!selectedDate || !selectedHour || !selectedCanchaId) {
    console.error('Faltan datos requeridos');
    return;
  }

  const matchDate = new Date(`${selectedDate}T${selectedHour}`);
  if (isNaN(matchDate.getTime())) {
    console.error('Fecha inválida:', matchDate);
    return;
  }

  // 🟦 SI ES EDICIÓN ------------------------------------------
  if (this.isEditing()) {

    
   const updateRequest: ReservationRequest = {
  establishmentId,
  canchaId: selectedCanchaId,
  reservationStatus: "PENDING",
  reservationDate: new Date(this.reservationData()!.reservationDate), // 👈 RECUPERO LA ORIGINAL
  matchDate
};



console.log("🟥 updateRequest:", updateRequest);

    this.reservationService.updateReservation(reservationId!, updateRequest)
      .subscribe({
        next: (res) => this.reservationEdited.emit(res),
        error: (err) => console.error("Error al actualizar reserva", err)
      });

    return;
  }

  // 🟩 SI ES CREACIÓN ------------------------------------------
  const createRequest: ReservationRequest = {
    establishmentId,
    canchaId: selectedCanchaId,
    reservationDate: new Date(), // SOLO AQUÍ
    reservationStatus: "PENDING",
    matchDate
  };

  this.reservationService.createReservation(createRequest)
    .subscribe({
      next: (res) => this.reserved.emit(res),
      error: (err) => console.error("Error al crear reserva", err)
    });

}





}
