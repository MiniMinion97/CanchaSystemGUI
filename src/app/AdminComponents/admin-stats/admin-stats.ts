import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../admin-service';
import { StatsResponse } from '../../canchas/models/stats-response';

@Component({
  selector: 'app-admin-stats',
  imports: [],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats {
  private readonly adminService = inject(AdminService);

  protected loading = signal<boolean>(true);
  protected stats = signal<StatsResponse | null>(null);
  protected error = signal<string | null>(null);

  protected fromDate = signal<string>('');
  protected untilDate = signal<string>('');

  constructor() {
    this.loadStats();
  }

  private loadStats(from?: string, until?: string) {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getStats(from, until).subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando estadísticas:', err);
        this.error.set('No se pudieron cargar las estadísticas');
        this.loading.set(false);
      }
    });
  }

  onFromChange(value: string) {
    this.fromDate.set(value);
  }

  onUntilChange(value: string) {
    this.untilDate.set(value);
  }

  applyFilter() {
    const from = this.fromDate();
    const until = this.untilDate();

    if (!from || !until) return;

    // input type="date" da "YYYY-MM-DD", el backend espera LocalDateTime ISO
    this.loadStats(`${from}T00:00:00`, `${until}T23:59:59`);
  }

  clearFilter() {
    this.fromDate.set('');
    this.untilDate.set('');
    this.loadStats();
  }
}