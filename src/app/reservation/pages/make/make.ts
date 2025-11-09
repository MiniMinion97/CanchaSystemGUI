import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../services/reservation/reservation';
import { EstablishmentService } from '../../../canchas/services/establishment/establishment-service';

@Component({
  selector: 'app-make',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './make.html',
  styleUrl: './make.css'
})
export class Make {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(Reservation);
  private readonly establishmentService = inject(EstablishmentService);

  readonly establishmentId = input<number>();
  readonly reserved = output<any>();

  readonly canchaTypes = signal<string[]>([]);
  readonly availableHours = signal<string[]>([]);
  readonly loading = signal(false);

  protected readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    canchaType: ['', Validators.required],
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
    if (this.form.invalid) return;
    this.reserved.emit(this.form.value);
  }
}
